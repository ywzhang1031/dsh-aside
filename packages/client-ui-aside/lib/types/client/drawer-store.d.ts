/**
 * Drawer open-state store: which side conversation the overlay shows, or a
 * pending draft that only becomes a real aside once the user actually sends
 * a question. A closed unanswered draft leaves nothing behind — no session,
 * no anchor, no highlight.
 * @module @ywzhang1031/dsh-client-ui-aside/drawer-store
 */
/** Immutable snapshot the drawer component renders. */
export interface DrawerState {
    /** The open side conversation, or null while the drawer is closed. */
    subSessionId: string | null;
    /** The main conversation the aside hangs off (for display and return). */
    parentSessionId: string | null;
    /** The selected text this side conversation answers (title + anchor). */
    anchorText: string;
    /** The selected span's message identity — only recorded once asked. */
    messageId: string | null;
    /** True until the first send: nothing durable exists yet. */
    draft: boolean;
    /** Creation/loading error surfaced in the drawer, or null. */
    error: string | null;
}
/** Build the opening question: the user's input plus the anchored source text. */
export declare function openingQuestion(input: string, anchorText: string): string;
export declare class DrawerStore {
    private state;
    private readonly listeners;
    get(): DrawerState;
    /**
     * Open a fresh draft: the drawer shows an empty composer bound to one
     * selection. Nothing durable is created until the first send succeeds.
     */
    openDraft(next: {
        parentSessionId: string;
        anchorText: string;
        messageId: string | null;
    }): void;
    /** Open the drawer on one existing aside (anchor or sidebar entry click). */
    openSub(next: {
        subSessionId: string;
        parentSessionId: string;
        anchorText: string;
    }): void;
    /** Bind the draft to the aside created by its first send. */
    attach(subSessionId: string): void;
    close(): void;
    setError(message: string): void;
    subscribe(listener: () => void): () => void;
    private notify;
}
//# sourceMappingURL=drawer-store.d.ts.map