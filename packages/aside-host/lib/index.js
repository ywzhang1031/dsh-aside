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
* Both seeds ride the session log, so they survive restart by replay — the
* same delegation pattern the subagent driver uses.
*
* The gateway composes everything itself: it needs no agent-preset roster
* and no deployment configuration, so it runs on a stock DSH deployment with
* no source modifications.
* @module @deepseek-ai/dsh-aside-host
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
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
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
/**
* Remote-only gateway service exposing `aside.*` to the browser client.
* Read the Host registries on every call; nothing is cached, because the
* live agent set changes underneath a running app.
*/
let AsideGateway = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _create_decorators;
	return class AsideGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_create_decorators = [Remote("create")];
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
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["agents"];
		compose = __runInitializers(this, _instanceExtraInitializers);
		constructor(ctx, config = {}) {
			super(ctx, "aside");
			this.compose = config.compose ?? composeReadOnlyWorld;
		}
		/**
		* Create one read-only side conversation under a parent session, forked
		* from the parent's completed-turn history.
		* @param request - the parent conversation identity.
		* @returns the new session id.
		* @throws {@link AsideError} when the parent is unknown.
		*/
		async create(request) {
			const parentId = SessionId(request.parentSessionId);
			const parent = this.ctx.agents.get(parentId);
			const parentHeader = parent?.session.header ?? await this.coldHeader(parentId);
			if (parentHeader === void 0) throw new AsideError("parent-not-found", `aside: parent session "${request.parentSessionId}" was not found`);
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
			return { sessionId: subSessionId };
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
export { ASIDE_PERSONA, AsideError, AsideGateway, AsideGateway as default, composeReadOnlyWorld, forkSeedOf };
