/**
 * Aside Host gateway: the Remote domain that creates and inspects
 * read-only side conversations ("旁注").
 *
 * An aside is an ordinary Session with three fixed properties, all applied
 * at creation so nothing inside the conversation can widen them later:
 *
 * - **Composition** — the agent is composed from a read-only world built by
 *   {@link composeReadOnlyWorld} inside the agent factory's `setup`: read
 *   tools, shell, file search, web search/fetch, skills, and a read-only
 *   persona. No mutating filesystem tool is registered by the plugin itself,
 *   and every registered write tool (stock `tool-fs` ships `write`/`edit`)
 *   is deterministically refused at execution: the sandbox mode and the
 *   approval policy below close every widening channel, so a write attempt
 *   never reaches the filesystem.
 * - **Context** — the aside is forked from its parent: its log is seeded with
 *   the parent's balanced completed-turn prefix (the same cut the `fork` RPC
 *   uses), so the side conversation reads the main conversation's state
 *   without sharing its token budget.
 * - **Sandbox** — `sandbox/mode: read-only` is seeded into the session log,
 *   so every confined bash/fs call afterwards folds to the read-only OS-level
 *   sandbox. A write attempt never reaches the filesystem.
 * - **Approval** — `approval/policy: never` is seeded beside it, so even the
 *   sandbox escalation channel resolves deterministically to `rejected`.
 *
 * Both seeds ride the session log, so they survive restart by replay.
 *
 * ## Persistence of the aside relationship
 *
 * The parent link is the child session's durable `parentSession` header. The
 * full anchor (messageId, exact prose, prefix/suffix disambiguation, offsets)
 * is encoded into the child's first user message by {@link encodeAnchor} and
 * therefore lives in the durable child log. {@link AsideGateway.list} recovers
 * every aside for a parent by listing persisted session headers, filtering on
 * `parentSession`, and reading each child's first message — no localStorage,
 * no DSH source patch, no custom session event type (see the module note in
 * types.ts for why a custom event is not load-survivable on stock 0.1.0-rc.7).
 *
 * The gateway composes everything itself: it needs no agent-preset roster
 * and no deployment configuration, so it runs on a stock DSH deployment with
 * no source modifications.
 * @module dsh-aside-host
 */

import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
// Typert-generated ./typert and ./remote artifacts import Zod at runtime.
import type {} from 'zod'
import { Session, SessionId, type SessionEvent, type SessionHeader } from '@deepseek-ai/dsh-session'
import { setSandboxMode } from '@deepseek-ai/dsh-sandbox-policy'
import { setApprovalPolicy } from '@deepseek-ai/dsh-user-approval'
import * as Persona from '@deepseek-ai/dsh-persona'
import * as ToolBash from '@deepseek-ai/dsh-tool-bash'
import * as ToolPwsh from '@deepseek-ai/dsh-tool-pwsh'
import * as ToolFs from '@deepseek-ai/dsh-tool-fs'
import * as ToolFsSearch from '@deepseek-ai/dsh-tool-fs-search'
import * as ToolWeb from '@deepseek-ai/dsh-tool-web'
import * as SkillFilesystem from '@deepseek-ai/dsh-skill-filesystem'
import * as ToolSkill from '@deepseek-ai/dsh-tool-skill'
import {
  anchorKey,
  anchorMessage,
  anchorSummary,
  parseAnchor,
  type AsideCreateRequest,
  type AsideCreateResult,
  type AsideListRequest,
  type AsideListResult,
  type AsideRecord,
} from './types.ts'

export * from './types.ts'

/** Expected failures, classified so a client can degrade gracefully. */
export class AsideError extends Error {
  constructor(
    readonly code: 'parent-not-found',
    message: string,
  ) {
    super(message)
    this.name = 'AsideError'
  }
}

/** The persona every aside runs under: explain and analyze, never modify. */
export const ASIDE_PERSONA = `You are a focused Q&A assistant in a read-only side conversation,
powered by the {{model}} model. Your working directory is {{cwd}}.
Your job is to explain, analyze, and answer questions — a concept the
user selected in another conversation, a piece of code, an error, or
anything else they ask. Prefer concise, precise explanations with
sources where the web search is used. You run under a read-only file
policy and cannot modify any files: never attempt to create, edit, or
delete files, and work with what you can read, search, and fetch
instead.`

