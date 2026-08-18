/**
 * Aside anchor persistence: the mapping from an asked-about prose span to
 * its read-only side conversation, kept in browser localStorage so anchors
 * survive reloads. This is client-only presentation state — the durable
 * authority (parent lineage, aside lineage) lives in the session logs; a
 * lost anchor store degrades to anchors that simply no longer list, while
 * the side conversations stay reachable from the session list.
 * @module @deepseek-ai/dsh-client-ui-aside/anchors
 */
const STORAGE_KEY = 'dsh-aside-anchors';
/** Read the persisted record list, degrading to empty on any corruption. */
function readRecords(storage) {
    if (storage === undefined)
        return [];
    try {
        const raw = storage.getItem(STORAGE_KEY);
        if (raw === null)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((entry) => (typeof entry === 'object' && entry !== null
            && typeof entry.sessionId === 'string'
            && (entry.messageId === undefined || typeof entry.messageId === 'string')
            && typeof entry.text === 'string'
            && typeof entry.subSessionId === 'string'
            && typeof entry.createdAt === 'number'));
    }
    catch {
        return [];
    }
}
/**
 * Mutable anchor ledger with persistence and change subscription. One
 * instance per browser application (the plugin owns it).
 */
export class AnchorStore {
    storage;
    records;
    version = 0;
    listeners = new Set();
    constructor(storage = defaultStorage()) {
        this.storage = storage;
        this.records = readRecords(this.storage);
    }
    /** Monotonic change counter; renderers subscribe and re-derive on bump. */
    getVersion() {
        return this.version;
    }
    /** Every anchor, optionally narrowed to one main conversation. */
    list(sessionId) {
        return sessionId === undefined
            ? this.records
            : this.records.filter(record => record.sessionId === sessionId);
    }
    /** The anchor an identical (session, message?, text) span already created, if any. */
    find(sessionId, messageId, text) {
        return this.records.find(record => record.sessionId === sessionId
            && record.messageId === messageId
            && record.text === text);
    }
    /** The anchor an aside id already answers, if any. */
    findSub(subSessionId) {
        return this.records.find(record => record.subSessionId === subSessionId);
    }
    /**
     * Idempotently create an anchor: an identical (session, message, text) span
     * returns the existing record instead of creating a second side
     * conversation. Persists and notifies on creation only.
     */
    ensure(record) {
        const existing = this.find(record.sessionId, record.messageId, record.text);
        if (existing !== undefined)
            return existing;
        const created = { ...record, createdAt: Date.now() };
        this.records = [...this.records, created];
        this.persist();
        this.notify();
        return created;
    }
    /** Subscribe to anchor-set changes (creation only in the current surface). */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    persist() {
        try {
            this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.records));
        }
        catch {
            // Quota/private-mode failures keep the in-memory ledger working.
        }
    }
    notify() {
        this.version += 1;
        for (const listener of [...this.listeners]) {
            try {
                listener();
            }
            catch (error) {
                console.error('[aside] anchor listener threw:', error);
            }
        }
    }
}
function defaultStorage() {
    try {
        return typeof localStorage === 'undefined' ? undefined : localStorage;
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=anchors.js.map