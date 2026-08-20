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

import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types'
import { buildQuote, normalizeText } from './quote.ts'
import { chatAnchorRow } from './message-dom-registry.ts'

/** What the watcher resolved from one browser selection. */
export interface SelectionContext {
  /** The main conversation the selection lives in (current session). */
  sessionId: string
  /** The selected span, with quote-selector disambiguation fields. */
  anchor: AsideAnchor
  /** Viewport rect of the selection, for floating-button placement. */
  rect: DOMRect
}

/** Selection bounds: reject empty, whole-message, or giant selections. */
export const MIN_SELECTION_CHARS = 2
export const MAX_SELECTION_CHARS = 800

const BUTTON_CLASS = 'aside-ask-button'

/**
 * Resolve one browser selection to a {@link SelectionContext}, or undefined
 * when it is empty, out of bounds, or no session is current. The anchor's
 * `messageId` starts null; the opener resolves it from history before the
 * aside is created.
 */
export function resolveSelection(
  doc: Document,
  currentSessionId: string | null,
): SelectionContext | undefined {
  if (currentSessionId === null || currentSessionId === '') return undefined
  const selection = doc.getSelection()
  if (selection === null || selection.rangeCount === 0 || selection.isCollapsed) return undefined
  const range = selection.getRangeAt(0)
  const exact = range.toString()
  if (exact.trim().length < MIN_SELECTION_CHARS || exact.trim().length > MAX_SELECTION_CHARS) return undefined

  const start = range.startContainer
  const messageEl = start.nodeType === Node.ELEMENT_NODE
    ? (start as Element)
    : start.parentElement
  if (messageEl === null) return undefined

  const row = chatAnchorRow(start)
  const quote = row === null ? null : buildQuote(row, range)
  const anchor: AsideAnchor = {
    messageId: null,
    exact,
    prefix: quote?.prefix ?? '',
    suffix: quote?.suffix ?? '',
    occurrence: quote?.occurrence ?? null,
    startOffset: quote?.startOffset ?? null,
  }

  // A collapsed-offscreen selection reports a zero rect (and jsdom supplies
  // no range geometry at all); position the button at the message element
  // instead of the precise span in those cases.
  let rect: DOMRect
  try {
    const probe = range.getBoundingClientRect()
    rect = probe.width === 0 && probe.height === 0 ? messageEl.getBoundingClientRect() : probe
  } catch {
    rect = messageEl.getBoundingClientRect()
  }
  return { sessionId: currentSessionId, anchor, rect }
}

/** Extract the plain text of a content-block array. */
function textOfContent(content: unknown): string {
  return (Array.isArray(content) ? content : [])
    .filter((block): block is { type: string; text?: string } => (
      typeof block === 'object' && block !== null && (block as { type?: unknown }).type === 'text'
    ))
    .map(block => block.text ?? '')
    .join('\n')
}

/**
 * Resolve the unique assistant message a selected span belongs to by matching
 * its normalized text against the session history. Returns the messageId only
 * when exactly one assistant message contains the span; ambiguity or absence
 * yields null (the aside still works message-less).
 */
export function resolveMessageId(
  entries: readonly { event: { type: string; data?: unknown } }[],
  exact: string,
): string | null {
  const needle = normalizeText(exact)
  if (needle === '') return null
  let found: string | null = null
  let count = 0
  for (const entry of entries) {
    const event = entry.event
    if (event.type !== 'assistant/message') continue
    const data = event.data as { message?: { id?: unknown; content?: unknown } } | undefined
    if (typeof data?.message?.id !== 'string') continue
    if (normalizeText(textOfContent(data.message.content)).includes(needle)) {
      found = data.message.id
      count += 1
    }
  }
  return count === 1 ? found : null
}

/**
 * Document-level watcher owning the floating ask button. `start()` installs
 * the listeners; the returned disposer removes the button and the listeners.
 */
export class SelectionWatcher {
  private button: HTMLButtonElement | null = null
  private active: SelectionContext | null = null
  private busy = false
  private errorTimer: ReturnType<typeof setTimeout> | undefined

  constructor(
    private readonly doc: Document,
    private readonly onAsk: (selection: SelectionContext) => void,
    private readonly label: string = '💬 就此提问',
    private readonly currentSession: () => string | null = () => null,
  ) {}

  /** Install the listeners; returns a disposer for the whole watcher. */
  start(): () => void {
    const onSelection = (): void => { this.sync() }
    this.doc.addEventListener('selectionchange', onSelection)
    this.doc.addEventListener('mouseup', onSelection)
    this.doc.addEventListener('mousedown', (event) => {
      if (this.button !== null && event.target instanceof Node && !this.button.contains(event.target)) {
        this.hide()
      }
    })
    return () => {
      this.doc.removeEventListener('selectionchange', onSelection)
      this.doc.removeEventListener('mouseup', onSelection)
      if (this.errorTimer !== undefined) clearTimeout(this.errorTimer)
      this.hide()
    }
  }

  /** Disable the button while a creation request is in flight. */
  setBusy(busy: boolean): void {
    this.busy = busy
    if (this.button !== null) {
      this.button.disabled = busy
    }
  }

  /** Briefly repaint the button with an error message instead of the label. */
  flashError(message: string): void {
    if (this.button === null) return
    this.button.textContent = `⚠️ ${message}`
    if (this.errorTimer !== undefined) clearTimeout(this.errorTimer)
    this.errorTimer = setTimeout(() => {
      this.errorTimer = undefined
      if (this.button !== null) {
        this.button.textContent = this.label
        this.hide()
      }
    }, 3000)
  }

  /** Re-resolve the current selection and show/hide the button accordingly. */
  private sync(): void {
    const selection = resolveSelection(this.doc, this.currentSession())
    const active = this.active
    const changed = selection === undefined
      || active === null
      || active.sessionId !== selection.sessionId
      || active.anchor.exact !== selection.anchor.exact
    if (!changed) return
    this.active = selection ?? null
    if (selection === undefined) {
      this.hide()
      return
    }
    this.show(selection)
  }

  private show(selection: SelectionContext): void {
    if (this.button === null) {
      this.button = this.doc.createElement('button')
      this.button.type = 'button'
      this.button.className = BUTTON_CLASS
      this.button.textContent = this.label
      this.button.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        const active = this.active
        this.hide()
        if (active !== null) this.onAsk(active)
      })
      this.doc.body.appendChild(this.button)
    }
    this.button.disabled = this.busy
    const rect = selection.rect
    this.button.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 64, this.doc.defaultView?.innerWidth ?? 0 - 136))}px`
    this.button.style.top = `${Math.max(8, rect.top - 40)}px`
    this.button.style.display = 'block'
  }

  private hide(): void {
    this.button?.remove()
    this.button = null
  }
}
