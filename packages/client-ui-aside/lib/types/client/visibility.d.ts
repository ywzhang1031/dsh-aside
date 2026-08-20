/** Plugin-owned projection that keeps durable aside sessions out of DSH navigation. */
import type { SessionId } from '@deepseek-ai/dsh-client-connection/client';
import type { AsideRecord } from 'dsh-aside-host/types';
/** Minimal public Workspace face used by the aside plugin. */
export interface AsideWorkspaceFace {
    readonly list: {
        getSnapshot(): {
            readonly archivedSessionIds: readonly SessionId[];
        };
    };
    archiveSession(sessionId: SessionId): Promise<void>;
}
/**
 * Hide confirmed aside records through DSH's public archive projection.
 * Archiving preserves logs and Workspace accounting; it only removes the
 * child from grouping, flat-list, and search surfaces.
 */
export declare class AsideVisibility {
    private readonly workspaces;
    private readonly report;
    private readonly hiding;
    constructor(workspaces: AsideWorkspaceFace, report?: (message: string, error: unknown) => void);
    /** Hide one record idempotently; failures stay retryable on the next reconciliation. */
    hide(record: AsideRecord): Promise<boolean>;
    /** Reconcile Host-confirmed records; never infer aside identity from parentSession alone. */
    reconcile(records: readonly AsideRecord[]): void;
}
//# sourceMappingURL=visibility.d.ts.map