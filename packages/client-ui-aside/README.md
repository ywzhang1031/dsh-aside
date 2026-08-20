# dsh-client-ui-aside

English | [中文](README.zh.md)

Browser surface for read-only side conversations ("旁注"). Select prose in a settled assistant reply, click the floating **就此提问** button (or the per-message 💬 action), and a draft with a quote card plus the stable composer opens bound to that selection — nothing durable exists yet. It previews the parent's model/reasoning and permits a local choice without mutating the parent. On send, the Host creates the forked aside and crosses the anchor durability barrier; the client applies that choice to the child, then sends the first question. Closing an unanswered draft leaves nothing behind.

Runs on a **stock DSH deployment with no source modifications**: the plugin self-mounts its generated Remote stub through `ctx.remote.$mount`, reads the current session from the runtime sessions service, and contributes its per-message entry to the stock `conversation.chat.assistant-actions` strip.

The plugin owns these pieces:

- **`AsideRepository`** — the Host-backed cache over `aside.list`/`aside.create`. The Host is the source of truth; this is an in-memory mirror only (no `localStorage`, no second local fact).
- **`DrawerStore`** — the open-drawer state machine: a draft (selection bound, no session) attaches to a real aside only when the first send succeeds.
- **`SelectionWatcher`** — a document-level listener that resolves a selection into a quote-selector anchor and floats the ask button.
- **`MessageDomRegistry`** — maps a stock `messageId` to its turn-tail row as the virtualization/fallback target when exact prose cannot be restored.
- **`AsideHighlighter`** + **`quote`** — restore each aside's exact Range (TreeWalker + quote selector), paint it with the CSS Custom Highlight API, and center/strengthen that exact span on sidebar navigation; clicking the highlight reopens its aside.
- **`AsideVisibility`** — hides confirmed aside children through the public Workspace archive projection while preserving logs and Workspace accounting, coalescing concurrent hide requests.
- **`AsideDrawer`** — the overlay-slot panel whose draft and durable states share one bottom model/reasoning, fixed read-only, command, and send toolbar, plus visibility-aware adaptive polling and autoscroll.
- **`AsideSidebar`** — the standing rail listing only the current conversation's aside chats (no artifacts, no sources), including current-open state and update time.
- **`AsideAskAction`** — the per-message entry that carries the message's exact `messageId`, resolves its text from history, and opens the same draft drawer.

The durable authority — the aside session, its fork lineage, its read-only posture, and the anchor relationship — lives in the Host (`dsh-aside-host`).

## Stock-only trade-offs

- **No per-message DOM identity is published.** Stock renders the assistant-actions strip in a sibling node of the message text, so selection attribution uses history matching; the per-message action provides message-precise anchoring.
- **Message positioning uses `data-chat-anchor-key`** as a best-effort local DOM hint, with the action node as fallback — never a CSS class name as the sole authority.
- **Exact highlight degrades gracefully** when the rendered span cannot be recovered or the browser lacks the CSS Custom Highlight API (message-level marking, then the sidebar/action path).
- **Asides stay inside their parent navigation hierarchy.** Durable children are hidden from grouped, flat, and search navigation through `workspace.archiveSession`; existing records reconcile when the parent loads.

## Model Experience

None directly, as this browser-side surface registers no model tool, prompt section, or provider route. A draft reads the parent's `session.models` without mutating it; first-send and later switches submit `session.selectModel` only for the aside child, while messages and whitelisted slash commands use `session.prompt`. The composed read-only world owns every model request the aside makes.

#### KV Cache effect

None; this package never assembles model input.

## Known Limitations and Deferred Work

- **Adaptive polling, not a live subscription** — the drawer polls the child history at 700ms while generating and backs off to 2.5s when idle (stopping when hidden/closed and refreshing immediately when visible again).
- **Exact highlight is best-effort** — Markdown source vs. rendered text, repeated spans, and browsers without the Custom Highlight API degrade to message-level marking.
- **The aside index is recovered from the child's first message** — a custom durable event type is unavailable on stock 0.1.0-rc.7 (no `ignorable` append for out-of-repo plugins).
