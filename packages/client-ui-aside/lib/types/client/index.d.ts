/**
 * Aside UI plugin, browser half: the frame-wide side-conversation drawer,
 * the standing Codex-style sidebar (artifacts, sources, aside chats), the
 * prose-selection watcher with its floating ask button, the per-message
 * aside action on the stock `conversation.chat.assistant-actions` strip,
 * and the anchor ledger. A selection is a DRAFT: nothing durable exists
 * until the first question is actually sent — the durable authority (the
 * aside session, its fork lineage, its read-only posture) lives in the Host.
 *
 * Stock-only wiring: the plugin self-mounts its generated Typert Remote stub
 * through `ctx.remote.$mount` (the same API `dsh-api-remotes` uses for the
 * shipped remotes), so no host composition change is needed; session
 * attribution comes from the runtime sessions service instead of DOM
 * attributes, which stock renderers do not publish.
 * @module @ywzhang1031/dsh-client-ui-aside/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
export { AnchorStore, type AsideAnchor } from './anchors.ts';
export { DrawerStore, openingQuestion, type DrawerState } from './drawer-store.ts';
export { SelectionWatcher, resolveSelection, MAX_SELECTION_CHARS, MIN_SELECTION_CHARS, type SelectionContext } from './selection.ts';
export { foldArtifacts, foldSources, type SidebarArtifact, type SidebarSource } from './fold.ts';
export { projectHistory, type DrawerRow, AsideDrawer, type AsideDrawerProps } from './AsideDrawer.tsx';
export { AsideSidebar, type AsideSidebarProps, type AsideSidebarSessions } from './AsideSidebar.tsx';
export { AsideAskAction } from './AsideAskAction.tsx';
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
 * Client plugin body: one shared anchor ledger and drawer store, the
 * self-mounted Remote stub, the per-message aside action, the overlay drawer
 * and sidebar, and the selection watcher. Selections open a draft; the first
 * send turns it into a real aside (create → anchor → prompt) through
 * {@link sendFirst}.
 * @param ctx - the browser root context.
 */
export declare function apply(ctx: ClientContext): Promise<void>;
//# sourceMappingURL=index.d.ts.map