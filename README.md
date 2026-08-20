# Aside · 旁注

Read-only side conversations for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). Select any prose span in an assistant reply, ask a follow-up question in a **read-only side conversation** that is forked from the main conversation's context — without polluting the main thread, without spending its token budget, and without any ability to modify files.

**A pure plugin: zero source modifications, zero preset files, zero deployment config.** It runs on a stock DSH installation — clone it, install two packages, restart.

## Why

When the model finishes a long answer, you often want to drill into a small concept ("what does *balanced completed-turn prefix* mean here?") without:

- polluting the main conversation's context window,
- mixing side questions into the main thread's history,
- or granting the side question any file-modifying power.

An **aside** (旁注) is exactly that: a child session with the parent's completed-turn history forked in, composed from a read-only world, and re-entered from the highlighted prose, the message's 💬 action, or the sidebar's **Aside chats** rail.

## Features

- **Select prose → ask**: a floating **就此提问** button appears over a selection (2–800 chars); clicking opens an EMPTY draft drawer — nothing is created until you actually send.
- **Per-message entry**: every finalized assistant message gains a 💬 action on its stock action strip (the same extension point `ui-message-feedback` uses), with the message's exact id.
- **Forked context**: the aside's log is seeded with the parent's balanced completed-turn prefix (the same cut `session.fork` applies) — the side conversation reads the main conversation's full state without sharing its token budget. Provider, model, and reasoning effort are inherited.
- **Aside-only sidebar**: the right rail lists just the current conversation's aside chats (anchor summary + open state), each re-opening its aside, centering the exact prose, and briefly strengthening that highlight. No artifacts, no sources, no 5-second history polling.
- **Hidden child sessions**: after the durability barrier, the plugin uses stock Workspace archiving to hide asides from grouped, ungrouped, flat-list, and search navigation while preserving logs and Workspace accounting. Existing asides are reconciled when their parent is loaded again.
- **Durable aside index**: aside relationships live in the Host (child `parentSession` header + anchor encoded into the child's first message) — no `localStorage`. They survive page refresh and Host restart.
- **Exact prose highlight**: when the anchor's precise span can be restored, the parent message highlights it (CSS Custom Highlight API, no `<mark>` wrapping); clicking the highlight reopens the aside. Falls back to message-level marking when the span cannot be recovered.
- **Stable composer**: drafts and durable asides share one bottom model/reasoning, fixed read-only, command, and send toolbar. A draft previews the parent's model directory and applies local choices to the child before its first prompt without mutating the parent.
- **Draft semantics**: closing an unanswered draft leaves nothing behind — no session, no anchor.

## Security model: the read-only guarantee

An aside is an ordinary Session created under a posture **nothing inside it can widen**:

1. **Composition** — the aside agent is composed from a read-only world (`composeReadOnlyWorld`): shell, file read + search, web search/fetch, skills, and a read-only persona. No delegation, no goals, no editor, no jobs.
2. **`sandbox/mode: read-only`** — seeded into the aside's session log at creation; every confined bash/fs call folds to the OS-level read-only sandbox. A write attempt never reaches the filesystem.
3. **`approval/policy: never`** — seeded beside it, so even the sandbox-escalation channel resolves deterministically to `rejected`.

Both seeds are session-log events, so the posture survives restart by replay. The aside inherits the parent's workspace (`cwd`) and model route.

### Honest boundaries

- **Writes are refused, not hidden.** Stock `tool-fs` has no read-only mode, so the model *sees* `write`/`edit`; every call is deterministically refused (policy + OS sandbox).
- **Read-only covers the filesystem, not the network.** The aside can fetch web pages and run read-only shell; treat it as a Q&A surface, not a security sandbox.
- **The drawer does not toggle permissions.** There is no `/permission` in the aside, the command whitelist excludes `/permission`, `/plan`, and `/goal`, and there is no jump into the stock full-session page. The aside keeps its creation-time read-only posture.
- **Exact highlight needs a restorable span.** When the Markdown-rendered text cannot be recovered precisely (or the browser lacks the CSS Custom Highlight API), the plugin degrades to message-level marking; the aside is always reachable from the sidebar and the 💬 action.
- **Navigation hiding uses stock archive projection.** DSH `0.1.0-rc.7` has no general auxiliary-session visibility, so the plugin uses public `workspace.archiveSession`; this hides navigation rows without deleting logs or Workspace accounting.

## Persistence: where the aside relationship lives

The Host is the single source of truth. Creating an aside:

1. creates the child session with a durable `parentSession` header (the parent link), and
2. encodes the full anchor (message id, exact prose, prefix/suffix disambiguation, offsets) into the child's first user message as a `[aside:…]` marker.

`aside.list(parentSessionId)` recovers every aside by listing persisted session headers, filtering on `parentSession`, and reading each child's first message. The browser only mirrors `aside.create`/`aside.list` into an in-memory cache — it never writes a second local fact and never reads `localStorage`.

> **Why not a custom session event?** Stock DSH `0.1.0-rc.7` has no public API for an out-of-repo plugin to mark a custom session event `ignorable`, so an unknown event type is refused by the persistence read path on reload. The anchor therefore rides the durable, known event types that ARE available (the `parentSession` header and the first `user/message`). This is documented, not patched around.

## Install (stock DSH)

Requires a stock [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) installation (web profile). No source modifications.

### Step 0 — install DSH itself from npm (one-time, no monorepo)

```sh
npm install -g @deepseek-ai/dsh        # latest = 0.1.0-rc.7
dsh --help                             # sanity check
```

That's it — no cloning DeepSeek Harness, no building anything. The `dsh` command manages its own profile under `~/.dsh`.

### Option A — tarballs (recommended, no npm publish needed)

```sh
git clone https://github.com/ywzhang1031/dsh-aside.git
cd dsh-aside
npm run pack          # → dist/*.tgz

dsh plugin add ./dist/ywzhang1031-dsh-aside-host-0.1.0.tgz
dsh plugin add ./dist/ywzhang1031-dsh-client-ui-aside-0.1.0.tgz

dsh web
```

Each package declares `dsh.bundle.patch`, so `dsh plugin add` automatically wires its row into the web composition's layer stack. No overlay file, no manual config.

### Option B — overlay

```sh
dsh plugin add ./dist/ywzhang1031-dsh-aside-host-0.1.0.tgz
dsh plugin add ./dist/ywzhang1031-dsh-client-ui-aside-0.1.0.tgz
dsh web --patch /path/to/dsh-aside/examples/aside.yml
```

### Option C — npm (once published)

```sh
dsh plugin add @ywzhang1031/dsh-aside-host
dsh plugin add @ywzhang1031/dsh-client-ui-aside
dsh web
```

## Usage

1. Select prose in a settled assistant reply — the floating **就此提问** button appears; or click the message's 💬 action.
2. The draft opens with a quote card and the parent's model/reasoning preview beside the fixed read-only and command controls. Nothing durable exists yet.
3. Optionally change that draft route, then send — the Host creates the forked aside and persists its anchor; the client applies the draft route to the child before the first question. The parent is unaffected.
4. Re-enter from the highlighted prose, the sidebar's **Aside chats**, or the per-message 💬 action; sidebar clicks precisely center and strengthen the anchored span, and the aside never appears in the left session list.
5. Continue switching the aside's model/reasoning in the same composer, or type `/` to choose a whitelisted command.

## Compatibility

- Built against DeepSeek Harness `0.1.0-rc.7`.
- All `@deepseek-ai/*` runtime dependencies are **peer dependencies** resolved from your DSH installation.
- The browser half requires the stock `conversation.chat.assistant-actions` slot and the `shell.overlay` frame slot.
- Message positioning and exact highlight use the stock `data-chat-anchor-key` row attribute as a *best-effort* local DOM hint, with the action node as fallback — never a CSS class name as the sole authority.

## Development

**This repo is fully self-building — no DeepSeek Harness monorepo needed.** `pnpm install && pnpm build` compiles both packages. `pnpm test` runs 92 tests covering the host gateway (create/list/concurrent idempotency/persistence-failure recovery/read-only composition), Workspace visibility, quote selection, message DOM registry, exact focus/highlighting, and the browser repository/drawer/draft-model/commands/selection/action/apply lifecycle.

```sh
pnpm install
pnpm build
pnpm test           # 92 tests
npm run pack        # → dist/*.tgz
pnpm smoke          # install the tarballs into an isolated stock DSH_HOME and cold-boot it
pnpm verify         # test + build + pack + stock DSH smoke
```

### Iterating on a running DSH

```sh
dsh plugin add /path/to/dsh-aside/packages/aside-host
dsh plugin add /path/to/dsh-aside/packages/client-ui-aside
dsh web

pnpm build   # then restart dsh web (browser-half changes hot-reload)
```

## Limitations & deferred work

- **Drawer streaming is adaptive polling, not a live subscription.** The drawer polls the child history at 700ms while generating and backs off to 2.5s when idle (stopping when hidden/closed and refreshing immediately when visible again).
- **A custom durable event type is unavailable on 0.1.0-rc.7** (no `ignorable` append for out-of-repo plugins), so the anchor rides the child's first message rather than a dedicated index event.
- **Exact highlight is best-effort.** Markdown source vs. rendered text, repeated spans, and browsers without the Custom Highlight API degrade to message-level marking.
- **A parent with no completed turn forks no history**; the aside starts empty and sees only the anchored source.
- **Asides intentionally do not open as full sessions.** Stock `workspace.archiveSession` has no public inverse; keeping them drawer-only preserves the navigation hierarchy and strict read-only posture.

## License

MIT © [ywzhang1031](https://github.com/ywzhang1031)
