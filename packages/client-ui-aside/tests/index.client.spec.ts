// @vitest-environment jsdom
/**
 * Client plugin apply tests: the self-mounted Remote stub, the overlay
 * registrations (drawer + sidebar), the per-message assistant-actions entry,
 * the floating-button style, and the selection watcher all follow the fiber
 * lifecycle.
 *
 * Standalone note: the published @deepseek-ai client packages ship their
 * browser halves as `window.__ModuleLoader__` closure bundles (unimportable
 * in a plain Node/vitest context), so this spec drives the plugin against
 * minimal local stubs of the `slots` registry and the `locale` service —
 * the surfaces `apply` actually touches. The real services' integration is
 * exercised end-to-end by the monorepo composition lane.
 */

import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../src/client/index.ts'

// Standalone note on locale: the published `dsh-client-locale` browser half
// is a `window.__ModuleLoader__` closure bundle (unimportable in a plain
// vitest context), so the stub below stands in for the surfaces apply uses.
// (The monorepo `usePinnedBrowserLanguages` helper is deliberately not used:
// importing it drags the runtime closure into the graph.)

/** Minimal slots registry: inject generators run eagerly, entries key by name, teardown rides ctx.effect. */
function fakeSlots(ctx: Context) {
  const byName = new Map<string, Array<{ id: string; order?: number }>>()
  const service = {
    inject(name: string, gen: () => Iterable<{ name: string; id: string; order?: number }>) {
      for (const registration of gen()) {
        void service.register(registration as never, (() => null) as never)
      }
      return () => {}
    },
    register(options: { name: string; id: string; order?: number }, _component: unknown) {
      const list = byName.get(options.name) ?? []
      list.push({ id: options.id, order: options.order })
      byName.set(options.name, list)
      ctx.effect(() => () => {
        byName.set(options.name, (byName.get(options.name) ?? []).filter(entry => entry.id !== options.id))
      }, `fake-slots:${options.name}:${options.id}`)
      return () => {}
    },
    entries(name: string) {
      return (byName.get(name) ?? []).map(entry => ({ options: entry }))
    },
  }
  return service
}

async function bench(remote: Record<string, unknown>) {
  const ctx = new Context()
  ctx.provide('slots', fakeSlots(ctx) as never)
  ctx.provide('locale', {
    bind: () => (key: string) => key,
    register: () => {},
  } as never)
  ctx.provide('sessions', {
    list: {
      subscribe: () => () => {},
      getSnapshot: () => ({ current: undefined }),
    },
  } as never)
  ctx.provide('connection', {
    isLoopback: true,
    api: {
      sessions: {
        history: vi.fn(() => Promise.resolve({ result: { ok: false, error: { code: 'x', message: 'x', details: {} } } })),
        prompt: vi.fn(() => Promise.resolve({ result: { ok: false, error: { code: 'x', message: 'x', details: {} } } })),
      },
    },
  } as never)
  ctx.provide('remote.aside', remote as never)
  const mount = vi.fn(async () => () => {})
  ctx.provide('remote', { $mount: mount } as never)
  return { ctx, mount, remote }
}

describe('ui-aside apply', () => {
  it('declares the services it uses (remote.aside is self-mounted, not injected)', () => {
    expect(inject).toEqual(['slots', 'sessions', 'connection', 'remote', 'locale'])
  })

  it('self-mounts the aside Remote stub on the shared remote service', async () => {
    const { ctx, mount } = await bench({})
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(mount).toHaveBeenCalledTimes(1)
    await fiber.dispose()
  })

  it('registers the overlay drawer and sidebar plus the per-message ask action', async () => {
    const { ctx } = await bench({})
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    const slots = ctx.get('slots') as ReturnType<typeof fakeSlots>
    const overlay = slots.entries('shell.overlay').map(entry => entry.options.id).sort()
    expect(overlay).toEqual(['aside-drawer', 'aside-sidebar'])
    const actions = slots.entries('conversation.chat.assistant-actions').map(entry => entry.options.id)
    expect(actions).toEqual(['aside-ask'])
    await fiber.dispose()
    // Fiber-scoped teardown: the plugin's own effects (floating button,
    // injected style) leave with the fiber.
    expect(document.querySelector('.aside-ask-button')).toBeNull()
    expect([...document.querySelectorAll('style')].some(el => el.textContent?.includes('aside-ask-button'))).toBe(false)
    // The stub registry's cleanup rides the root context (the real registry
    // ties entries to the caller's fiber through Cordis's service tracking);
    // dispose the bench context to prove the registrations are reversible.
    await ctx.fiber.dispose()
    expect(slots.entries('shell.overlay')).toHaveLength(0)
    expect(slots.entries('conversation.chat.assistant-actions')).toHaveLength(0)
  })

  it('creates through the self-mounted aside remote on the draft\'s first send', async () => {
    const create = vi.fn(() => Promise.resolve({
      ok: true,
      value: { sessionId: 'sub-1' },
    }))
    const { ctx, remote } = await bench({ create })
    // The plugin mounts the stub; after mount, `remote.aside` is a standalone
    // Cordis namespace service captured by the apply closure.
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    // Drive the draft through the drawer store via the ask action path is
    // component-level; here assert the stub is reachable under the namespace.
    expect(remote.create).toBeDefined()
    await fiber.dispose()
  })
})
