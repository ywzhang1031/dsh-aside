import { randomUUID } from "node:crypto";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { Session, SessionId } from "@deepseek-ai/dsh-session";
import { setSandboxMode } from "@deepseek-ai/dsh-sandbox-policy";
import { setApprovalPolicy } from "@deepseek-ai/dsh-user-approval";
import * as Persona from "@deepseek-ai/dsh-persona";
import * as ToolBash from "@deepseek-ai/dsh-tool-bash";
import * as ToolPwsh from "@deepseek-ai/dsh-tool-pwsh";
import * as ToolFs from "@deepseek-ai/dsh-tool-fs";
import * as ToolFsSearch from "@deepseek-ai/dsh-tool-fs-search";
import * as ToolWeb from "@deepseek-ai/dsh-tool-web";
import * as SkillFilesystem from "@deepseek-ai/dsh-skill-filesystem";
import * as ToolSkill from "@deepseek-ai/dsh-tool-skill";
//#region lib/types/types.js
/**
* Wire vocabulary and anchor codec for the aside Remote domain: the payloads
* a browser client sends and the results the gateway answers, kept
* JSON-serializable and free of Host-only service types.
*
* The anchor record is the single durable contract between the Host gateway
* and the browser client. Because stock DSH 0.1.0-rc.7 offers no public API
* for an out-of-repo plugin to append a durable custom session event (the
* persistence read path refuses unknown event types unless they carry the
* `ignorable` envelope marker, and `Session.append` exposes no way to set
* it), the anchor is encoded into the child conversation's first user message
* by {@link encodeAnchor}. The child session's `parentSession` header links
* it back to its parent, so {@link AsideGateway.list} can recover every aside
* for a parent by reading the child's first message. No localStorage and no
* DSH source patch are involved.
* @module @ywzhang1031/dsh-aside-host/types
*/
/** The on-wire/anchor schema revision this package writes and reads. */
const ASIDE_SCHEMA_VERSION = 1;
/**
* Encode an anchor into a marker line for the child conversation's first user
* message. URL-encoding keeps the marker self-delimiting (no `]` can appear
* inside) and UTF-8 safe in both Node and browser.
*/
function encodeAnchor(anchor) {
	return `[aside:${encodeURIComponent(JSON.stringify(anchor))}]`;
}
/**
* Decode the anchor marker out of a first user message, or undefined when the
* message carries none. Never throws on malformed input.
*/
function parseAnchor(text) {
	const match = /\[aside:([^\]]+)\]/.exec(text);
	if (match === null || match[1] === void 0) return void 0;
	try {
		const parsed = JSON.parse(decodeURIComponent(match[1]));
		return isAsideAnchor(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
/** Structural guard for an anchor recovered from untrusted persisted text. */
function isAsideAnchor(value) {
	if (typeof value !== "object" || value === null) return false;
	const record = value;
	return (record["messageId"] === null || typeof record["messageId"] === "string") && typeof record["exact"] === "string" && typeof record["prefix"] === "string" && typeof record["suffix"] === "string" && (record["occurrence"] === null || typeof record["occurrence"] === "number") && (record["startOffset"] === null || typeof record["startOffset"] === "number");
}
/** Whitespace-normalized human summary of an anchor's exact text (for titles/sidebar). */
function anchorSummary(exact, max = 60) {
	const compact = exact.replace(/\s+/g, " ").trim();
	return compact.length > max ? `${compact.slice(0, max)}…` : compact;
}
/**
* Canonical dedup identity for one anchor. Every disambiguation field counts:
* the same text in a different message, at a different occurrence, or at a
* different offset is a different aside.
*/
function anchorKey(anchor) {
	return [
		anchor.messageId ?? "",
		anchor.exact,
		anchor.prefix,
		anchor.suffix,
		anchor.occurrence ?? "",
		anchor.startOffset ?? ""
	].join("\0");
}
/**
* The child conversation's first user message: the durable anchor marker plus
* a human/model-readable quoted source. The Host appends this at create time
* so the anchor is persisted atomically with the child session, before the
* client sends the first question.
*/
function anchorMessage(anchor) {
	return `${encodeAnchor(anchor)}\n\n---\n引用原文：\n${anchor.exact}`;
}
//#endregion
//#region lib/types/index.js
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
* @module @ywzhang1031/dsh-aside-host
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/** Expected failures, classified so a client can degrade gracefully. */
var AsideError = class extends Error {
	code;
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "AsideError";
	}
};
/** The persona every aside runs under: explain and analyze, never modify. */
const ASIDE_PERSONA = `You are a focused Q&A assistant in a read-only side conversation,
powered by the {{model}} model. Your working directory is {{cwd}}.
Your job is to explain, analyze, and answer questions — a concept the
user selected in another conversation, a piece of code, an error, or
anything else they ask. Prefer concise, precise explanations with
sources where the web search is used. You run under a read-only file
policy and cannot modify any files: never attempt to create, edit, or
delete files, and work with what you can read, search, and fetch
instead.`;
/**
* Mount the read-only world into one aside agent's scoped context. This is
* the plugin-owned equivalent of an agent preset: every package is stock
* DSH, mounted per-agent, and the host composition's sandbox/approval stack
* confines every call underneath. Tool registration order matters only for
* prompt-section layering; every registration is scoped to the agent.
* @param agentCtx - the aside agent's scoped context, from the factory setup.
*/
async function composeReadOnlyWorld(agentCtx) {
	await agentCtx.plugin(Persona, { text: ASIDE_PERSONA });
	if (process.platform !== "win32") await agentCtx.plugin(ToolBash);
	else await agentCtx.plugin(ToolPwsh);
	await agentCtx.plugin(ToolFs);
	await agentCtx.plugin(ToolFsSearch, { sampleOverCapGlobResults: false });
	await agentCtx.plugin(ToolWeb, {
		fetch: true,
		searchTimeoutMs: 6e4
	});
	await agentCtx.plugin(SkillFilesystem);
	await agentCtx.plugin(ToolSkill);
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
function forkSeedOf(events) {
	const boundary = events.findLast((event) => event.type === "turn/end");
	if (boundary === void 0) return [];
	let cut = boundary.seq + 1;
	while (cut < events.length && events[cut]?.type !== "turn/start") cut++;
	return events.slice(0, cut);
}
/** Extract the plain text of a content-block array (shared projection). */
function textOfContent(content) {
	return (Array.isArray(content) ? content : []).filter((block) => typeof block === "object" && block !== null && block.type === "text").map((block) => block.text ?? "").join("\n");
}
/**
* Remote-only gateway service exposing `aside.*` to the browser client.
* Read the Host registries on every call; nothing is cached, because the
* live agent set changes underneath a running app.
*/
let AsideGateway = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _create_decorators;
	let _list_decorators;
	return class AsideGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_create_decorators = [Remote("create")];
			_list_decorators = [Remote("list")];
			__esDecorate(this, null, _create_decorators, {
				kind: "method",
				name: "create",
				static: false,
				private: false,
				access: {
					has: (obj) => "create" in obj,
					get: (obj) => obj.create
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["agents", "sessions"];
		compose = __runInitializers(this, _instanceExtraInitializers);
		/** One in-flight create per durable parent + full-anchor identity. */
		creations = /* @__PURE__ */ new Map();
		constructor(ctx, config = {}) {
			super(ctx, "aside");
			this.compose = config.compose ?? composeReadOnlyWorld;
		}
		/**
		* Create one read-only side conversation under a parent session, forked
		* from the parent's completed-turn history, and return its durable record.
		* @param request - the parent conversation identity plus the anchor.
		* @returns the full durable record.
		* @throws {@link AsideError} when the parent is unknown.
		*/
		async create(request) {
			const parentId = SessionId(request.parentSessionId);
			const key = `${parentId}\u0000${anchorKey(request.anchor)}`;
			const active = this.creations.get(key);
			if (active !== void 0) return { record: await active };
			const creating = this.createRecord(parentId, request);
			this.creations.set(key, creating);
			try {
				return { record: await creating };
			} finally {
				if (this.creations.get(key) === creating) this.creations.delete(key);
			}
		}
		/** Create or durably recover the single child for one parent + anchor. */
		async createRecord(parentId, request) {
			const parent = this.ctx.agents.get(parentId);
			const parentHeader = parent?.session.header ?? await this.coldHeader(parentId);
			if (parentHeader === void 0) throw new AsideError("parent-not-found", `aside: parent session "${request.parentSessionId}" was not found`);
			const existing = await this.findExisting(parentId, request.anchor);
			if (existing !== void 0) {
				const live = this.ctx.agents.get(SessionId(existing.subSessionId));
				if (live !== void 0) await this.ctx.sessions.flush(live.session);
				return existing;
			}
			const subSessionId = SessionId(`aside-${randomUUID()}`);
			const inheritedRoute = parent === void 0 || parent.options.provider === void 0 || parent.options.model === void 0 ? void 0 : {
				provider: parent.options.provider,
				model: parent.options.model
			};
			const seed = parent === void 0 ? [] : forkSeedOf(parent.session.events);
			const { agent } = await this.ctx.agents.create({
				sessionId: subSessionId,
				...inheritedRoute === void 0 ? {} : { agentOptions: inheritedRoute },
				...seed.length === 0 ? {} : { seed },
				meta: {
					...parentHeader.cwd !== void 0 ? { cwd: parentHeader.cwd } : {},
					parentSession: parentId,
					...seed.length === 0 ? {} : { seedLength: seed.length }
				},
				setup: async (agentCtx) => {
					await this.compose(agentCtx);
				}
			});
			setSandboxMode(agent.session, "read-only");
			setApprovalPolicy(agent.session, "never");
			agent.session.append("user/message", {
				id: `aside-anchor-${subSessionId}`,
				role: "user",
				content: [{
					type: "text",
					text: anchorMessage(request.anchor)
				}],
				source: { kind: "user" }
			}, { surfaceOp: "append" });
			const summary = anchorSummary(request.anchor.exact, 40);
			try {
				this.ctx.get("sessionTitle")?.rename(agent.session, summary);
			} catch {}
			await this.ctx.sessions.flush(agent.session);
			const record = this.recordFromEvents(agent.session.header, parentId, agent.session.events);
			if (record === void 0) throw new Error("aside: created child has no recoverable anchor");
			return record;
		}
		/**
		* List every aside hanging off one parent conversation, recovered from
		* durable storage (or, without persistence, the live agent registry).
		* @param request - the parent conversation identity.
		* @returns records sorted by updatedAt descending.
		*/
		async list(request) {
			const parentId = SessionId(request.parentSessionId);
			const persistence = this.ctx.get("sessionPersistence");
			if (persistence !== void 0) try {
				const children = (await persistence.list()).filter((header) => header.parentSession === parentId);
				const records = [];
				for (const header of children) {
					const record = await this.recordFromChild(header, parentId, persistence);
					if (record !== void 0) records.push(record);
				}
				return { records: records.sort((left, right) => right.updatedAt - left.updatedAt) };
			} catch (error) {
				console.warn("[aside] persistence list failed, falling back to live agents:", error);
			}
			return { records: this.recordsFromLiveAgents(parentId) };
		}
		/** Recover one child's record from its durable header + first message. */
		async recordFromChild(header, parentId, persistence) {
			try {
				const inspected = await persistence.inspect(header.id);
				return this.recordFromEvents(header, parentId, inspected.events);
			} catch {
				return;
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
		recordFromEvents(header, parentId, events) {
			const seedLength = header.seedLength ?? 0;
			let anchor;
			let firstOwnUserSeen = false;
			let updatedAt = header.createdAt;
			for (const event of events) {
				if (event.seq < seedLength) continue;
				if (event.time > updatedAt) updatedAt = event.time;
				if (!firstOwnUserSeen && event.type === "user/message") {
					firstOwnUserSeen = true;
					anchor = parseAnchor(textOfContent(event.data.content));
				}
			}
			if (anchor === void 0) return void 0;
			return {
				schemaVersion: 1,
				parentSessionId: parentId,
				subSessionId: header.id,
				anchor,
				createdAt: header.createdAt,
				updatedAt
			};
		}
		/** Fallback listing from the live agent registry (process-local, no persistence). */
		recordsFromLiveAgents(parentId) {
			const records = [];
			for (const agent of this.ctx.agents.list()) {
				const header = agent.session.header;
				if (header.parentSession !== parentId) continue;
				const record = this.recordFromEvents(header, parentId, agent.session.events);
				if (record !== void 0) records.push(record);
			}
			return records.sort((left, right) => right.updatedAt - left.updatedAt);
		}
		/** Idempotency lookup: an existing aside for the exact same anchor, if any. */
		async findExisting(parentId, anchor) {
			const key = anchorKey(anchor);
			const live = this.recordsFromLiveAgents(parentId).find((record) => anchorKey(record.anchor) === key);
			if (live !== void 0) return live;
			const { records } = await this.list({ parentSessionId: parentId });
			return records.find((record) => anchorKey(record.anchor) === key);
		}
		/** Read one cold session's stored header through the optional persistence backend. */
		async coldHeader(sessionId) {
			const persistence = this.ctx.get("sessionPersistence");
			if (persistence === void 0) return void 0;
			try {
				const inspected = await persistence.inspect(sessionId);
				return Session.create(sessionId, inspected.events, inspected.meta).header;
			} catch {
				return;
			}
		}
	};
})();
//#endregion
export { ASIDE_PERSONA, ASIDE_SCHEMA_VERSION, AsideError, AsideGateway, AsideGateway as default, anchorKey, anchorMessage, anchorSummary, composeReadOnlyWorld, encodeAnchor, forkSeedOf, isAsideAnchor, parseAnchor };
