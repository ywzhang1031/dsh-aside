/**
 * Codex-style frame sidebar: a standing right rail with three sections —
 * produced files, web-search sources, and the aside chats anchored into the
 * current main conversation. Artifacts open through the Host path opener;
 * sources open in a new tab; aside entries reopen their side conversation in
 * the drawer (the same target as an inline anchor click).
 * @module @deepseek-ai/dsh-client-ui-aside/AsideSidebar
 */
import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import { AnchorStore, type AsideAnchor } from './anchors.ts';
import type { AsideLocaleKey } from './locales.ts';
/** The current session + list observable the sidebar derives from. */
export interface AsideSidebarSessions {
    subscribe(listener: () => void): () => void;
    getCurrent(): string | null;
}
export interface AsideSidebarProps {
    /** The plugin-owned anchor ledger (aside chat entries per session). */
    anchors: AnchorStore;
    /** Current-session observable (the runtime sessions service). */
    sessions: AsideSidebarSessions;
    /** Shared connection API client (history reads, host path opener). */
    api: IApiClient;
    /** Reopen one existing aside in the drawer. */
    onOpenAside: (anchor: AsideAnchor) => void;
    /** Locale binder for this surface's dictionary. */
    t: (key: AsideLocaleKey, vars?: Record<string, string>) => string;
}
export declare function AsideSidebar({ anchors, sessions, api, onOpenAside, t }: AsideSidebarProps): React.ReactNode;
//# sourceMappingURL=AsideSidebar.d.ts.map