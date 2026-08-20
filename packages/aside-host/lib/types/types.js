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
 * @module dsh-aside-host/types
 */
/** The on-wire/anchor schema revision this package writes and reads. */
export const ASIDE_SCHEMA_VERSION = 1;
/**
 * Encode an anchor into a marker line for the child conversation's first user
 * message. URL-encoding keeps the marker self-delimiting (no `]` can appear
 * inside) and UTF-8 safe in both Node and browser.
 */
export function encodeAnchor(anchor) {
    return `[aside:${encodeURIComponent(JSON.stringify(anchor))}]`;
}
/**
 * Decode the anchor marker out of a first user message, or undefined when the
 * message carries none. Never throws on malformed input.
 */
export function parseAnchor(text) {
    const match = /\[aside:([^\]]+)\]/.exec(text);
    if (match === null || match[1] === undefined)
        return undefined;
    try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        return isAsideAnchor(parsed) ? parsed : undefined;
    }
    catch {
        return undefined;
    }
}
/** Structural guard for an anchor recovered from untrusted persisted text. */
export function isAsideAnchor(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const record = value;
    return (record['messageId'] === null || typeof record['messageId'] === 'string')
        && typeof record['exact'] === 'string'
        && typeof record['prefix'] === 'string'
        && typeof record['suffix'] === 'string'
        && (record['occurrence'] === null || typeof record['occurrence'] === 'number')
        && (record['startOffset'] === null || typeof record['startOffset'] === 'number');
}
/** Whitespace-normalized human summary of an anchor's exact text (for titles/sidebar). */
export function anchorSummary(exact, max = 60) {
    const compact = exact.replace(/\s+/g, ' ').trim();
    return compact.length > max ? `${compact.slice(0, max)}…` : compact;
}
/**
 * Canonical dedup identity for one anchor. Every disambiguation field counts:
 * the same text in a different message, at a different occurrence, or at a
 * different offset is a different aside.
 */
export function anchorKey(anchor) {
    return [
        anchor.messageId ?? '',
        anchor.exact,
        anchor.prefix,
        anchor.suffix,
        anchor.occurrence ?? '',
        anchor.startOffset ?? '',
    ].join('\u0000');
}
/**
 * The child conversation's first user message: the durable anchor marker plus
 * a human/model-readable quoted source. The Host appends this at create time
 * so the anchor is persisted atomically with the child session, before the
 * client sends the first question.
 */
export function anchorMessage(anchor) {
    return `${encodeAnchor(anchor)}\n\n---\n引用原文：\n${anchor.exact}`;
}
//# sourceMappingURL=types.js.map