/**
 * Mount the read-only world into one aside agent's scoped context. This is
 * the plugin-owned equivalent of an agent preset: every package is stock
 * DSH, mounted per-agent, and the host composition's sandbox/approval stack
 * confines every call underneath. Tool registration order matters only for
 * prompt-section layering; every registration is scoped to the agent.
 * @param agentCtx - the aside agent's scoped context, from the factory setup.
 */
export async function composeReadOnlyWorld(agentCtx: Context): Promise<void> {
  await agentCtx.plugin(Persona, { text: ASIDE_PERSONA })
  // One shell family per platform; both executors confine under the session's
  // sandbox mode, which the gateway seeds to `read-only`.
  if (process.platform !== 'win32') {
    await agentCtx.plugin(ToolBash)
  } else {
    await agentCtx.plugin(ToolPwsh)
  }
  // Stock tool-fs registers read/write/edit; every write is refused at
  // execution by the seeded read-only posture (policy + OS sandbox).
  await agentCtx.plugin(ToolFs)
  await agentCtx.plugin(ToolFsSearch, { sampleOverCapGlobResults: false })
  await agentCtx.plugin(ToolWeb, { fetch: true, searchTimeoutMs: 60000 })
  // Read-only knowledge: the skill registry and its filesystem skills are
  // host-plane stock services; only the per-agent rows are composed here.
  await agentCtx.plugin(SkillFilesystem)
  await agentCtx.plugin(ToolSkill)
}

/**
 * The balanced fork seed of one parent log: everything up to and including
 * the last completed turn, extended over trailing out-of-band appends until
 * the next turn boundary — the same cut the `session.fork` RPC applies, so an
 * aside inherits exactly what a fork would. A parent with no completed turn
 * yields an empty seed.
 * @param events - the parent's live log.
 * @returns the seed prefix, or an empty array without a completed turn.
 */
export function forkSeedOf(events: readonly SessionEvent[]): SessionEvent[] {
  const boundary = events.findLast(event => event.type === 'turn/end')
  if (boundary === undefined) return []
  let cut = boundary.seq + 1
  while (cut < events.length && events[cut]?.type !== 'turn/start') cut++
  return events.slice(0, cut)
}

/** Extract the plain text of a content-block array (shared projection). */
function textOfContent(content: unknown): string {
  return (Array.isArray(content) ? content : [])
    .filter((block): block is { type: string; text?: string } => (
      typeof block === 'object' && block !== null && (block as { type?: unknown }).type === 'text'
    ))
    .map(block => block.text ?? '')
    .join('\n')
}

/** The minimal persistence surface the gateway reads. */
interface SessionPersistenceFace {
  list(signal?: AbortSignal): Promise<SessionHeader[]>
  inspect(id: SessionId, signal?: AbortSignal): Promise<{ meta: SessionHeader; events: readonly SessionEvent[] }>
}

/** The optional title service surface (best-effort, cosmetic). */
interface SessionTitleFace {
  rename(session: Session, title: string): unknown
}

/** Gateway creation-time configuration (all optional). */
export interface AsideGatewayConfig {
  /**
   * Override the read-only world composition. Tests inject a fake; the
   * default is {@link composeReadOnlyWorld}.
   */
  compose?: (agentCtx: Context) => Promise<void>
}

/**
 * Remote-only gateway service exposing `aside.*` to the browser client.
 * Read the Host registries on every call; nothing is cached, because the
 * live agent set changes underneath a running app.
 */
export class AsideGateway extends TypertRemoteService {
  static inject = ['agents', 'sessions']

  private readonly compose: (agentCtx: Context) => Promise<void>
  /** One in-flight create per durable parent + full-anchor identity. */
  private readonly creations = new Map<string, Promise<AsideRecord>>()

  constructor(ctx: Context, config: AsideGatewayConfig = {}) {
    super(ctx, 'aside')
    this.compose = config.compose ?? composeReadOnlyWorld
  }

