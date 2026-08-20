/**
 * Aside UI plugin, browser half: the frame-wide side-conversation drawer, the
 * standing aside sidebar, the prose-selection watcher with its floating ask
 * button, the per-message aside action on the stock
 * `conversation.chat.assistant-actions` strip, and the exact-text highlight
 * layer. A selection is a DRAFT: nothing durable exists until the first
 * question is actually sent — the durable authority (the aside session, its
 * fork lineage, its read-only posture, and the anchor relationship) lives in
 * the Host. The browser only mirrors the Host's `aside.list`/`aside.create`
 * results; there is no `localStorage`.
 *
 * Stock-only wiring: the plugin self-mounts its generated Typert Remote stub
 * through `ctx.remote.$mount` (the same API `dsh-api-remotes` uses for the
 * shipped remotes), so no host composition change is needed; session
 * attribution comes from the runtime sessions service plus history matching
 * (stock renders the assistant-actions strip in a sibling node of the message
 * text, so the selection cannot be attributed by sentinel containment).
 * @module @ywzhang1031/dsh-client-ui-aside/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
export { AsideRepository, asideText } from './repository.ts';
export { DrawerStore, type DrawerState } from './drawer-store.ts';
export { SelectionWatcher, resolveSelection, resolveMessageId, MIN_SELECTION_CHARS, MAX_SELECTION_CHARS, type SelectionContext } from './selection.ts';
export { MessageDomRegistry, chatAnchorRow, findMessageRowBefore, type MessageDomEntry } from './message-dom-registry.ts';
export { ACTIVE_HIGHLIGHT_NAME, AsideHighlighter, supportsCustomHighlight, HIGHLIGHT_NAME, restoreAnchorRange } from './highlight.ts';
export { buildQuote, restoreRange, normalizeText, findRowContaining } from './quote.ts';
export { projectHistory, ASIDE_COMMANDS, type AsideModelSelection, type DrawerRow, AsideDrawer, type AsideDrawerProps } from './AsideDrawer.tsx';
export { AsideSidebar, type AsideSidebarProps, type AsideSidebarSessions } from './AsideSidebar.tsx';
export { AsideAskAction } from './AsideAskAction.tsx';
export { AsideVisibility, type AsideWorkspaceFace } from './visibility.ts';
export type { AsideLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The aside drawer, sidebar, and floating action's copy. */
        'aside': import('./locales.ts').AsideLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "aside";
/** Required services (cordis fiber inject). `remote.aside` is NOT injected: this plugin mounts the stub itself. */
export declare const inject: string[];
/**
 * Client plugin body: one shared repository, drawer store, message DOM
 * registry, and highlight layer, the self-mounted Remote stub, the
 * per-message aside action, the overlay drawer and sidebar, and the selection
 * watcher. Selections open a draft; the first send turns it into a real aside
 * (create → prompt) through {@link sendFirst}.
 * @param ctx - the browser root context.
 */
export declare function apply(ctx: ClientContext): Promise<void>;
//# sourceMappingURL=index.d.ts.map