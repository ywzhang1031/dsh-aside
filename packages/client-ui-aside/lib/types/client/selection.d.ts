/**
 * Prose-selection watcher: detects a text selection in the conversation
 * surface, floats an "ask about this" button above it, and hands the
 * resolved selection context to the plugin's opener. Stock renderers publish
 * no message-level DOM identity, so the watcher attributes the selection to
 * the CURRENT session from the runtime sessions service; message identity is
 * left to the per-message aside action on the assistant-actions strip, which
 * receives the stock `messageId`. The watcher stays outside the React tree
 * entirely.
 * @module @deepseek-ai/dsh-client-ui-aside/selection
 */
/** What the watcher resolved from one browser selection. */
export interface SelectionContext {
    /** The main conversation the selection lives in (current session). */
    sessionId: string;
    /** Message identity, when the surface published one (stock: null). */
    messageId: string | null;
    /** The selected text, trimmed (watcher bounds: non-empty, ≤ maxChars). */
    text: string;
    /** Viewport rect of the selection, for floating-button placement. */
    rect: DOMRect;
}
/** Selection bounds: reject empty, whole-message, or giant selections. */
export declare const MIN_SELECTION_CHARS = 2;
export declare const MAX_SELECTION_CHARS = 800;
/**
 * Resolve one browser selection to a {@link SelectionContext}, or undefined
 * when it is empty, out of bounds, or no session is current. The session is
 * the runtime's current one: selections happen in the conversation the user
 * is viewing.
 */
export declare function resolveSelection(doc: Document, currentSessionId: string | null): SelectionContext | undefined;
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