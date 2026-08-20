/**
 * Aside repository: the browser cache over the Host's durable aside index.
 * The Host (not localStorage) is the single source of truth — this store only
 * mirrors `aside.list`/`aside.create` results for the current parent
 * session. A freshly created aside is added to the cache directly from the
 * create response (no second local fact), and switching parent sessions
 * triggers one `aside.list` refresh. No polling and no `localStorage`.
 * @module @ywzhang1031/dsh-client-ui-aside/repository
 */
import { anchorKey } from '@ywzhang1031/dsh-aside-host/types';
/** Normalize one record's anchor text for the sidebar display. */
export function asideText(record, max = 60) {
    const compact = record.anchor.exact.replace(/\s+/g, ' ').trim();
    return compact.length > max ? `${compact.slice(0, max)}…` : compact;
}
/**
 * Mutable cache of asides for one parent conversation, populated from the
 * Host. One instance per browser application (the plugin owns it).
 */
export class AsideRepository {
    remote;
    records = [];
    parentSessionId = null;
    version = 0;
    /** Bumped by every refresh() and add(), so a slow stale refresh cannot clobber a newer write. */
    generation = 0;
    listeners = new Set();
    constructor(remote) {
        this.remote = remote;
    }
    /** Monotonic change counter; renderers subscribe and re-derive on bump. */
    getVersion() {
        return this.version;
    }
    /** Records for the currently cached parent session. */
    list() {
        return this.records;
    }
    /** Clear the projection when no main session is selected. */
    clear() {
        if (this.parentSessionId === null && this.records.length === 0)
            return;
        this.parentSessionId = null;
        this.records = [];
        this.generation += 1;
        this.notify();
    }
    /**
     * Load the asides for one parent session. A call is discarded when a newer
     * refresh or a local `add` superseded it (generation changed), or when the
     * user switched sessions mid-flight. Failures clear the cache so a broken
     * parent never shows a stale list.
     */
    async refresh(parentSessionId) {
        this.parentSessionId = parentSessionId;
        const generation = ++this.generation;
        const result = await this.remote.list({ parentSessionId });
        if (this.parentSessionId !== parentSessionId || this.generation !== generation)
            return;
        this.records = result.ok && result.value !== undefined ? result.value.records : [];
        this.notify();
    }
    /**
     * Add a freshly created record to the cache. The record already came from
     * the Host's create response, so this is a cache update, never a second fact.
     * Bumping the generation invalidates any in-flight refresh whose snapshot
     * predates this record, so it cannot overwrite it with a stale (possibly
     * empty) list.
     */
    add(record) {
        if (record.parentSessionId !== this.parentSessionId)
            return;
        this.generation += 1;
        const index = this.records.findIndex(item => item.subSessionId === record.subSessionId);
        if (index === -1)
            this.records = [...this.records, record];
        else
            this.records = this.records.map(item => item.subSessionId === record.subSessionId ? record : item);
        this.notify();
    }
    /** The record one anchor already answers, if any (full anchor identity). */
    find(parentSessionId, anchor) {
        const key = anchorKey(anchor);
        return this.records.find(record => (record.parentSessionId === parentSessionId && anchorKey(record.anchor) === key));
    }
    /** The record one aside id answers, if any. */
    findSub(subSessionId) {
        return this.records.find(record => record.subSessionId === subSessionId);
    }
    /** Subscribe to cache-set changes (refresh and add). */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    notify() {
        this.version += 1;
        for (const listener of [...this.listeners]) {
            try {
                listener();
            }
            catch (error) {
                console.error('[aside] repository listener threw:', error);
            }
        }
    }
}
//# sourceMappingURL=repository.js.map