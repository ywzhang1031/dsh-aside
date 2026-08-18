/**
 * Sidebar folds over raw history entries: produced-file paths and web-search
 * sources, both extracted from settled `tool/result` metadata — the same
 * durable facts the tool cards present, folded across the whole conversation
 * instead of one turn. Pure functions; the sidebar component supplies the
 * history entries and the refresh cadence.
 * @module @deepseek-ai/dsh-client-ui-aside/fold
 */
/** One produced file across the conversation. */
export interface SidebarArtifact {
    /** Path exactly as the mutation tool recorded it. */
    path: string;
    /** Basename for display. */
    name: string;
}
/** One web-search source citation. */
export interface SidebarSource {
    title: string;
    url: string;
    /** Optional snippet or publication date line. */
    meta?: string;
}
type HistoryLike = readonly {
    event: {
        type: string;
        data?: unknown;
    };
}[];
/** Fold every produced file path out of settled tool results. */
export declare function foldArtifacts(entries: HistoryLike): SidebarArtifact[];
/** Fold every web-search source out of settled tool results. */
export declare function foldSources(entries: HistoryLike): SidebarSource[];
export {};
//# sourceMappingURL=fold.d.ts.map