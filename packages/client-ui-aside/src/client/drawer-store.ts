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
  subSessionId: string | null
  /** The main conversation the aside hangs off (for display and return). */
  parentSessionId: string | null
  /** The selected text this side conversation answers (title + anchor). */
  anchorText: string
  /** The selected span's message identity — only recorded once asked. */
  messageId: string | null
  /** True until the first send: nothing durable exists yet. */
  draft: boolean
  /** Creation/loading error surfaced in the drawer, or null. */
  error: string | null
}

const CLOSED: DrawerState = {
  subSessionId: null,
  parentSessionId: null,
  anchorText: '',
  messageId: null,
  draft: false,
  error: null,
}

/** Build the opening question: the user's input plus the anchored source text. */
export function openingQuestion(input: string, anchorText: string): string {
  const trimmed = input.trim()
  if (trimmed === '') return ''
  return `${trimmed}\n\n---\n引用原文：\n${anchorText}`
}

export class DrawerStore {
  private state: DrawerState = CLOSED
  private readonly listeners = new Set<() => void>()

  get(): DrawerState {
    return this.state
  }

  /**
   * Open a fresh draft: the drawer shows an empty composer bound to one
   * selection. Nothing durable is created until the first send succeeds.
   */
  openDraft(next: { parentSessionId: string; anchorText: string; messageId: string | null }): void {
    this.state = {
      subSessionId: null,
      parentSessionId: next.parentSessionId,
      anchorText: next.anchorText,
      messageId: next.messageId,
      draft: true,
      error: null,
    }
    this.notify()
  }

  /** Open the drawer on one existing aside (anchor or sidebar entry click). */
  openSub(next: { subSessionId: string; parentSessionId: string; anchorText: string }): void {
    this.state = {
      subSessionId: next.subSessionId,
      parentSessionId: next.parentSessionId,
      anchorText: next.anchorText,
      messageId: null,
      draft: false,
      error: null,
    }
    this.notify()
  }

  /** Bind the draft to the aside created by its first send. */
  attach(subSessionId: string): void {
    if (this.state.subSessionId !== null || !this.state.draft) return
    this.state = { ...this.state, subSessionId, draft: false, error: null }
    this.notify()
  }

  close(): void {
    if (this.state === CLOSED) return
    this.state = CLOSED
    this.notify()
  }

  setError(message: string): void {
    if (this.state.subSessionId !== null && !this.state.draft) return
    this.state = { ...this.state, error: message }
    this.notify()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify(): void {
    for (const listener of [...this.listeners]) {
      try {
        listener()
      } catch (error) {
        console.error('[aside] drawer listener threw:', error)
      }
    }
  }
}
