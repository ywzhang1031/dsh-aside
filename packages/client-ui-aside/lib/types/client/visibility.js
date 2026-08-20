/** Plugin-owned projection that keeps durable aside sessions out of DSH navigation. */
/**
 * Hide confirmed aside records through DSH's public archive projection.
 * Archiving preserves logs and Workspace accounting; it only removes the
 * child from grouping, flat-list, and search surfaces.
 */
export class AsideVisibility {
    workspaces;
    report;
    hiding = new Map();
    constructor(workspaces, report = (message, error) => {
        console.warn(message, error);
    }) {
        this.workspaces = workspaces;
        this.report = report;
    }
    /** Hide one record idempotently; failures stay retryable on the next reconciliation. */
    hide(record) {
        const id = record.subSessionId;
        if (this.workspaces.list.getSnapshot().archivedSessionIds.includes(id))
            return Promise.resolve(true);
        const active = this.hiding.get(record.subSessionId);
        if (active !== undefined)
            return active;
        const pending = this.workspaces.archiveSession(id)
            .then(() => true)
            .catch((error) => {
            this.report(`[aside] failed to hide child session "${record.subSessionId}" from Workspace navigation:`, error);
            return false;
        })
            .finally(() => {
            if (this.hiding.get(record.subSessionId) === pending)
                this.hiding.delete(record.subSessionId);
        });
        this.hiding.set(record.subSessionId, pending);
        return pending;
    }
    /** Reconcile Host-confirmed records; never infer aside identity from parentSession alone. */
    reconcile(records) {
        for (const record of records)
            void this.hide(record);
    }
}
//# sourceMappingURL=visibility.js.map