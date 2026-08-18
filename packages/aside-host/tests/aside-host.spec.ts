/**
 * Aside gateway tests over the real agent registry: creation lineage, the
 * fork seed, the read-only/never seeds, and the classified failure modes.
 * The gateway only reads its collaborators, so the read-only world
 * composition is injected as a fake here and covered separately by
 * {@link composeReadOnlyWorld} in compose.spec.ts.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import AgentLoop from '@deepseek-ai/dsh-agent-loop'
import { mountAgentLoopTestDependencies } from '@deepseek-ai/dsh-agent-loop-testkit'
import { remoteMethods } from '@deepseek-ai/dsh-typert-protocol'
import { SessionId } from '@deepseek-ai/dsh-session'
import { effectiveSandboxMode } from '@deepseek-ai/dsh-sandbox-policy'
import { effectiveApprovalPolicy } from '@deepseek-ai/dsh-user-approval'
import AsideGateway, { AsideError, forkSeedOf } from '../src/index.ts'

const contexts: Context[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
})

const PARENT_ID = SessionId('parent-session')
const TEST_ROUTE = { provider: 'test-provider', model: 'test-model' }

/** Append one completed turn with a known user text to the parent. */
function appendCompletedTurn(ctx: Context, text: string): void {
  const parent = ctx.agents.get(PARENT_ID)!
  parent.session.append('turn/start', { turn: 1, trigger: { kind: 'message', source: { kind: 'user' } } } as never)
  parent.session.append('user/message', {
    id: 'parent-msg',
    role: 'user',
    content: [{ type: 'text', text }],
    source: { kind: 'user' },
  } as never, { surfaceOp: 'append' })
  parent.session.append('turn/end', { turn: 1, reason: { kind: 'completed' } } as never)
}

async function harness(options: { parent?: boolean } = {}): Promise<{
  ctx: Context
  gateway: AsideGateway
  compose: ReturnType<typeof vi.fn>
}> {
  const { parent = true } = options
  const ctx = new Context()
  contexts.push(ctx)
  await mountAgentLoopTestDependencies(ctx)
  await ctx.plugin(AgentLoop, { agents: [] })
  if (parent) {
    await ctx.agents.create({
      sessionId: PARENT_ID,
      agentOptions: TEST_ROUTE,
      meta: { cwd: '/parent-work' },
      setup: async () => {},
    })
  }
  const compose = vi.fn(async () => {})
  await ctx.plugin(AsideGateway, { compose })
  const gateway = ctx.get('aside') as AsideGateway
  return { ctx, gateway, compose }
}

describe('forkSeedOf', () => {
  it('cuts through the last completed turn, keeping trailing out-of-band appends', () => {
    const events = [
      { type: 'turn/start', seq: 0 },
      { type: 'user/message', seq: 1 },
      { type: 'turn/end', seq: 2 },
      { type: 'session/title', seq: 3 },
      { type: 'turn/start', seq: 4 },
      { type: 'user/message', seq: 5 },
    ]
    expect(forkSeedOf(events as never).map(e => e.seq)).toEqual([0, 1, 2, 3])
  })

  it('yields an empty seed without a completed turn', () => {
    expect(forkSeedOf([
      { type: 'turn/start', seq: 0 },
      { type: 'user/message', seq: 1 },
    ] as never)).toEqual([])
  })
})

describe('AsideGateway', () => {
  it('publishes one direct create method under the aside namespace', async () => {
    const { gateway } = await harness()
    expect(gateway.typertRemote).toMatchObject({
      serviceKey: 'aside',
      namespace: 'aside',
    })
    expect(remoteMethods(gateway)).toEqual([
      { method: 'create', invocation: { kind: 'direct' } },
    ])
  })

  it('creates a child with aside lineage, read-only sandbox, and never approval', async () => {
    const { ctx, gateway } = await harness()
    const result = await gateway.create({ parentSessionId: PARENT_ID })

    expect(result.sessionId).toMatch(/^aside-/)
    const agent = ctx.agents.get(SessionId(result.sessionId))
    expect(agent).toBeDefined()
    const header = agent!.session.header
    expect(header).toMatchObject({
      parentSession: PARENT_ID,
      cwd: '/parent-work',
    })
    // Stock lineage only: the aside carries parentSession, never a custom origin.
    expect(header.origin).toBeUndefined()
    // The child inherits the parent's model route.
    expect(agent!.options).toEqual(TEST_ROUTE)
    expect(effectiveSandboxMode(agent!.session.events)).toBe('read-only')
    expect(effectiveApprovalPolicy(agent!.session.events)).toBe('never')
  })

  it('composes the read-only world into the child agent', async () => {
    const { ctx, gateway, compose } = await harness()
    const result = await gateway.create({ parentSessionId: PARENT_ID })
    expect(compose).toHaveBeenCalledTimes(1)
    expect(ctx.agents.get(SessionId(result.sessionId))).toBeDefined()
  })

  it('forks the parent\'s completed-turn history into the child', async () => {
    const { ctx, gateway } = await harness()
    appendCompletedTurn(ctx, 'The deepseek harness mounts plugins.')
    const result = await gateway.create({ parentSessionId: PARENT_ID })

    const child = ctx.agents.get(SessionId(result.sessionId))!
    expect(child.session.header.seedLength).toBeGreaterThan(0)
    const derived = child.session.deriveMessages()
    expect(derived.some(message => JSON.stringify(message.content).includes('deepseek harness'))).toBe(true)
    // The read-only seeds land AFTER the inherited seed, still in effect.
    expect(effectiveSandboxMode(child.session.events)).toBe('read-only')
  })

  it('fails classified when the parent session does not exist', async () => {
    const { gateway } = await harness({ parent: false })
    await expect(gateway.create({ parentSessionId: PARENT_ID }))
      .rejects.toMatchObject({ name: 'AsideError', code: 'parent-not-found' })
  })

  it('exported error classifies its code', () => {
    const error = new AsideError('parent-not-found', 'no parent')
    expect(error.code).toBe('parent-not-found')
    expect(error.name).toBe('AsideError')
  })
})
