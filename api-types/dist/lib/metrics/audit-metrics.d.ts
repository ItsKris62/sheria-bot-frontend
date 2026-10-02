/**
 * Audit Failure Metrics
 *
 * Tracks failure counters for background audit log writes (F-10).
 * Exposes Prometheus / OpenMetrics counters for scraping at /metrics.
 */
export interface AuditMetricsState {
    failures: number;
    byType: Record<string, number>;
}
declare class AuditMetrics {
    private failures;
    private byType;
    incrementFailure(type: string): void;
    getMetrics(): AuditMetricsState;
    formatPrometheus(): string;
    reset(): void;
}
export declare const auditMetrics: AuditMetrics;
export {};
//# sourceMappingURL=audit-metrics.d.ts.map