/**
 * Prose-selection watcher: detects a text selection in the conversation
 * surface, floats an "ask about this" button above it, and hands the
 * resolved selection context (including a quote-selector anchor) to the
 * plugin's opener. Message identity is resolved separately via
 * {@link resolveMessageId} (history matching) because stock renders the
 * assistant-actions strip in a sibling node of the message text. The watcher
 * stays outside the React tree entirely.
 * @module @ywzhang1031/dsh-client-ui-aside/selection
 */
import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types';
/** What the watcher resolved from one browser selection. */
export interface SelectionContext {
    /** The main conversation the selection lives in (current session). */
    sessionId: string;
    /** The selected span, with quote-selector disambiguation fields. */
    anchor: AsideAnchor;
    /** Viewport rect of the selection, for floating-button placement. */
    rect: DOMRect;
}
/** Selection bounds: reject empty, whole-message, or giant selections. */
export declare const MIN_SELECTION_CHARS = 2;
export declare const MAX_SELECTION_CHARS = 800;
/**
 * Resolve one browser selection to a {@link SelectionContext}, or undefined
 * when it is empty, out of bounds, or no session is current. The anchor's
 * `messageId` starts null; the opener resolves it from history before the
 * aside is created.
 */
export declare function resolveSelection(doc: Document, currentSessionId: string | null): SelectionContext | undefined;
/**
 * Resolve the unique assistant message a selected span belongs to by matching
 * its normalized text against the session history. Returns the messageId only
 * when exactly one assistant message contains the span; ambiguity or absence
 * yields null (the aside still works message-less).
 */
export declare function resolveMessageId(entries: readonly {
    event: {
        type: string;
        data?: unknown;
    };
}[], exact: string): string | null;
/**
 * Document-level watcher owning the floating ask button. `start()` installs
 * the listeners; the returned disposer removes the button and the listeners.
 */
export declare class SelectionWatcher {
    private readonly doc;
    private readonly onAsk;
    private readonly label;
    private readonly currentSession;
    private button;
    private active;
    private busy;
    private errorTimer;
    constructor(doc: Document, onAsk: (selection: SelectionContext) => void, label?: string, currentSession?: () => string | null);
    /** Install the listeners; returns a disposer for the whole watcher. */
    start(): () => void;
    /** Disable the button while a creation request is in flight. */
    setBusy(busy: boolean): void;
    /** Briefly repaint the button with an error message instead of the label. */
    flashError(message: string): void;
    /** Re-resolve the current selection and show/hide the button accordingly. */
    private sync;
    private show;
    private hide;
}
//# sourceMappingURL=selection.d.ts.map