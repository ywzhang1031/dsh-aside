/**
 * Side-conversation drawer over the frame-wide overlay slot: a compact
 * read-only chat panel. It opens as a DRAFT bound to one prose selection
 * (empty composer); the first send creates the forked aside, asks the
 * anchored source durably first, sends the question, and only then does the
 * selection become a highlightable anchor. One stable composer shows the
 * model/reasoning selection, fixed read-only posture, and command entry in
 * both draft and durable states; draft choices apply to the child before its
 * first prompt instead of mutating the parent.
 * History streams via adaptive polling (fast while generating, backing off
 * when idle, stopping when hidden/closed) with autoscroll.
 * @module dsh-client-ui-aside/AsideDrawer
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
/** The command whitelist allowed inside an aside (first version). */
export declare const ASIDE_COMMANDS: ReadonlySet<string>;
/**
 * Project raw history events into display rows: discard the inherited parent
 * seed through this aside's own (last) durable anchor marker, then surface
 * user/assistant messages and tool-call heads. The last marker matters for a
 * nested aside because its inherited seed may contain an ancestor's marker.
 */
export declare function projectHistory(entries: readonly {
    event: {
        type: string;
        data?: unknown;
    };
}[]): DrawerRow[];
/** Model route selected in a draft and applied before its first prompt. */
export interface AsideModelSelection {
    provider: string;
    model: string;
    reasoningEffort?: string;
}
export interface AsideDrawerProps {
    /** The plugin-owned open-state store (single instance). */
    store: DrawerStore;
    /** Shared connection API client (history/prompt/models). */
    api: IApiClient;
    /**
     * The draft's first send: create the forked aside, durably record the
     * anchor, hide its navigation row, and prompt it. Resolves true on success.
     */
    onFirstSend: (input: string, model?: AsideModelSelection) => Promise<boolean>;
    /** Locale binder for this surface's dictionary. */
    t: (key: AsideLocaleKey, vars?: Record<string, string>) => string;
}
export declare function AsideDrawer({ store, api, onFirstSend, t }: AsideDrawerProps): React.ReactNode;
//# sourceMappingURL=AsideDrawer.d.ts.map