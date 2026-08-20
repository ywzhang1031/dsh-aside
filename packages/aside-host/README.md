# dsh-aside-host

English | [中文](README.zh.md)

Host gateway for read-only side conversations ("旁注"). `AsideGateway` registers the `aside` service and publishes two generated direct Remotes — `aside/create` and `aside/list` — consumed by the [`dsh-client-ui-aside`](../client-ui-aside/README.md) surface.

Runs on a **stock DSH deployment with no source modifications**: the gateway composes everything itself through the same stock packages and services the shipped compositions use.

## Read-only guarantee

`create` builds an ordinary Session under a posture nothing inside it can widen:

- **Self-composed read-only world** — [`composeReadOnlyWorld`](src/index.ts) mounts the stock toolset into the child agent's scope: `tool-bash`/`tool-pwsh`, `tool-fs`, `tool-fs-search`, `tool-web` (`fetch: true`), `skill-filesystem` + `tool-skill`, and a read-only persona. No delegation or long-running machinery is composed.
- **`sandbox/mode: read-only`** — seeded into the child's session log at creation, so every confined bash/fs call folds to the OS-level read-only sandbox. Stock `tool-fs` still registers `write`/`edit`; every write attempt is deterministically refused.
- **`approval/policy: never`** — seeded beside it, closing the sandbox escalation channel deterministically.

Both seeds are session-log events, so the posture survives restart by replay. The child inherits its parent's workspace (`cwd`) and model route, and carries `parentSession` lineage. It does **not** stamp a custom `origin`: stock session headers only accept `subagent`, so an aside is a plain child session.

## Context fork

`create` seeds the aside with the parent's balanced completed-turn prefix — the same cut the `session.fork` RPC applies — so the side conversation reads the main conversation's full state without sharing its token budget. Provider, model, and reasoning effort ride the seed's `request/header` event. A parent with no completed turn starts the aside with no seed.

## Persistence of the aside relationship

The parent link is the child's durable `parentSession` header. The full anchor (message id, exact prose, prefix/suffix disambiguation, offsets) is encoded into the child's first user message as a `[aside:…]` marker by `encodeAnchor`. `aside.list` recovers every aside for a parent by listing persisted session headers, filtering on `parentSession`, and reading each child's first message.

Stock DSH `0.1.0-rc.7` offers no public API for an out-of-repo plugin to mark a custom session event `ignorable`, so a dedicated index event would be refused by the persistence read path on reload. The anchor therefore rides the durable, known event types that ARE available. This is documented, not patched around.

## Remote methods

| Method | Payload | Result | Failure |
|---|---|---|---|
| `aside/create` | `{ parentSessionId, anchor }` | `{ record: AsideRecord }` | `AsideError` (`parent-not-found`) |
| `aside/list` | `{ parentSessionId }` | `{ records: AsideRecord[] }` | (corrupt children skipped) |

`AsideRecord` carries `schemaVersion`, `parentSessionId`, `subSessionId`, `anchor` (`messageId`, `exact`, `prefix`, `suffix`, `occurrence`, `startOffset`), `createdAt`, and `updatedAt`. `create` coalesces retries and concurrent requests by full anchor identity, and returns success only after the anchor crosses the session flush durability barrier.

Wire payload and result types live under `./types` (with the `encodeAnchor`/`parseAnchor` codec), and Typert generates the Host and Client Remote artifacts exposed by `./typert` and `./remote`. The client surface mounts the `./remote` stub itself through `ctx.remote.$mount`.

## Model Experience

None, as this gateway issues no model call at all: creation forks the parent's logged history and seeds policy events — the aside's own model requests run through the composed read-only world's agent loop.

#### KV Cache effect

None; this package never assembles model input.

## Known Limitations and Deferred Work

- **Writes are refused, not hidden** — stock `tool-fs` has no `readOnly` config, so the model sees `write`/`edit` tool definitions; every call is deterministically refused at execution.
- **The Host owns an ordinary child session** — the companion client hides its navigation row through the public Workspace archive projection after the durability barrier; the Host writes no custom `origin` and patches no DSH source.
- **A parent with no completed turn forks no history** — the aside starts from an empty seed; the Host still writes the anchored source before the first question.
- **`aside.list` scans session headers** — it filters metadata-only `sessionPersistence.list()` results by `parentSession` and reads only matching children, but there is no dedicated per-parent index (a custom event type is unavailable, see above).
- **Cold parents inherit no explicit route** — `create` copies provider/model only when the parent is live; reasoning effort rides the seed, and a cold parent's child falls back to deployment defaults.
