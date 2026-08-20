# Aside · 旁注

Read-only side conversations for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). Select any prose span in an assistant reply, ask a follow-up question in a **read-only side conversation** that is forked from the main conversation's context — without polluting the main thread, without spending its token budget, and without any ability to modify files.

**A pure plugin: zero source modifications, zero preset files, zero deployment config.** It runs on a stock DSH installation — clone it, install two packages, restart.

## Why

When the model finishes a long answer, you often want to drill into a small concept ("what does *balanced completed-turn prefix* mean here?") without:

- polluting the main conversation's context window,
- mixing side questions into the main thread's history,
- or granting the side question any file-modifying power.

An **aside** (旁注) is exactly that: a child session with the parent's completed-turn history forked in, composed from a read-only world, and re-entered from the message's 💬 action, the sidebar's **Aside chats** rail, or the session list.

## Features

- **Select prose → ask**: a floating **就此提问** button appears over a selection (2–800 chars); clicking opens an EMPTY draft drawer — nothing is created until you actually send.
- **Per-message entry**: every finalized assistant message gains a 💬 action on its stock action strip (the same extension point `ui-message-feedback` uses), with the message's exact id.
- **Forked context**: the aside's log is seeded with the parent's balanced completed-turn prefix (the same cut `session.fork` applies) — the side conversation reads the main conversation's full state without sharing its token budget.
- **Codex-style sidebar**: produced files, web-search sources, and the current conversation's aside chats.
- **Draft semantics**: closing an unanswered draft leaves nothing behind — no session, no anchor.

## Security model: the read-only guarantee

An aside is an ordinary Session created under a posture **nothing inside it can widen**:

