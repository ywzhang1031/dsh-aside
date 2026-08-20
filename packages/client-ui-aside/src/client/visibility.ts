/** Plugin-owned projection that keeps durable aside sessions out of DSH navigation. */

import type { SessionId } from '@deepseek-ai/dsh-client-connection/client'
import type { AsideRecord } from 'dsh-aside-host/types'

/** Minimal public Workspace face used by the aside plugin. */
export interface AsideWorkspaceFace {
  readonly list: {
    getSnapshot(): { readonly archivedSessionIds: readonly SessionId[] }
  }
  archiveSession(sessionId: SessionId): Promise<void>
}

/**
 * Hide confirmed aside records through DSH's public archive projection.
 * Archiving preserves logs and Workspace accounting; it only removes the
 * child from grouping, flat-list, and search surfaces.
 */
export class AsideVisibility {
  private readonly hiding = new Map<string, Promise<boolean>>()

  constructor(
    private readonly workspaces: AsideWorkspaceFace,
    private readonly report: (message: string, error: unknown) => void = (message, error) => {
      console.warn(message, error)
    },
  ) {}

  /** Hide one record idempotently; failures stay retryable on the next reconciliation. */
  hide(record: AsideRecord): Promise<boolean> {
    const id = record.subSessionId as SessionId
    if (this.workspaces.list.getSnapshot().archivedSessionIds.includes(id)) return Promise.resolve(true)
    const active = this.hiding.get(record.subSessionId)
    if (active !== undefined) return active

    const pending = this.workspaces.archiveSession(id)
      .then(() => true)
      .catch((error: unknown) => {
        this.report(`[aside] failed to hide child session "${record.subSessionId}" from Workspace navigation:`, error)
        return false
      })
      .finally(() => {
        if (this.hiding.get(record.subSessionId) === pending) this.hiding.delete(record.subSessionId)
      })
    this.hiding.set(record.subSessionId, pending)
    return pending
  }

  /** Reconcile Host-confirmed records; never infer aside identity from parentSession alone. */
  reconcile(records: readonly AsideRecord[]): void {
    for (const record of records) void this.hide(record)
  }
}