  /**
   * Create one read-only side conversation under a parent session, forked
   * from the parent's completed-turn history, and return its durable record.
   * @param request - the parent conversation identity plus the anchor.
   * @returns the full durable record.
   * @throws {@link AsideError} when the parent is unknown.
   */
  @Remote('create')
  async create(request: AsideCreateRequest): Promise<AsideCreateResult> {
    const parentId = SessionId(request.parentSessionId)
    const key = `${parentId}\u0000${anchorKey(request.anchor)}`
    const active = this.creations.get(key)
    if (active !== undefined) return { record: await active }

    const creating = this.createRecord(parentId, request)
    this.creations.set(key, creating)
    try {
      return { record: await creating }
    } finally {
      if (this.creations.get(key) === creating) this.creations.delete(key)
    }
  }

  /** Create or durably recover the single child for one parent + anchor. */
  private async createRecord(parentId: SessionId, request: AsideCreateRequest): Promise<AsideRecord> {
    const parent = this.ctx.agents.get(parentId)
    const parentHeader: SessionHeader | undefined = parent?.session.header
      ?? await this.coldHeader(parentId)
    if (parentHeader === undefined) {
      throw new AsideError('parent-not-found', `aside: parent session "${request.parentSessionId}" was not found`)
    }

    // Idempotency: a repeated create for the same anchor returns the existing
    // aside instead of minting a duplicate side conversation.
    const existing = await this.findExisting(parentId, request.anchor)
    if (existing !== undefined) {
      // A previous flush may have failed after the child was created. Reusing
      // the live child and retrying the durability barrier prevents an orphan
      // from turning into a second child on the caller's retry.
      const live = this.ctx.agents.get(SessionId(existing.subSessionId))
      if (live !== undefined) await this.ctx.sessions.flush(live.session)
      return existing
    }

    const subSessionId = SessionId(`aside-${randomUUID()}`)
    const inheritedRoute = parent === undefined
      || parent.options.provider === undefined
      || parent.options.model === undefined
      ? undefined
      : { provider: parent.options.provider, model: parent.options.model }
    const seed = parent === undefined ? [] : forkSeedOf(parent.session.events)
    const { agent } = await this.ctx.agents.create({
      sessionId: subSessionId,
      // Inherit the parent's route so the side conversation answers with the
      // same model the user is already talking to; a cold parent (or one
      // without a recorded route) falls back to the deployment defaults.
      // Reasoning effort rides the fork seed's `request/header` event.
      ...inheritedRoute === undefined ? {} : { agentOptions: inheritedRoute },
      // The fork seed carries the parent's completed-turn history, so the
      // aside reads the main conversation's state; a parent with no completed
      // turn starts the aside with no seed at all.
      ...seed.length === 0 ? {} : { seed },
      meta: {
        ...parentHeader.cwd !== undefined ? { cwd: parentHeader.cwd } : {},
        parentSession: parentId,
        ...seed.length === 0 ? {} : { seedLength: seed.length },
      },
      setup: async (agentCtx) => {
        await this.compose(agentCtx)
      },
    })

    // Seed the read-only posture into the child's durable log BEFORE any
    // prompt reaches it: the sandbox mode and the refusal policy are session
    // facts the model cannot change from inside (the escalation channel is
    // closed by the approval policy, and the sandbox itself is OS-level).
    setSandboxMode(agent.session, 'read-only')
    setApprovalPolicy(agent.session, 'never')

    // Persist the anchor atomically with the child: append the anchor marker
    // as the child's first user message NOW, so a failed or retried client
    // prompt never leaves an anchor-less orphan, and `aside.list` can recover
    // the relationship from durable storage alone.
    agent.session.append('user/message', {
      id: `aside-anchor-${subSessionId}`,
      role: 'user',
      content: [{ type: 'text', text: anchorMessage(request.anchor) }],
      source: { kind: 'user' },
    } as never, { surfaceOp: 'append' })

    // Best-effort human title (cosmetic in the stock session list).
    const summary = anchorSummary(request.anchor.exact, 40)
    try {
      const titleService = this.ctx.get('sessionTitle') as SessionTitleFace | undefined
      titleService?.rename(agent.session, summary)
    } catch {
      // A missing or refused title service never blocks aside creation.
    }

    // Flush the seed + anchor + title so the relationship is durable before
    // the client sends the first question. A failed durability barrier is a
    // failed create: the caller may retry, and findExisting reuses this live
    // child instead of minting another one.
    await this.ctx.sessions.flush(agent.session)
    const record = this.recordFromEvents(agent.session.header, parentId, agent.session.events)
    if (record === undefined) throw new Error('aside: created child has no recoverable anchor')
    return record
  }

