/**
 * Aside repository: the browser cache over the Host's durable aside index.
 * The Host (not localStorage) is the single source of truth — this store only
 * mirrors `aside.list`/`aside.create` results for the current parent
 * session. A freshly created aside is added to the cache directly from the
 * create response (no second local fact), and switching parent sessions
 * triggers one `aside.list` refresh. No polling and no `localStorage`.
 * @module dsh-client-ui-aside/repository
 */
import type { AsideAnchor, AsideRecord } from 'dsh-aside-host/types';
/**
 * The remote namespace face this repository consumes (mounted by the plugin).
 * Declared structurally so this package stays free of a direct
 * `dsh-typert-protocol` dependency; the mounted `remote.aside` namespace
 * satisfies it.
 */
export interface AsideRemote {
    list(request: {
        parentSessionId: string;
    }): Promise<{
        readonly ok: boolean;
        readonly value?: {
            records: AsideRecord[];
        };
        readonly error?: {
            readonly message: string;
        };
    }>;
}
/** Normalize one record's anchor text for the sidebar display. */
export declare function asideText(record: AsideRecord, max?: number): string;
/**
 * Mutable cache of asides for one parent conversation, populated from the
 * Host. One instance per browser application (the plugin owns it).
 */
export declare class AsideRepository {
    private readonly remote;
    private records;
    private parentSessionId;
    private version;
    /** Bumped by every refresh() and add(), so a slow stale refresh cannot clobber a newer write. */
    private generation;
    private readonly listeners;
    constructor(remote: AsideRemote);
    /** Monotonic change counter; renderers subscribe and re-derive on bump. */
    getVersion(): number;
    /** Records for the currently cached parent session. */
    list(): readonly AsideRecord[];
    /** Clear the projection when no main session is selected. */
    clear(): void;
    /**
     * Load the asides for one parent session. A call is discarded when a newer
     * refresh or a local `add` superseded it (generation changed), or when the
     * user switched sessions mid-flight. Failures clear the cache so a broken
     * parent never shows a stale list.
     */
    refresh(parentSessionId: string): Promise<void>;
    /**
     * Add a freshly created record to the cache. The record already came from
     * the Host's create response, so this is a cache update, never a second fact.
     * Bumping the generation invalidates any in-flight refresh whose snapshot
     * predates this record, so it cannot overwrite it with a stale (possibly
     * empty) list.
     */
    add(record: AsideRecord): void;
    /** The record one anchor already answers, if any (full anchor identity). */
    find(parentSessionId: string, anchor: AsideAnchor): AsideRecord | undefined;
    /** The record one aside id answers, if any. */
    findSub(subSessionId: string): AsideRecord | undefined;
    /** Subscribe to cache-set changes (refresh and add). */
    subscribe(listener: () => void): () => void;
    private notify;
}
//# sourceMappingURL=repository.d.ts.map