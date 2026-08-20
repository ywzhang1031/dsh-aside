/**
 * Drawer open-state store: which side conversation the overlay shows, or a
 * pending draft that only becomes a real aside once the user actually sends
 * a question. A closed unanswered draft leaves nothing behind — no session,
 * no anchor, no highlight.
 * @module @ywzhang1031/dsh-client-ui-aside/drawer-store
 */
const CLOSED = {
    subSessionId: null,
    parentSessionId: null,
    anchorText: '',
    messageId: null,
    draft: false,
    error: null,
};
/** Build the opening question: the user's input plus the anchored source text. */
export function openingQuestion(input, anchorText) {
    const trimmed = input.trim();
    if (trimmed === '')
        return '';
    return `${trimmed}\n\n---\n引用原文：\n${anchorText}`;
}
export class DrawerStore {
    state = CLOSED;
    listeners = new Set();
    get() {
        return this.state;
    }
    /**
     * Open a fresh draft: the drawer shows an empty composer bound to one
     * selection. Nothing durable is created until the first send succeeds.
     */
    openDraft(next) {
        this.state = {
            subSessionId: null,
            parentSessionId: next.parentSessionId,
            anchorText: next.anchorText,
            messageId: next.messageId,
            draft: true,
            error: null,
        };
        this.notify();
    }
    /** Open the drawer on one existing aside (anchor or sidebar entry click). */
    openSub(next) {
        this.state = {
            subSessionId: next.subSessionId,
            parentSessionId: next.parentSessionId,
            anchorText: next.anchorText,
            messageId: null,
            draft: false,
            error: null,
        };
        this.notify();
    }
    /** Bind the draft to the aside created by its first send. */
    attach(subSessionId) {
        if (this.state.subSessionId !== null || !this.state.draft)
            return;
        this.state = { ...this.state, subSessionId, draft: false, error: null };
        this.notify();
    }
    close() {
        if (this.state === CLOSED)
            return;
        this.state = CLOSED;
        this.notify();
    }
    setError(message) {
        if (this.state.subSessionId !== null && !this.state.draft)
            return;
        this.state = { ...this.state, error: message };
        this.notify();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    notify() {
        for (const listener of [...this.listeners]) {
            try {
                listener();
            }
            catch (error) {
                console.error('[aside] drawer listener threw:', error);
            }
        }
    }
}
//# sourceMappingURL=drawer-store.js.map