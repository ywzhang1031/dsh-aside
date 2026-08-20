/**
 * Drawer open-state store: which side conversation the overlay shows, or a
 * pending draft that only becomes a real aside once the user actually sends
 * a question. A closed unanswered draft leaves nothing behind — no session,
 * no anchor, no highlight. The full {@link AsideAnchor} is carried so the
 * first send can hand it to `aside.create`; the Host (not the client)
 * persists it into the child's first message.
 * @module dsh-client-ui-aside/drawer-store
 */

import type { AsideAnchor, AsideRecord } from 'dsh-aside-host/types'
import { anchorKey } from 'dsh-aside-host/types'

/** Immutable snapshot the drawer component renders. */
export interface DrawerState {
  /** The open side conversation, or null while the drawer is closed. */
  subSessionId: string | null
  /** The main conversation the aside hangs off (for display and return). */
  parentSessionId: string | null
  /** The selected span this side conversation answers. */
  anchor: AsideAnchor | null
  /** True until the first send: nothing durable exists yet. */
  draft: boolean
  /** Creation/loading error surfaced in the drawer, or null. */
  error: string | null
  /** The full durable record, once created or reopened. */
  record: AsideRecord | null
}

const CLOSED: DrawerState = {
  subSessionId: null,
  parentSessionId: null,
  anchor: null,
  draft: false,
  error: null,
  record: null,
}

export class DrawerStore {
  private state: DrawerState = CLOSED
  private version = 0
  private readonly listeners = new Set<() => void>()

  get(): DrawerState {
    return this.state
  }

  /**
   * Monotonic counter bumped on every state transition. Callers capture it
   * before an async first-send and re-check it afterwards so a drawer that was
   * closed/reopened mid-flight never gets bound to the wrong anchor.
   */
  getVersion(): number {
    return this.version
  }

  /**
   * Open a fresh draft: the drawer shows an empty composer bound to one
   * selection. Nothing durable is created until the first send succeeds.
   */
  openDraft(next: { parentSessionId: string; anchor: AsideAnchor }): void {
    this.state = {
      subSessionId: null,
      parentSessionId: next.parentSessionId,
      anchor: next.anchor,
      draft: true,
      error: null,
      record: null,
    }
    this.notify()
  }

  /** Open the drawer on one existing aside (anchor or sidebar entry click). */
  openSub(record: AsideRecord): void {
    this.state = {
      subSessionId: record.subSessionId,
      parentSessionId: record.parentSessionId,
      anchor: record.anchor,
      draft: false,
      error: null,
      record,
    }
    this.notify()
  }

  /** Bind the exact Host record to the draft that initiated its first send. */
  attach(record: AsideRecord, expectedVersion: number): boolean {
    if (this.version !== expectedVersion
      || this.state.subSessionId !== null
      || !this.state.draft
      || this.state.anchor === null
      || this.state.parentSessionId !== record.parentSessionId
      || anchorKey(this.state.anchor) !== anchorKey(record.anchor)) return false
    this.state = {
      subSessionId: record.subSessionId,
      parentSessionId: record.parentSessionId,
      anchor: record.anchor,
      draft: false,
      error: null,
      record,
    }
    this.notify()
    return true
  }

  close(): void {
    if (this.state === CLOSED) return
    this.state = CLOSED
    this.notify()
  }

  setError(message: string): void {
    this.state = { ...this.state, error: message }
    this.notify()
  }

  clearError(): void {
    if (this.state.error === null) return
    this.state = { ...this.state, error: null }
    this.notify()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify(): void {
    this.version += 1
    for (const listener of [...this.listeners]) {
      try {
        listener()
      } catch (error) {
        console.error('[aside] drawer listener threw:', error)
      }
    }
  }
}
