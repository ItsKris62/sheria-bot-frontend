import type { GapAnalysisResult } from '@/lib/ai/prompts/gap-analysis';
export interface GapAnalysisReportMetrics {
    complianceAlignment: number;
    assessmentCoverage: string;
    assessedObligations: number;
    coverageStatus: 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT';
}
/**
 * Canonical report metrics consumed by export renderers. Partial coverage never
 * receives a manufactured framework denominator.
 */
export declare function buildGapAnalysisReportMetrics(result: GapAnalysisResult): GapAnalysisReportMetrics;
//# sourceMappingURL=gap-analysis-report-model.d.ts.map