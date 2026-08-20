/**
 * Frame sidebar: a standing right rail listing the aside chats anchored into
 * the current main conversation. Each entry opens its side conversation in
 * the drawer and locates the parent message. The list comes from the Host
 * repository cache (no localStorage, no history polling); switching the
 * parent session triggers one `aside.list` refresh.
 * @module @ywzhang1031/dsh-client-ui-aside/AsideSidebar
 */
import type { AsideRecord } from '@ywzhang1031/dsh-aside-host/types';
import { AsideRepository } from './repository.ts';
import { DrawerStore } from './drawer-store.ts';
import type { AsideLocaleKey } from './locales.ts';
/** The current session + list observable the sidebar derives from. */
export interface AsideSidebarSessions {
    subscribe(listener: () => void): () => void;
    getCurrent(): string | null;
}
export interface AsideSidebarProps {
    /** The plugin-owned Host-backed aside cache. */
    repository: AsideRepository;
    /** Drawer state, used to mark the currently open aside row. */
    drawer: DrawerStore;
    /** Current-session observable (the runtime sessions service). */
    sessions: AsideSidebarSessions;
    /** Reopen one existing aside (open drawer + locate parent message). */
    onOpenAside: (record: AsideRecord) => void;
    /** Locale binder for this surface's dictionary. */
    t: (key: AsideLocaleKey, vars?: Record<string, string>) => string;
}
/** Compact locale-aware timestamp for one sidebar row. */
export declare function formatAsideTime(timestamp: number): string;
export declare function AsideSidebar({ repository, drawer, sessions, onOpenAside, t }: AsideSidebarProps): React.ReactNode;
//# sourceMappingURL=AsideSidebar.d.ts.map