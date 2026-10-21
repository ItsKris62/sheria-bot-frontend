import type { GapAnalysisDepthProfile } from '@/config/gap-analysis-depth-profiles';
import type { PolicyChunk, RawChunkGapItem } from '@/lib/ai/prompts/gap-analysis';
export interface DepthExecutionTelemetry {
    retrievalQueryCount: number;
    retrievalCandidateCount: number;
    acceptedEvidenceCount: number;
    weakEvidenceRetryCount: number;
    documentChunks: number;
    processedChunks: number;
    analysisCallCount: number;
    verificationCallCount: number;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
    limitations: string[];
}
export declare class GapAnalysisBudgetExceededError extends Error {
    readonly budget: string;
    readonly retryable = false;
    constructor(budget: string);
}
export declare class GapAnalysisExecutionBudget {
    private readonly profile;
    private readonly startedAt;
    private readonly assertActive;
    private modelCalls;
    private estimatedInputTokens;
    private reservedOutputTokens;
    private retrievalOperations;
    constructor(profile: GapAnalysisDepthProfile, startedAt: number, assertActive: () => Promise<void>);
    beforeRetrieval(estimatedInputTokens: number, maxOutputTokens?: number): Promise<void>;
    beforeModelCall(estimatedInputTokens: number, maxOutputTokens: number): Promise<void>;
    snapshot(): {
        modelCalls: number;
        estimatedInputTokens: number;
        reservedOutputTokens: number;
        retrievalOperations: number;
    };
}
export declare function estimatePromptTokens(...parts: Array<string | undefined>): number;
export declare function buildDepthRetrievalQueries(params: {
    framework: string;
    jurisdictionNames: string;
    policyKeywords: string[];
    profile: GapAnalysisDepthProfile;
}): string[];
export declare function buildWeakEvidenceRetryQuery(params: {
    framework: string;
    jurisdictionNames: string;
    policyKeywords: string[];
}): string;
export declare function selectPolicyChunksForDepth(chunks: PolicyChunk[], profile: GapAnalysisDepthProfile): {
    selected: PolicyChunk[];
    skipped: number;
    completeConfiguredTraversal: boolean;
};
export declare function mergeEnhancedRawFindings(baseline: RawChunkGapItem[], enhanced: RawChunkGapItem[]): RawChunkGapItem[];
export declare function mapWithConcurrency<T, R>(values: readonly T[], concurrency: number, worker: (value: T, index: number) => Promise<R>): Promise<R[]>;
//# sourceMappingURL=gap-analysis-depth-engine.d.ts.map