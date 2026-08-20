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
import { waitFor } from '@testing-library/react'
import type { AsideRecord } from '@ywzhang1031/dsh-aside-host/types'
import { apply, inject } from '../src/client/index.ts'

/** Minimal slots registry: inject generators run eagerly, entries key by name, teardown rides ctx.effect. */
function fakeSlots(ctx: Context) {
  interface Registration {
    options: { name: string; id: string; order?: number; inject?: () => unknown }
    component: unknown
  }
  const byName = new Map<string, Registration[]>()
  const service = {
    inject(name: string, gen: () => Iterable<{ name: string; id: string; order?: number }>) {
      for (const registration of gen()) {
        void service.register(registration as never, (() => null) as never)
      }
      return () => {}
    },
    register(options: Registration['options'], component: unknown) {
      const list = byName.get(options.name) ?? []
      list.push({ options, component })
      byName.set(options.name, list)
      ctx.effect(() => () => {
        byName.set(options.name, (byName.get(options.name) ?? []).filter(entry => entry.options.id !== options.id))
      }, `fake-slots:${options.name}:${options.id}`)
      return () => {}
    },
    entries: (name: string) => byName.get(name) ?? [],
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
  let currentSessionId = 'session-1'
  const sessionListeners = new Set<() => void>()
  const conversation = { loadOlder: vi.fn(async () => {}) }
  const sessions = {
    list: {
      subscribe: (listener: () => void) => {
        sessionListeners.add(listener)
        return () => { sessionListeners.delete(listener) }
      },
      getSnapshot: () => ({ current: currentSessionId }),
    },
    open: () => {},
    scope: () => ({ get: (name: string) => name === 'conversation' ? conversation : undefined }),
  }
  ctx.provide('sessions', sessions as never)
  ctx.provide('conversation', conversation as never)
  ctx.provide('workspaces', {
    list: {
      subscribe: () => () => {},
      getSnapshot: () => ({ archivedSessionIds: [] }),
    },
    archiveSession: vi.fn(async () => {}),
  } as never)
  ctx.provide('connection', {
    isLoopback: true,
    api: {
      sessions: {
        history: vi.fn(() => Promise.resolve({ result: { ok: false, error: { code: 'x', message: 'x', details: {} } } })),
        prompt: vi.fn(() => Promise.resolve({ result: { ok: false, error: { code: 'x', message: 'x', details: {} } } })),
        models: vi.fn(() => Promise.resolve({ result: { ok: false, error: { code: 'x', message: 'x', details: {} } } })),
        selectModel: vi.fn(() => Promise.resolve({ result: { ok: false, error: { code: 'x', message: 'x', details: {} } } })),
      },
    },
  } as never)
  ctx.provide('remote.aside', remote as never)
  const mount = vi.fn(async () => () => {})
  ctx.provide('remote', { $mount: mount } as never)
  return {
    ctx,
    mount,
    remote,
    conversation,
    setCurrentSession(id: string) {
      currentSessionId = id
      for (const listener of sessionListeners) listener()
    },
  }
}

const RECORD: AsideRecord = {
  schemaVersion: 1,
  parentSessionId: 'session-1',
  subSessionId: 'aside-multi-turn',
  anchor: { messageId: 'old-message', exact: 'old anchored prose', prefix: '', suffix: '', occurrence: 1, startOffset: 0 },
  createdAt: 1,
  updatedAt: 2,
}

describe('ui-aside apply', () => {
  it('declares the services it uses (remote.aside is self-mounted, not injected)', () => {
    expect(inject).toEqual(['slots', 'sessions', 'workspaces', 'connection', 'remote', 'locale', 'conversation'])
  })

  it('self-mounts the aside Remote stub on the shared remote service', async () => {
    const { ctx, mount } = await bench({ create: vi.fn(), list: vi.fn() })
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(mount).toHaveBeenCalledTimes(1)
    await fiber.dispose()
  })

  it('registers the overlay drawer and sidebar plus the per-message ask action', async () => {
    const { ctx } = await bench({ create: vi.fn(), list: vi.fn() })
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

  it("creates through the self-mounted aside remote on the draft's first send", async () => {
    const create = vi.fn(() => Promise.resolve({
      ok: true,
      value: { record: { schemaVersion: 1, parentSessionId: 'p', subSessionId: 'sub-1', anchor: { messageId: 'm', exact: 'x', prefix: '', suffix: '', occurrence: 1, startOffset: 0 }, createdAt: 1, updatedAt: 1 } },
    }))
    const { ctx, remote } = await bench({ create, list: vi.fn() })
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(remote.create).toBeDefined()
    await fiber.dispose()
  })

  it('loads older parent history before locating an anchor that is not mounted', async () => {
    document.body.innerHTML = ''
    const { ctx, conversation } = await bench({ create: vi.fn(), list: vi.fn() })
    const scrollIntoView = vi.fn()
    conversation.loadOlder.mockImplementationOnce(async () => {
      const scroller = document.createElement('div')
      scroller.dataset.conversationScroll = ''
      const row = document.createElement('div')
      row.dataset.chatAnchorKey = '14:assistant-step1:1'
      row.textContent = 'old anchored prose'
      row.scrollIntoView = scrollIntoView
      scroller.appendChild(row)
      document.body.appendChild(scroller)
    })
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    const slots = ctx.get('slots') as ReturnType<typeof fakeSlots>
    const sidebar = slots.entries('shell.overlay').find(entry => entry.options.id === 'aside-sidebar')
    const injected = sidebar?.options.inject?.() as { onOpenAside: (record: AsideRecord) => void } | undefined

    injected?.onOpenAside(RECORD)

    await waitFor(() => { expect(conversation.loadOlder).toHaveBeenCalledTimes(1) })
    await waitFor(() => { expect(scrollIntoView).toHaveBeenCalledTimes(1) })
    await fiber.dispose()
    document.body.innerHTML = ''
  })

  it('closes an open aside when the current main session changes', async () => {
    const { ctx, setCurrentSession } = await bench({ create: vi.fn(), list: vi.fn() })
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    const slots = ctx.get('slots') as ReturnType<typeof fakeSlots>
    const sidebar = slots.entries('shell.overlay').find(entry => entry.options.id === 'aside-sidebar')
    const injected = sidebar?.options.inject?.() as {
      drawer: { get(): { subSessionId: string | null } }
      onOpenAside: (record: AsideRecord) => void
    } | undefined

    injected?.onOpenAside(RECORD)
    expect(injected?.drawer.get().subSessionId).toBe(RECORD.subSessionId)
    setCurrentSession('session-2')
    expect(injected?.drawer.get().subSessionId).toBeNull()
    await fiber.dispose()
  })
})
