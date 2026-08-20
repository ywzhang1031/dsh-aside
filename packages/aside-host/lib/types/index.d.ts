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
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { type SessionEvent } from '@deepseek-ai/dsh-session';
import { type AsideCreateRequest, type AsideCreateResult, type AsideListRequest, type AsideListResult } from './types.ts';
export * from './types.ts';
/** Expected failures, classified so a client can degrade gracefully. */
export declare class AsideError extends Error {
    readonly code: 'parent-not-found';
    constructor(code: 'parent-not-found', message: string);
}
/** The persona every aside runs under: explain and analyze, never modify. */
export declare const ASIDE_PERSONA = "You are a focused Q&A assistant in a read-only side conversation,\npowered by the {{model}} model. Your working directory is {{cwd}}.\nYour job is to explain, analyze, and answer questions \u2014 a concept the\nuser selected in another conversation, a piece of code, an error, or\nanything else they ask. Prefer concise, precise explanations with\nsources where the web search is used. You run under a read-only file\npolicy and cannot modify any files: never attempt to create, edit, or\ndelete files, and work with what you can read, search, and fetch\ninstead.";
/**
 * Mount the read-only world into one aside agent's scoped context. This is
 * the plugin-owned equivalent of an agent preset: every package is stock
 * DSH, mounted per-agent, and the host composition's sandbox/approval stack
 * confines every call underneath. Tool registration order matters only for
 * prompt-section layering; every registration is scoped to the agent.
 * @param agentCtx - the aside agent's scoped context, from the factory setup.
 */
export declare function composeReadOnlyWorld(agentCtx: Context): Promise<void>;
/**
 * The balanced fork seed of one parent log: everything up to and including
 * the last completed turn, extended over trailing out-of-band appends until
 * the next turn boundary — the same cut the `session.fork` RPC applies, so an
 * aside inherits exactly what a fork would. A parent with no completed turn
 * yields an empty seed.
 * @param events - the parent's live log.
 * @returns the seed prefix, or an empty array without a completed turn.
 */
export declare function forkSeedOf(events: readonly SessionEvent[]): SessionEvent[];
/** Gateway creation-time configuration (all optional). */
export interface AsideGatewayConfig {
    /**
     * Override the read-only world composition. Tests inject a fake; the
     * default is {@link composeReadOnlyWorld}.
     */
    compose?: (agentCtx: Context) => Promise<void>;
}
/**
 * Remote-only gateway service exposing `aside.*` to the browser client.
 * Read the Host registries on every call; nothing is cached, because the
 * live agent set changes underneath a running app.
 */
export declare class AsideGateway extends TypertRemoteService {
    static inject: string[];
    private readonly compose;
    /** One in-flight create per durable parent + full-anchor identity. */
    private readonly creations;
    constructor(ctx: Context, config?: AsideGatewayConfig);
    /**
     * Create one read-only side conversation under a parent session, forked
     * from the parent's completed-turn history, and return its durable record.
     * @param request - the parent conversation identity plus the anchor.
     * @returns the full durable record.
     * @throws {@link AsideError} when the parent is unknown.
     */
    create(request: AsideCreateRequest): Promise<AsideCreateResult>;
    /** Create or durably recover the single child for one parent + anchor. */
    private createRecord;
    /**
     * List every aside hanging off one parent conversation, recovered from
     * durable storage (or, without persistence, the live agent registry).
     * @param request - the parent conversation identity.
     * @returns records sorted by updatedAt descending.
     */
    list(request: AsideListRequest): Promise<AsideListResult>;
    /** Recover one child's record from its durable header + first message. */
    private recordFromChild;
    /**
     * Fold one child's OWN events into a record, or undefined when it carries
     * no anchor. Only the child's own events (at or past `seedLength`) are
     * considered — a nested aside inherits its parent's log (which may itself
     * contain an ancestor's anchor marker), and a user's own text may contain a
     * marker-like string. The anchor is therefore read from the FIRST own user
     * message, never from inherited history or later user text.
     */
    private recordFromEvents;
    /** Fallback listing from the live agent registry (process-local, no persistence). */
    private recordsFromLiveAgents;
    /** Idempotency lookup: an existing aside for the exact same anchor, if any. */
    private findExisting;
    /** Read one cold session's stored header through the optional persistence backend. */
    private coldHeader;
}
export default AsideGateway;
//# sourceMappingURL=index.d.ts.map