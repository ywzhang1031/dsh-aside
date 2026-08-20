/**
 * Aside gateway tests over the real agent registry: creation lineage, the
 * fork seed, the read-only/never seeds, the anchor persistence/recovery
 * contract (atomic at create), full-anchor idempotency, nested-aside marker
 * scoping, and the classified failure modes. The gateway only reads its
 * collaborators, so the read-only world composition is injected as a fake here
 * and covered separately by {@link composeReadOnlyWorld} in compose.spec.ts.
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
import { anchorKey, encodeAnchor, parseAnchor, type AsideAnchor } from '../src/types.ts'

const contexts: Context[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
})

const PARENT_ID = SessionId('parent-session')
const TEST_ROUTE = { provider: 'test-provider', model: 'test-model' }

const ANCHOR: AsideAnchor = {
  messageId: 'parent-msg',
  exact: 'deepseek harness mounts plugins',
  prefix: 'The ',
  suffix: '.',
  occurrence: 1,
  startOffset: 4,
}

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

describe('anchor codec', () => {
  it('round-trips an anchor through a user message, including CJK text', () => {
    const anchor: AsideAnchor = {
      messageId: 'm-1',
      exact: '什么是 sandbox，以及为什么需要 fork？',
      prefix: '前置',
      suffix: '后置',
      occurrence: 2,
      startOffset: 7,
    }
    const encoded = encodeAnchor(anchor)
    expect(encoded).toContain('[aside:')
    expect(parseAnchor(`问题\n${encoded}\n引用原文：`)).toEqual(anchor)
  })

  it('returns undefined for messages without a marker or with malformed markers', () => {
    expect(parseAnchor('普通问题')).toBeUndefined()
    expect(parseAnchor('[aside:not-json]')).toBeUndefined()
    expect(parseAnchor('[aside:%E2%80%9Cnot-object]')).toBeUndefined()
  })

  it('anchorKey distinguishes every disambiguation field', () => {
    expect(anchorKey(ANCHOR)).toBe(anchorKey({ ...ANCHOR }))
    expect(anchorKey(ANCHOR)).not.toBe(anchorKey({ ...ANCHOR, occurrence: 2 }))
    expect(anchorKey(ANCHOR)).not.toBe(anchorKey({ ...ANCHOR, messageId: null }))
    expect(anchorKey(ANCHOR)).not.toBe(anchorKey({ ...ANCHOR, prefix: 'Other ' }))
    expect(anchorKey(ANCHOR)).not.toBe(anchorKey({ ...ANCHOR, startOffset: 5 }))
  })
})

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
  it('declares every required Host service', () => {
    expect(AsideGateway.inject).toEqual(['agents', 'sessions'])
  })

  it('publishes direct create and list methods under the aside namespace', async () => {
    const { gateway } = await harness()
    expect(gateway.typertRemote).toMatchObject({
      serviceKey: 'aside',
      namespace: 'aside',
    })
    expect(remoteMethods(gateway)).toEqual([
      { method: 'create', invocation: { kind: 'direct' } },
      { method: 'list', invocation: { kind: 'direct' } },
    ])
  })

  it('creates a child with aside lineage, read-only sandbox, and never approval', async () => {
    const { ctx, gateway } = await harness()
    const result = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })

    expect(result.record.subSessionId).toMatch(/^aside-/)
    expect(result.record).toMatchObject({
      parentSessionId: PARENT_ID,
      anchor: ANCHOR,
      schemaVersion: 1,
    })
    const agent = ctx.agents.get(SessionId(result.record.subSessionId))
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

  it('persists the anchor atomically in the child log at create time', async () => {
    const { ctx, gateway } = await harness()
    const created = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })
    const child = ctx.agents.get(SessionId(created.record.subSessionId))!

    // The anchor marker is already in the child's own log, before any client prompt.
    const ownEvents = child.session.events.filter(event => event.seq >= (child.session.header.seedLength ?? 0))
    const firstUser = ownEvents.find(event => event.type === 'user/message')
    expect(firstUser).toBeDefined()
    const blocks = (firstUser!.data as { content?: unknown }).content
    const text = (Array.isArray(blocks) ? blocks : [])
      .map((block: unknown) => (block as { text?: string } | null)?.text ?? '')
      .join('\n')
    expect(parseAnchor(text)).toEqual(ANCHOR)
    // And list() already recovers it without any further client action.
    const listed = await gateway.list({ parentSessionId: PARENT_ID })
    expect(listed.records).toHaveLength(1)
    expect(listed.records[0]).toMatchObject({ subSessionId: created.record.subSessionId, anchor: ANCHOR })
  })

  it('rejects a failed durability barrier and reuses the same live child on retry', async () => {
    const { ctx, gateway } = await harness()
    vi.spyOn(ctx.sessions, 'flush').mockRejectedValueOnce(new Error('disk full'))

    await expect(gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR }))
      .rejects.toThrow('disk full')
    const afterFailure = ctx.agents.list()
      .filter(agent => agent.session.header.parentSession === PARENT_ID)
    expect(afterFailure).toHaveLength(1)

    const retried = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })
    expect(retried.record.subSessionId).toBe(afterFailure[0]!.session.id)
    expect(ctx.agents.list().filter(agent => agent.session.header.parentSession === PARENT_ID)).toHaveLength(1)
  })

  it('composes the read-only world into the child agent', async () => {
    const { ctx, gateway, compose } = await harness()
    const result = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })
    expect(compose).toHaveBeenCalledTimes(1)
    expect(ctx.agents.get(SessionId(result.record.subSessionId))).toBeDefined()
  })

  it("forks the parent's completed-turn history into the child", async () => {
    const { ctx, gateway } = await harness()
    appendCompletedTurn(ctx, 'The deepseek harness mounts plugins.')
    const result = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })

    const child = ctx.agents.get(SessionId(result.record.subSessionId))!
    expect(child.session.header.seedLength).toBeGreaterThan(0)
    const derived = child.session.deriveMessages()
    expect(derived.some(message => JSON.stringify(message.content).includes('deepseek harness'))).toBe(true)
    // The read-only seeds land AFTER the inherited seed, still in effect.
    expect(effectiveSandboxMode(child.session.events)).toBe('read-only')
  })

  it('lists only asides for the requested parent', async () => {
    const { ctx, gateway } = await harness()
    const first = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })

    const otherParent = SessionId('other-parent')
    await ctx.agents.create({ sessionId: otherParent, setup: async () => {} })
    await gateway.create({
      parentSessionId: otherParent,
      anchor: { ...ANCHOR, exact: 'another span', messageId: 'other-msg' },
    })

    const listed = await gateway.list({ parentSessionId: PARENT_ID })
    expect(listed.records).toHaveLength(1)
    expect(listed.records[0]!.subSessionId).toBe(first.record.subSessionId)
  })

  it('is idempotent for an identical anchor but not for a different occurrence', async () => {
    const { ctx, gateway } = await harness()
    const first = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })
    const second = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })
    expect(second.record.subSessionId).toBe(first.record.subSessionId)

    // A different occurrence of the same text is a different aside.
    const third = await gateway.create({
      parentSessionId: PARENT_ID,
      anchor: { ...ANCHOR, occurrence: 2 },
    })
    expect(third.record.subSessionId).not.toBe(first.record.subSessionId)
    expect(ctx.agents.list().filter(agent => agent.session.header.parentSession === PARENT_ID)).toHaveLength(2)
  })

  it('coalesces concurrent creates for the same full anchor identity', async () => {
    const { ctx, gateway } = await harness()
    const request = { parentSessionId: PARENT_ID, anchor: ANCHOR }

    const [first, second] = await Promise.all([
      gateway.create(request),
      gateway.create(request),
    ])

    expect(second.record.subSessionId).toBe(first.record.subSessionId)
    expect(ctx.agents.list().filter(agent => agent.session.header.parentSession === PARENT_ID)).toHaveLength(1)
  })

  it('recovers the child\'s own anchor, never an inherited ancestor marker', async () => {
    const { ctx, gateway } = await harness()
    // Aside A under the parent.
    const a = await gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR })
    const aChild = ctx.agents.get(SessionId(a.record.subSessionId))!
    // Give A a completed turn so a nested aside can fork from it.
    aChild.session.append('turn/start', { turn: 1 } as never)
    aChild.session.append('user/message', {
      id: 'a-question',
      role: 'user',
      content: [{ type: 'text', text: 'question a' }],
      source: { kind: 'user' },
    } as never, { surfaceOp: 'append' })
    aChild.session.append('turn/end', { turn: 1, reason: { kind: 'completed' } } as never)

    // Aside B forked from A (A's child session is B's parent).
    const bAnchor: AsideAnchor = { messageId: 'a-msg', exact: 'question a', prefix: '', suffix: '', occurrence: null, startOffset: null }
    const b = await gateway.create({ parentSessionId: a.record.subSessionId, anchor: bAnchor })

    const listed = await gateway.list({ parentSessionId: a.record.subSessionId })
    expect(listed.records).toHaveLength(1)
    expect(listed.records[0]!.subSessionId).toBe(b.record.subSessionId)
    expect(listed.records[0]!.anchor).toEqual(bAnchor)
  })

  it('fails classified when the parent session does not exist', async () => {
    const { gateway } = await harness({ parent: false })
    await expect(gateway.create({ parentSessionId: PARENT_ID, anchor: ANCHOR }))
      .rejects.toMatchObject({ name: 'AsideError', code: 'parent-not-found' })
  })

  it('exported error classifies its code', () => {
    const error = new AsideError('parent-not-found', 'no parent')
    expect(error.code).toBe('parent-not-found')
    expect(error.name).toBe('AsideError')
  })
})
