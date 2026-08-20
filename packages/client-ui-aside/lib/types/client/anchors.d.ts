/**
 * Aside anchor persistence: the mapping from an asked-about prose span to
 * its read-only side conversation, kept in browser localStorage so anchors
 * survive reloads. This is client-only presentation state — the durable
 * authority (parent lineage, aside lineage) lives in the session logs; a
 * lost anchor store degrades to anchors that simply no longer list, while
 * the side conversations stay reachable from the session list.
 * @module @ywzhang1031/dsh-client-ui-aside/anchors
 */
/** One anchored span in a main conversation. */
export interface AsideAnchor {
    /** The main conversation the text was asked about in. */
    sessionId: string;
    /** The assistant message the question came from, when known (idempotence key). */
    messageId?: string;
    /** The asked-about text, exactly as recorded. */
    text: string;
    /** The read-only side conversation answering this span. */
    subSessionId: string;
    /** Unix epoch ms the anchor was created. */
    createdAt: number;
}
/**
 * Mutable anchor ledger with persistence and change subscription. One
 * instance per browser application (the plugin owns it).
 */
export declare class AnchorStore {
    private readonly storage;
    private records;
    private version;
    private readonly listeners;
    constructor(storage?: Storage | undefined);
    /** Monotonic change counter; renderers subscribe and re-derive on bump. */
    getVersion(): number;
    /** Every anchor, optionally narrowed to one main conversation. */
    list(sessionId?: string): readonly AsideAnchor[];
    /** The anchor an identical (session, message?, text) span already created, if any. */
    find(sessionId: string, messageId: string | undefined, text: string): AsideAnchor | undefined;
    /** The anchor an aside id already answers, if any. */
    findSub(subSessionId: string): AsideAnchor | undefined;
    /**
     * Idempotently create an anchor: an identical (session, message, text) span
     * returns the existing record instead of creating a second side
     * conversation. Persists and notifies on creation only.
     */
    ensure(record: Omit<AsideAnchor, 'createdAt'>): AsideAnchor;
    /** Subscribe to anchor-set changes (creation only in the current surface). */
    subscribe(listener: () => void): () => void;
    private persist;
    private notify;
}
//# sourceMappingURL=anchors.d.ts.map