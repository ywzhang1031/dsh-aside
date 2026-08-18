/**
 * Real-composition test for {@link composeReadOnlyWorld}: the plugin-owned
 * read-only world mounts every stock tool package into a scoped context,
 * with the host-plane services stubbed to their registration-time surfaces
 * (execution bodies are never invoked). Asserts the exact model-facing
 * toolset an aside gets: read/search/shell/web/skill tools present, and no
 * delegation or long-running machinery.
 */

import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { mountAgentLoopTestDependencies } from '@deepseek-ai/dsh-agent-loop-testkit'
import { createScope, scopeOf } from '@deepseek-ai/dsh-scope'
import { composeReadOnlyWorld } from '../src/index.ts'

const contexts: Context[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
})

/**
 * Registration-time surfaces of the host services the tool packages inject:
 * `shell`/`fs` expose a sandbox mode (undefined ⇒ no escalation machinery),
 * `skills` a provider registry, and the rest are touched only at execution.
 */
async function harness(): Promise<{ ctx: Context; scope: ReturnType<typeof createScope> }> {
  const ctx = new Context()
  contexts.push(ctx)
  await mountAgentLoopTestDependencies(ctx)
  ctx.provide('shell', { sandboxMode: undefined } as never)
  ctx.provide('shellEnv', {} as never)
  ctx.provide('fs', { sandboxMode: undefined } as never)
  ctx.provide('subprocess', {} as never)
  ctx.provide('web', {} as never)
  ctx.provide('skills', { registerProvider: () => () => {} } as never)
  const scope = createScope(ctx, { kind: 'aside-compose-test' })
  return { ctx, scope }
}

describe('composeReadOnlyWorld', () => {
  it('mounts the read-only toolset into the agent scope', async () => {
    const { ctx, scope } = await harness()
    await composeReadOnlyWorld(scope.ctx)

    const key = scopeOf(scope.ctx)
    expect(key).toBeDefined()
    const names = new Set(ctx.tools.schemas(key).map(schema => schema.name))
    // Read + search surface.
    for (const name of ['read', 'glob', 'grep', 'bash', 'web_search', 'web_fetch', 'skill']) {
      expect(names.has(name), `expected tool "${name}"`).toBe(true)
    }
    // Stock tool-fs also registers the mutating pair; the seeded read-only
    // posture refuses every write at execution (policy + OS sandbox).
    expect(names.has('write')).toBe(true)
    expect(names.has('edit')).toBe(true)
    // Deliberately absent: delegation and long-running machinery.
    expect(names.has('subagent')).toBe(false)
    expect(names.has('workflow')).toBe(false)
    expect(names.has('ralph')).toBe(false)
  })
})
