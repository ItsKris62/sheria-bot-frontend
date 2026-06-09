export interface ReconciliationStats {
    r2ObjectsScanned: number;
    dbRowsScanned: number;
    r2Orphans: number;
    r2OrphansDeleted: number;
    r2OrphansSkippedYoung: number;
    dbOrphans: number;
    hashMismatches: number;
    hashesVerified: number;
    errors: number;
    durationMs: number;
    dryRun: boolean;
}
/**
 * Reconciles R2 vault/ prefix objects against VaultDocument rows.
 *
 * Phase 1: stream R2 keys, identify objects with no matching DB row (orphans).
 *   - R2 orphans older than 24h are deleted (unless dry run).
 *   - Young R2 orphans (<24h) are logged and skipped.
 *   - Soft-deleted rows still own their R2 object; not treated as orphans.
 *
 * Phase 2: stream active DB rows, HEAD-check each R2 object.
 *   - Rows with missing R2 objects are logged at error level for human review.
 *   - DB rows are NEVER auto-deleted.
 *
 * Concurrency-safe via Redis lock (sheriabot:vault:reconciliation:lock).
 */
export declare function runVaultReconciliation(): Promise<ReconciliationStats>;
//# sourceMappingURL=reconciliation.service.d.ts.map