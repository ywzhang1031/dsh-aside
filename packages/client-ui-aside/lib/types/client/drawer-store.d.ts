/**
 * Drawer open-state store: which side conversation the overlay shows, or a
 * pending draft that only becomes a real aside once the user actually sends
 * a question. A closed unanswered draft leaves nothing behind — no session,
 * no anchor, no highlight. The full {@link AsideAnchor} is carried so the
 * first send can hand it to `aside.create`; the Host (not the client)
 * persists it into the child's first message.
 * @module @ywzhang1031/dsh-client-ui-aside/drawer-store
 */
import type { AsideAnchor, AsideRecord } from '@ywzhang1031/dsh-aside-host/types';
/** Immutable snapshot the drawer component renders. */
export interface DrawerState {
    /** The open side conversation, or null while the drawer is closed. */
    subSessionId: string | null;
    /** The main conversation the aside hangs off (for display and return). */
    parentSessionId: string | null;
    /** The selected span this side conversation answers. */
    anchor: AsideAnchor | null;
    /** True until the first send: nothing durable exists yet. */
    draft: boolean;
    /** Creation/loading error surfaced in the drawer, or null. */
    error: string | null;
    /** The full durable record, once created or reopened. */
    record: AsideRecord | null;
}
export declare class DrawerStore {
    private state;
    private version;
    private readonly listeners;
    get(): DrawerState;
    /**
     * Monotonic counter bumped on every state transition. Callers capture it
     * before an async first-send and re-check it afterwards so a drawer that was
     * closed/reopened mid-flight never gets bound to the wrong anchor.
     */
    getVersion(): number;
    /**
     * Open a fresh draft: the drawer shows an empty composer bound to one
     * selection. Nothing durable is created until the first send succeeds.
     */
    openDraft(next: {
        parentSessionId: string;
        anchor: AsideAnchor;
    }): void;
    /** Open the drawer on one existing aside (anchor or sidebar entry click). */
    openSub(record: AsideRecord): void;
    /** Bind the exact Host record to the draft that initiated its first send. */
    attach(record: AsideRecord, expectedVersion: number): boolean;
    close(): void;
    setError(message: string): void;
    clearError(): void;
    subscribe(listener: () => void): () => void;
    private notify;
}
//# sourceMappingURL=drawer-store.d.ts.map