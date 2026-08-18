# @ywzhang1031/dsh-client-ui-aside

English | [中文](README.zh.md)

Browser surface for read-only side conversations ("旁注"). Select prose in a settled assistant reply, click the floating **就此提问** button (or the per-message 💬 action on the message's action strip), and an EMPTY draft drawer opens bound to that selection — nothing durable exists yet. Type a question and send it: only then is the forked aside created and the anchored source attached to the question. Closing an unanswered draft leaves nothing behind.

Runs on a **stock DSH deployment with no source modifications**: the plugin self-mounts its generated Remote stub through `ctx.remote.$mount`, reads the current session from the runtime sessions service (stock renderers publish no DOM identity attributes), and contributes its per-message entry to the stock `conversation.chat.assistant-actions` strip — the same extension point `ui-message-feedback` uses.

The plugin owns five pieces, all client-side presentation state:

- **`AnchorStore`** — the asked-about-span → aside mapping, persisted in `localStorage`; idempotent per (session, message?, text).
- **`DrawerStore`** — the open-drawer state machine: a draft (selection bound, no session) attaches to a real aside only when the first send succeeds.
- **`SelectionWatcher`** — a document-level listener that resolves a selection to the CURRENT session (via the runtime sessions service) and floats the ask button.
- **`AsideDrawer`** — the overlay-slot panel: reads history by light polling through the connection API, sends through `sessions.prompt`, and renders assistant prose through the shared markdown renderer.
- **`AsideSidebar`** — the standing Codex-style rail: produced files, web-search sources, and the current conversation's aside chats, folded from the session history; aside entries reopen their side conversation in the drawer.
- **`AsideAskAction`** — the per-message entry on the stock assistant-actions strip: carries the message's exact `messageId` (invisible to the DOM watcher), resolves the message text from history, and opens the same draft drawer.

The durable authority — the aside session, its fork lineage, its read-only posture — lives in the Host (`@ywzhang1031/dsh-aside-host`); clearing browser storage hides the anchor list but never deletes the asides.

## Stock-only trade-offs

- **No inline prose highlight.** Stock `MarkdownText` has no decoration hook, so the asked-about text cannot be highlighted inside the parent message. Re-entry instead goes through the per-message 💬 action, the sidebar's **Aside chats** section, and the session list.
- **Session-level selection attribution.** The floating button attributes a selection to the current session only (no `messageId`); the per-message action provides message-precise anchoring.

## Model Experience

None, as this browser-side surface registers no model tool, prompt section, or provider route; the composed read-only world owns every model request the aside makes.

#### KV Cache effect

None; this package never assembles model input.

## Known Limitations and Deferred Work

- **Anchors are browser-local** — the `localStorage` ledger is presentation state; a cleared store hides the aside list, while the side conversations stay reachable from the session list.
- **Polled history** — the drawer and sidebar refresh by light polling while open rather than subscribing to the live mux stream; streaming fidelity is deferred.
- **Selection is assistant-message-scoped by surface** — the floating button appears for selections inside the conversation surface; the per-message action is the message-precise entry.
- **Sidebar artifact paths are raw** — files produced indirectly by terminal commands carry no mutation location and stay out of the artifacts fold, mirroring the deliverables vocabulary.
