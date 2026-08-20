/**
 * Message DOM registry: the plugin's own map from a stock assistant
 * `messageId` to that message's turn-tail row and action sentinel. The
 * per-message {@link AsideAskAction} registers its nodes on mount and
 * unregisters on unmount; the sidebar/highlight layers use the registry to
 * scroll to a message — using the stock `data-chat-anchor-key` row as a
 * local, verifiable DOM hint, with the action sentinel as the fallback (never
 * a stock CSS class name as the sole authority).
 * @module @ywzhang1031/dsh-client-ui-aside/message-dom-registry
 */
/**
 * Resolve the nearest chat-anchor row above a node, or null when the node
 * sits outside a rendered conversation row. Stock publishes the row as
 * `data-chat-anchor-key`; this is a best-effort hint, not a hard contract.
 */
export function chatAnchorRow(node) {
    if (node === null)
        return null;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return element?.closest('[data-chat-anchor-key]') ?? null;
}
/**
 * Resolve the rendered message row for an exact span immediately before one
 * registered turn-tail. Searching backwards only to the prior turn-tail
 * avoids selecting the same prose from an older turn.
 */
export function findMessageRowBefore(turnTail, exact) {
    const needle = exact.replace(/\s+/g, ' ').trim();
    if (needle === '')
        return null;
    const rows = [...turnTail.ownerDocument.querySelectorAll('[data-chat-anchor-key]')];
    const boundary = rows.indexOf(turnTail);
    if (boundary === -1)
        return null;
    for (let index = boundary - 1; index >= 0; index -= 1) {
        const row = rows[index];
        if (!(row instanceof HTMLElement))
            continue;
        const key = row.dataset.chatAnchorKey ?? '';
        if (key.includes('turn-tail'))
            break;
        const text = (row.textContent ?? '').replace(/\s+/g, ' ').trim();
        if (text.includes(needle))
            return row;
    }
    return null;
}
/**
 * Process-local registry keyed by stock messageId. Registration is scoped to
 * the action component's lifecycle; nothing observes the conversation DOM
 * here (that belongs to the highlight layer).
 */
export class MessageDomRegistry {
    entries = new Map();
    /** Register a message's DOM anchors; returns the unregister disposer. */
    register(messageId, entry) {
        this.entries.set(messageId, entry);
        return () => {
            if (this.entries.get(messageId) === entry)
                this.entries.delete(messageId);
        };
    }
    /** The DOM anchors for one message, if it is currently mounted. */
    get(messageId) {
        return this.entries.get(messageId);
    }
    /** Whether any message is registered. */
    get size() {
        return this.entries.size;
    }
}
//# sourceMappingURL=message-dom-registry.js.map