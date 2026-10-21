export declare class GapAnalysisCancelledError extends Error {
    readonly retryable = false;
    constructor();
}
export declare function isGapAnalysisCancelledError(error: unknown): error is GapAnalysisCancelledError;
/**
 * Cooperative cancellation boundary. The error is deliberately content-free
 * so it is safe in job events, logs, and error monitoring.
 */
export declare function assertGapAnalysisStillActive(analysisId: string, jobId?: string): Promise<void>;
export declare function monitorGapAnalysisCancellation(analysisId: string, jobId?: string, intervalMs?: number): {
    signal: AbortSignal;
    stop: () => void;
};
//# sourceMappingURL=gap-analysis-cancellation.d.ts.map