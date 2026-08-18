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
/** Selection bounds: reject empty, whole-message, or giant selections. */
export const MIN_SELECTION_CHARS = 2;
export const MAX_SELECTION_CHARS = 800;
const BUTTON_CLASS = 'aside-ask-button';
/**
 * Resolve one browser selection to a {@link SelectionContext}, or undefined
 * when it is empty, out of bounds, or no session is current. The session is
 * the runtime's current one: selections happen in the conversation the user
 * is viewing.
 */
export function resolveSelection(doc, currentSessionId) {
    if (currentSessionId === null || currentSessionId === '')
        return undefined;
    const selection = doc.getSelection();
    if (selection === null || selection.rangeCount === 0 || selection.isCollapsed)
        return undefined;
    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    if (text.length < MIN_SELECTION_CHARS || text.length > MAX_SELECTION_CHARS)
        return undefined;
    const start = range.startContainer;
    const messageEl = start.nodeType === Node.ELEMENT_NODE
        ? start
        : start.parentElement;
    if (messageEl === null)
        return undefined;
    // A collapsed-offscreen selection reports a zero rect (and jsdom supplies
    // no range geometry at all); position the button at the message element
    // instead of the precise span in those cases.
    let rect;
    try {
        const probe = range.getBoundingClientRect();
        rect = probe.width === 0 && probe.height === 0 ? messageEl.getBoundingClientRect() : probe;
    }
    catch {
        rect = messageEl.getBoundingClientRect();
    }
    return { sessionId: currentSessionId, messageId: null, text, rect };
}
/**
 * Document-level watcher owning the floating ask button. `start()` installs
 * the listeners; the returned disposer removes the button and the listeners.
 */
export class SelectionWatcher {
    doc;
    onAsk;
    label;
    currentSession;
    button = null;
    active = null;
    busy = false;
    errorTimer;
    constructor(doc, onAsk, label = '💬 就此提问', currentSession = () => null) {
        this.doc = doc;
        this.onAsk = onAsk;
        this.label = label;
        this.currentSession = currentSession;
    }
    /** Install the listeners; returns a disposer for the whole watcher. */
    start() {
        const onSelection = () => { this.sync(); };
        this.doc.addEventListener('selectionchange', onSelection);
        this.doc.addEventListener('mouseup', onSelection);
        this.doc.addEventListener('mousedown', (event) => {
            // A click away from the button (its own click is handled by the button)
            // hides it; the button removes itself on activation.
            if (this.button !== null && event.target instanceof Node && !this.button.contains(event.target)) {
                this.hide();
            }
        });
        return () => {
            this.doc.removeEventListener('selectionchange', onSelection);
            this.doc.removeEventListener('mouseup', onSelection);
            if (this.errorTimer !== undefined)
                clearTimeout(this.errorTimer);
            this.hide();
        };
    }
    /** Disable the button while a creation request is in flight. */
    setBusy(busy) {
        this.busy = busy;
        if (this.button !== null) {
            this.button.disabled = busy;
        }
    }
    /** Briefly repaint the button with an error message instead of the label. */
    flashError(message) {
        if (this.button === null)
            return;
        this.button.textContent = `⚠️ ${message}`;
        if (this.errorTimer !== undefined)
            clearTimeout(this.errorTimer);
        this.errorTimer = setTimeout(() => {
            this.errorTimer = undefined;
            if (this.button !== null) {
                this.button.textContent = this.label;
                this.hide();
            }
        }, 3000);
    }
    /** Re-resolve the current selection and show/hide the button accordingly. */
    sync() {
        const selection = resolveSelection(this.doc, this.currentSession());
        const active = this.active;
        const changed = selection === undefined
            || active === null
            || active.sessionId !== selection.sessionId
            || active.messageId !== selection.messageId
            || active.text !== selection.text;
        if (!changed)
            return;
        this.active = selection ?? null;
        if (selection === undefined) {
            this.hide();
            return;
        }
        this.show(selection);
    }
    show(selection) {
        if (this.button === null) {
            this.button = this.doc.createElement('button');
            this.button.type = 'button';
            this.button.className = BUTTON_CLASS;
            this.button.textContent = this.label;
            this.button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const active = this.active;
                this.hide();
                if (active !== null)
                    this.onAsk(active);
            });
            this.doc.body.appendChild(this.button);
        }
        this.button.disabled = this.busy;
        const rect = selection.rect;
        this.button.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 64, this.doc.defaultView?.innerWidth ?? 0 - 136))}px`;
        this.button.style.top = `${Math.max(8, rect.top - 40)}px`;
        this.button.style.display = 'block';
    }
    hide() {
        this.button?.remove();
        this.button = null;
    }
}
//# sourceMappingURL=selection.js.map