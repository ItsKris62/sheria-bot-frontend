export interface ReconcileOptions {
    staleThresholdMs?: number;
    batchSize?: number;
}
export interface ReconcileSummary {
    scanned: number;
    reconciled: number;
    settledCleaned: number;
    refundedUnits: number;
    errors: number;
}
export declare class OrphanedCreditReconciliationService {
    /**
     * Scans for dangling usage reservations in Redis and reconciles orphaned credits.
     */
    reconcileOrphanedCredits(options?: ReconcileOptions): Promise<ReconcileSummary>;
}
export declare const orphanedCreditReconciliationService: OrphanedCreditReconciliationService;
//# sourceMappingURL=orphaned-credit-reconciliation.service.d.ts.map