  /**
   * List every aside hanging off one parent conversation, recovered from
   * durable storage (or, without persistence, the live agent registry).
   * @param request - the parent conversation identity.
   * @returns records sorted by updatedAt descending.
   */
  @Remote('list')
  async list(request: AsideListRequest): Promise<AsideListResult> {
    const parentId = SessionId(request.parentSessionId)
    const persistence = this.ctx.get('sessionPersistence') as SessionPersistenceFace | undefined
    if (persistence !== undefined) {
      try {
        const headers = await persistence.list()
        const children = headers.filter(header => header.parentSession === parentId)
        const records: AsideRecord[] = []
        for (const header of children) {
          const record = await this.recordFromChild(header, parentId, persistence)
          if (record !== undefined) records.push(record)
        }
        return { records: records.sort((left, right) => right.updatedAt - left.updatedAt) }
      } catch (error) {
        console.warn('[aside] persistence list failed, falling back to live agents:', error)
      }
    }
    return { records: this.recordsFromLiveAgents(parentId) }
  }

  /** Recover one child's record from its durable header + first message. */
  private async recordFromChild(
    header: SessionHeader,
    parentId: SessionId,
    persistence: SessionPersistenceFace,
  ): Promise<AsideRecord | undefined> {
    try {
      const inspected = await persistence.inspect(header.id)
      return this.recordFromEvents(header, parentId, inspected.events)
    } catch {
      // A corrupt or unreadable child is skipped; the client must not crash.
      return undefined
    }
  }

  /**
   * Fold one child's OWN events into a record, or undefined when it carries
   * no anchor. Only the child's own events (at or past `seedLength`) are
   * considered — a nested aside inherits its parent's log (which may itself
   * contain an ancestor's anchor marker), and a user's own text may contain a
   * marker-like string. The anchor is therefore read from the FIRST own user
   * message, never from inherited history or later user text.
   */
  private recordFromEvents(
    header: SessionHeader,
    parentId: SessionId,
    events: readonly SessionEvent[],
  ): AsideRecord | undefined {
    const seedLength = header.seedLength ?? 0
    let anchor: AsideRecord['anchor'] | undefined
    let firstOwnUserSeen = false
    let updatedAt = header.createdAt
    for (const event of events) {
      if (event.seq < seedLength) continue
      if (event.time > updatedAt) updatedAt = event.time
      if (!firstOwnUserSeen && event.type === 'user/message') {
        firstOwnUserSeen = true
        const text = textOfContent((event.data as { content?: unknown }).content)
        anchor = parseAnchor(text)
      }
    }
    if (anchor === undefined) return undefined
    return {
      schemaVersion: 1,
      parentSessionId: parentId,
      subSessionId: header.id,
      anchor,
      createdAt: header.createdAt,
      updatedAt,
    }
  }

  /** Fallback listing from the live agent registry (process-local, no persistence). */
  private recordsFromLiveAgents(parentId: SessionId): AsideRecord[] {
    const records: AsideRecord[] = []
    for (const agent of this.ctx.agents.list()) {
      const header = agent.session.header
      if (header.parentSession !== parentId) continue
      const record = this.recordFromEvents(header, parentId, agent.session.events)
      if (record !== undefined) records.push(record)
    }
    return records.sort((left, right) => right.updatedAt - left.updatedAt)
  }

  /** Idempotency lookup: an existing aside for the exact same anchor, if any. */
  private async findExisting(parentId: SessionId, anchor: AsideRecord['anchor']): Promise<AsideRecord | undefined> {
    const key = anchorKey(anchor)
    const live = this.recordsFromLiveAgents(parentId).find(record => anchorKey(record.anchor) === key)
    if (live !== undefined) return live
    const { records } = await this.list({ parentSessionId: parentId })
    return records.find(record => anchorKey(record.anchor) === key)
  }

  /** Read one cold session's stored header through the optional persistence backend. */
  private async coldHeader(sessionId: SessionId): Promise<SessionHeader | undefined> {
    const persistence = this.ctx.get('sessionPersistence') as SessionPersistenceFace | undefined
    if (persistence === undefined) return undefined
    try {
      const inspected = await persistence.inspect(sessionId)
      return Session.create(sessionId, inspected.events, inspected.meta).header
    } catch {
      return undefined
    }
  }
}

export default AsideGateway
