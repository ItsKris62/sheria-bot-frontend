interface ReconciliationResult {
    scanned: number;
    finalized: number;
    failed: number;
    expired: number;
    pending: number;
    errors: number;
}
declare class IntaSendReconciliationService {
    run(): Promise<ReconciliationResult>;
}
export declare const intaSendReconciliationService: IntaSendReconciliationService;
export { IntaSendReconciliationService };
//# sourceMappingURL=intasend-reconciliation.service.d.ts.map