1. **Composition** — the aside agent is composed from a read-only world (`composeReadOnlyWorld`): shell, file read + search, web search/fetch, skills, and a read-only persona. No delegation, no goals, no editor, no jobs. (Verified end-to-end: on the real stock web composition, the aside's visible toolset is exactly `read, read_image, glob, grep, bash, web_search, web_fetch, skill, write, edit` — and every `write`/`edit` call is refused.)
2. **`sandbox/mode: read-only`** — seeded into the aside's session log at creation; every confined bash/fs call folds to the OS-level read-only sandbox (seatbelt/landlock/bwrap). A write attempt never reaches the filesystem.
3. **`approval/policy: never`** — seeded beside it, so even the sandbox-escalation channel resolves deterministically to `rejected`.

Both seeds are session-log events, so the posture survives restart by replay. The aside inherits the parent's workspace (`cwd`) and model route.

### Honest boundaries

- **Writes are refused, not hidden.** Stock `tool-fs` has no read-only mode, so the model *sees* `write`/`edit`; every call is deterministically refused (policy + OS sandbox). Same outcome, slightly less clean surface.
- **Read-only covers the filesystem, not the network.** The aside can fetch web pages and run read-only shell; treat it as a Q&A surface, not a security sandbox.
- **No inline prose highlight.** Stock `MarkdownText` has no decoration hook, so the asked-about text is not highlighted inside the parent message. Re-entry goes through the 💬 action, the sidebar rail, and the session list.
- **Flat session-list display.** The aside carries no custom `origin` (stock headers accept only `subagent`), so it appears as a plain child session rather than a distinct nested kind.

## Install (stock DSH)

Requires a stock [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) installation (web profile). No source modifications.

### Step 0 — install DSH itself from npm (one-time, no monorepo)

```sh
npm install -g @deepseek-ai/dsh        # latest = 0.1.0-rc.7 — the version this plugin is built against
dsh --help                             # sanity check (`dsh plugin add` also needs pnpm on PATH)
```

That's it — no cloning DeepSeek Harness, no building anything. The `dsh` command manages its own profile under `~/.dsh`.

### Option A — tarballs (recommended, no npm publish needed)

```sh
# 1. clone this repo and pack the two packages
git clone https://github.com/ywzhang1031/dsh-aside.git
cd dsh-aside
npm run pack          # → dist/*.tgz

# 2. install into your DSH profile (order matters: host first)
dsh plugin add ./dist/ywzhang1031-dsh-aside-host-0.1.0.tgz
dsh plugin add ./dist/ywzhang1031-dsh-client-ui-aside-0.1.0.tgz

# 3. start DSH — the two rows compose automatically
dsh web
```

Each package declares `dsh.bundle.patch`, so `dsh plugin add` automatically wires its row into the web composition's layer stack. No overlay file, no manual config.

### Option B — overlay

If you prefer an explicit patch file:

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
2. The empty draft drawer opens, titled with the selected span. Nothing durable exists yet.
3. Type a question and send — the Host creates the forked aside (inheriting the parent's workspace and model route), attaches the anchored source to the question, and records the anchor.
4. Re-enter from the sidebar's **Aside chats** (every asked-about span of the current conversation), the per-message 💬 action (reopens an already-asked message's aside), or the session list.

## Compatibility

- Built against DeepSeek Harness `0.1.0-rc.7` — the npm `latest` (`npm i -g @deepseek-ai/dsh`). Note: individual `@deepseek-ai/*` packages also publish `0.1.0-rc.7`, but some of their `latest` dist-tags still point at old `0.0.1-rc.x` — always install the CLI (`@deepseek-ai/dsh`), whose `latest` is correct, and let it pull the right dependencies.
- All `@deepseek-ai/*` runtime dependencies are **peer dependencies** resolved from your DSH installation — the plugin never downloads its own copies, so there is no version skew with the DSH's own tool instances.
- The browser half requires the stock `conversation.chat.assistant-actions` slot (present since the `ui-message-feedback` era) and the `shell.overlay` frame slot.
- A future DSH release may change APIs; re-verify against each new DSH version (the `dsh plugin add` install fails loudly on peer resolution problems, and the aside toolset e2e is the compatibility canary).

## Development

**This repo is fully self-building — no DeepSeek Harness monorepo needed.** `pnpm install && pnpm build` compiles both packages (TypeScript → `lib/types`, tsdown → `lib/*.js`). The Host owns and type-checks its Typert contract, without relying on project registration from the DSH monorepo. `pnpm test` runs 46 tests covering the host gateway, read-only composition, publication contracts, and the browser selection/anchors/drawer/message-action/apply lifecycle.

```sh
pnpm install
pnpm build          # tsc -b + tsdown for both packages
pnpm test           # 46 tests, zero DSH install required
npm run pack        # → dist/*.tgz
pnpm smoke          # install the tarballs into an isolated stock DSH_HOME and cold-boot it
pnpm verify         # test + build + pack + stock DSH smoke
```

### Iterating on a running DSH

Fastest loop — link the plugin directory into the profile once, then rebuild + restart:

```sh
# one-time: install the plugin repo as a DIRECTORY link (no packing needed)
dsh plugin add /path/to/dsh-aside/packages/aside-host
dsh plugin add /path/to/dsh-aside/packages/client-ui-aside
dsh web

# every change: rebuild in this repo, then restart dsh web
pnpm build
# (browser-half changes hot-reload without restart — the webserver polls lib/client.js)
```

For distribution, the pack flow is the same as the install section: `npm run pack` → `dsh plugin add ./dist/*.tgz`.

### Compatibility canary

`pnpm smoke` creates a temporary `DSH_HOME`, lets stock DSH generate a fresh web profile, installs both tarballs exactly as a user would, verifies the composed config, boots the Web UI on a random port, and confirms that the browser entry contains this plugin. CI runs the complete `pnpm verify` lane on Node 24 with `@deepseek-ai/dsh@0.1.0-rc.7`; no second monorepo checkout is required.

## Limitations & deferred work

- Anchors live in the browser's `localStorage` — clearing storage hides the aside list but never deletes the asides themselves.
- The drawer and sidebar refresh history by light polling while open (no live stream subscription).
- A parent with no completed turn forks no history; the aside starts empty and sees only the anchored source.
- Inline prose highlighting is deferred until stock `MarkdownText` gains a decoration hook.

## License

MIT © [ywzhang1031](https://github.com/ywzhang1031)
