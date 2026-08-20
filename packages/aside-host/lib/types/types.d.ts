/**
 * Wire vocabulary and anchor codec for the aside Remote domain: the payloads
 * a browser client sends and the results the gateway answers, kept
 * JSON-serializable and free of Host-only service types.
 *
 * The anchor record is the single durable contract between the Host gateway
 * and the browser client. Because stock DSH 0.1.0-rc.7 offers no public API
 * for an out-of-repo plugin to append a durable custom session event (the
 * persistence read path refuses unknown event types unless they carry the
 * `ignorable` envelope marker, and `Session.append` exposes no way to set
 * it), the anchor is encoded into the child conversation's first user message
 * by {@link encodeAnchor}. The child session's `parentSession` header links
 * it back to its parent, so {@link AsideGateway.list} can recover every aside
 * for a parent by reading the child's first message. No localStorage and no
 * DSH source patch are involved.
 * @module @ywzhang1031/dsh-aside-host/types
 */
/** The on-wire/anchor schema revision this package writes and reads. */
export declare const ASIDE_SCHEMA_VERSION = 1;
/** Where the selection sits inside one parent message, with disambiguation fields. */
export interface AsideAnchor {
    /** The parent assistant message the question came from, when known. */
    messageId: string | null;
    /** The selected prose, exactly as chosen. */
    exact: string;
    /** Text immediately before the selection, for same-text disambiguation. */
    prefix: string;
    /** Text immediately after the selection, for same-text disambiguation. */
    suffix: string;
    /** 1-based occurrence index among identical matches, when computable. */
    occurrence: number | null;
    /** Character offset of the selection start inside the message, when computable. */
    startOffset: number | null;
}
/** One durable aside relationship: parent conversation, child side-conversation, and its anchor. */
export interface AsideRecord {
    schemaVersion: typeof ASIDE_SCHEMA_VERSION;
    /** The main conversation this side conversation hangs off. */
    parentSessionId: string;
    /** The read-only side conversation answering the anchor. */
    subSessionId: string;
    anchor: AsideAnchor;
    /** Unix epoch ms the aside was created. */
    createdAt: number;
    /** Unix epoch ms the aside was last updated (latest child log event time). */
    updatedAt: number;
}
/** Request: create one read-only side conversation under a parent session. */
export interface AsideCreateRequest {
    /** The main conversation this side conversation hangs off. */
    parentSessionId: string;
    /** The selected prose the aside answers, with disambiguation fields. */
    anchor: AsideAnchor;
}
/** Result of a successful aside creation. */
export interface AsideCreateResult {
    /** The full durable record, echoed back so the client never fabricates a second fact. */
    record: AsideRecord;
}
/** Request: list every aside hanging off one parent conversation. */
export interface AsideListRequest {
    parentSessionId: string;
}
/** Result of listing asides for a parent conversation. */
export interface AsideListResult {
    /** Records sorted by updatedAt descending; corrupt/childless children are skipped. */
    records: AsideRecord[];
}
/**
 * Encode an anchor into a marker line for the child conversation's first user
 * message. URL-encoding keeps the marker self-delimiting (no `]` can appear
 * inside) and UTF-8 safe in both Node and browser.
 */
export declare function encodeAnchor(anchor: AsideAnchor): string;
/**
 * Decode the anchor marker out of a first user message, or undefined when the
 * message carries none. Never throws on malformed input.
 */
export declare function parseAnchor(text: string): AsideAnchor | undefined;
/** Structural guard for an anchor recovered from untrusted persisted text. */
export declare function isAsideAnchor(value: unknown): value is AsideAnchor;
/** Whitespace-normalized human summary of an anchor's exact text (for titles/sidebar). */
export declare function anchorSummary(exact: string, max?: number): string;
/**
 * Canonical dedup identity for one anchor. Every disambiguation field counts:
 * the same text in a different message, at a different occurrence, or at a
 * different offset is a different aside.
 */
export declare function anchorKey(anchor: AsideAnchor): string;
/**
 * The child conversation's first user message: the durable anchor marker plus
 * a human/model-readable quoted source. The Host appends this at create time
 * so the anchor is persisted atomically with the child session, before the
 * client sends the first question.
 */
export declare function anchorMessage(anchor: AsideAnchor): string;
//# sourceMappingURL=types.d.ts.map