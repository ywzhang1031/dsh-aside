/**
 * Drawer open-state store: which side conversation the overlay shows, or a
 * pending draft that only becomes a real aside once the user actually sends
 * a question. A closed unanswered draft leaves nothing behind — no session,
 * no anchor, no highlight. The full {@link AsideAnchor} is carried so the
 * first send can hand it to `aside.create`; the Host (not the client)
 * persists it into the child's first message.
 * @module dsh-client-ui-aside/drawer-store
 */
import { anchorKey } from 'dsh-aside-host/types';
const CLOSED = {
    subSessionId: null,
    parentSessionId: null,
    anchor: null,
    draft: false,
    error: null,
    record: null,
};
export class DrawerStore {
    state = CLOSED;
    version = 0;
    listeners = new Set();
    get() {
        return this.state;
    }
    /**
     * Monotonic counter bumped on every state transition. Callers capture it
     * before an async first-send and re-check it afterwards so a drawer that was
     * closed/reopened mid-flight never gets bound to the wrong anchor.
     */
    getVersion() {
        return this.version;
    }
    /**
     * Open a fresh draft: the drawer shows an empty composer bound to one
     * selection. Nothing durable is created until the first send succeeds.
     */
    openDraft(next) {
        this.state = {
            subSessionId: null,
            parentSessionId: next.parentSessionId,
            anchor: next.anchor,
            draft: true,
            error: null,
            record: null,
        };
        this.notify();
    }
    /** Open the drawer on one existing aside (anchor or sidebar entry click). */
    openSub(record) {
        this.state = {
            subSessionId: record.subSessionId,
            parentSessionId: record.parentSessionId,
            anchor: record.anchor,
            draft: false,
            error: null,
            record,
        };
        this.notify();
    }
    /** Bind the exact Host record to the draft that initiated its first send. */
    attach(record, expectedVersion) {
        if (this.version !== expectedVersion
            || this.state.subSessionId !== null
            || !this.state.draft
            || this.state.anchor === null
            || this.state.parentSessionId !== record.parentSessionId
            || anchorKey(this.state.anchor) !== anchorKey(record.anchor))
            return false;
        this.state = {
            subSessionId: record.subSessionId,
            parentSessionId: record.parentSessionId,
            anchor: record.anchor,
            draft: false,
            error: null,
            record,
        };
        this.notify();
        return true;
    }
    close() {
        if (this.state === CLOSED)
            return;
        this.state = CLOSED;
        this.notify();
    }
    setError(message) {
        this.state = { ...this.state, error: message };
        this.notify();
    }
    clearError() {
        if (this.state.error === null)
            return;
        this.state = { ...this.state, error: null };
        this.notify();
    }
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
                console.error('[aside] drawer listener threw:', error);
            }
        }
    }
}
//# sourceMappingURL=drawer-store.js.map