/**
 * Side-conversation drawer over the frame-wide overlay slot: a compact
 * read-only chat panel. It opens as a DRAFT bound to one prose selection
 * (empty composer); the first send creates the forked aside, asks the
 * question with the anchored source attached, and only then does the
 * selection become a highlightable anchor. Closing an unanswered draft
 * leaves nothing behind. Existing asides reopen for follow-up questions.
 * @module @deepseek-ai/dsh-client-ui-aside/AsideDrawer
 */
import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import { DrawerStore } from './drawer-store.ts';
import type { AsideLocaleKey } from './locales.ts';
/** One display row projected from the raw history events. */
export type DrawerRow = {
    readonly kind: 'user';
    readonly text: string;
} | {
    readonly kind: 'assistant';
    readonly text: string;
} | {
    readonly kind: 'tool';
    readonly name: string;
};
/**
 * Project raw history events into display rows: user/assistant surface
 * messages and tool-call heads; every other event type is invisible.
 * `assistant/message` carries its message nested under `data.message`
 * (the canonical event shape), while `user/message` is the message itself.
 */
export declare function projectHistory(entries: readonly {
    event: {
        type: string;
        data?: unknown;
    };
}[]): DrawerRow[];
export interface AsideDrawerProps {
    /** The plugin-owned open-state store (single instance). */
    store: DrawerStore;
    /** Shared connection API client (history/prompt). */
    api: IApiClient;
    /**
     * The draft's first send: create the forked aside, record the anchor, and
     * prompt it with the anchored source attached. Resolves true on success
     * (the store is already attached), false when creation or prompt failed.
     */
    onFirstSend: (input: string) => Promise<boolean>;
    /** Locale binder for this surface's dictionary. */
    t: (key: AsideLocaleKey, vars?: Record<string, string>) => string;
}
export declare function AsideDrawer({ store, api, onFirstSend, t }: AsideDrawerProps): React.ReactNode;
//# sourceMappingURL=AsideDrawer.d.ts.map