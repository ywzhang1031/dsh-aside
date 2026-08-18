# @ywzhang1031/dsh-aside-host

English | [中文](README.zh.md)

Host gateway for read-only side conversations ("旁注"). `AsideGateway` registers the `aside` service and publishes one generated direct Remote — `aside/create` — consumed by the [`@ywzhang1031/dsh-client-ui-aside`](../client-ui-aside/README.md) surface.

Runs on a **stock DSH deployment with no source modifications**: the gateway composes everything itself through the same stock packages and services the shipped compositions use.

## Read-only guarantee

`create` builds an ordinary Session under a posture nothing inside it can widen:

- **Self-composed read-only world** — [`composeReadOnlyWorld`](src/index.ts) mounts the stock toolset into the child agent's scope: `tool-bash`/`tool-pwsh`, `tool-fs`, `tool-fs-search`, `tool-web` (`fetch: true`), `skill-filesystem` + `tool-skill`, and a read-only persona. No delegation or long-running machinery is composed.
- **`sandbox/mode: read-only`** — seeded into the child's session log at creation, so every confined bash/fs call folds to the OS-level read-only sandbox. Stock `tool-fs` still registers `write`/`edit` (the `readOnly` tool-hiding config is not a stock option); every write attempt is deterministically refused — policy refusal plus the OS sandbox — and never reaches the filesystem.
- **`approval/policy: never`** — seeded beside it, closing the sandbox escalation channel deterministically.

Both seeds are session-log events, so the posture survives restart by replay. The child inherits its parent's workspace (`cwd`) and model route, and carries `parentSession` lineage for navigation surfaces. It does **not** stamp a custom `origin`: stock session headers only accept `subagent`, so an aside is a plain child session (reachable from the session list, listed flat rather than nested).

## Context fork

`create` seeds the aside with the parent's balanced completed-turn prefix — the same cut the `session.fork` RPC applies — so the side conversation reads the main conversation's full state without sharing its token budget. A parent with no completed turn starts the aside with no seed.

## Remote methods

| Method | Payload | Result | Failure |
|---|---|---|---|
| `aside/create` | `{ parentSessionId }` | `{ sessionId }` | `AsideError` (`parent-not-found`) |

Wire payload and result types live under `./types`, and Typert generates the Host and Client Remote artifacts exposed by `./typert` and `./remote`. The client surface mounts the `./remote` stub itself through `ctx.remote.$mount` — no composition change is needed beyond the overlay rows.

## Model Experience

None, as this gateway issues no model call at all: creation forks the parent's logged history and seeds policy events — the aside's own model requests run through the composed read-only world's agent loop.

#### KV Cache effect

None; this package never assembles model input.

## Known Limitations and Deferred Work

- **Writes are refused, not hidden** — stock `tool-fs` has no `readOnly` config, so the model sees `write`/`edit` tool definitions; every call is deterministically refused at execution (policy + OS sandbox). If a future stock release ships a read-only fs composition, this package can adopt it.
- **Flat session-list display** — without a custom `origin`, navigation surfaces list an aside as a plain child of its parent's lineage instead of a distinct nested kind.
- **A parent with no completed turn forks no history** — the aside starts empty; the client still attaches the anchored source to the opening question, but the model cannot see the surrounding conversation.
- **Parent existence is verified through the live registry first** — a cold parent is read through the optional persistence backend; a parent found in neither place fails classified as `parent-not-found`.
- **Cold parents inherit no route** — `create` copies the parent's provider/model only when the parent is live; a cold parent's child falls back to the deployment default route.
