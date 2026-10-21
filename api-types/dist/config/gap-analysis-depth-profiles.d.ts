import type { GapAnalysisDepth } from './gap-analysis.config';
export declare const GAP_ANALYSIS_EXECUTION_PROFILE_VERSION = "gap-analysis-depth-v2";
export type GapAnalysisQueryStrategy = 'MATERIAL_RISK_SCREENING' | 'FRAMEWORK_TOPIC_DECOMPOSITION' | 'REQUIREMENT_ITERATIVE_DECOMPOSITION';
export interface GapAnalysisDepthProfile {
    depth: GapAnalysisDepth;
    retrieval: {
        queryStrategy: GapAnalysisQueryStrategy;
        queriesPerFramework: number;
        topK: number;
        candidateMultiplier: 2;
        minScore: number;
        rerankingEnabled: true;
        gradingEnabled: true;
        weakEvidenceRetryLimit: number;
        maxWeakEvidenceRetriesTotal: number;
        maxAcceptedEvidencePerFramework: number;
        maxRetrievalOperations: number;
        concurrency: number;
    };
    document: {
        strategy: 'BOUNDED_SECTION_SCREENING' | 'COMPLETE_CONFIGURED_TRAVERSAL' | 'ENHANCED_STRUCTURAL_TRAVERSAL';
        chunkSize: number;
        chunkOverlap: number;
        maxChunks: number;
        concurrency: 1;
    };
    analysis: {
        passes: 1 | 2;
        requirementDiscovery: 'MATERIAL_ONLY' | 'FRAMEWORK_EVIDENCE' | 'ITERATIVE_EVIDENCE';
        crossChunkSynthesis: boolean;
        contradictionReview: boolean;
        enhancedReview: boolean;
        singlePassOutputTokens: number;
        chunkOutputTokens: number;
        mergeOutputTokens: number;
        enhancedReviewOutputTokens: number;
    };
    verification: {
        mode: 'BASELINE' | 'SECONDARY_WEAK_FINDING_REVIEW' | 'SECONDARY_HIGH_RISK_REVIEW';
        secondaryReview: boolean;
        unresolvedFindingHandling: 'DISCLOSE_LIMITATION';
    };
    budget: {
        maxModelCalls: number;
        maxInputTokens: number;
        maxOutputTokens: number;
        maxWallClockMs: number;
        maxEvidenceRecords: number;
    };
}
export declare const GAP_ANALYSIS_DEPTH_PROFILES: Readonly<Record<GapAnalysisDepth, GapAnalysisDepthProfile>>;
export declare function getGapAnalysisDepthProfile(depth: GapAnalysisDepth): GapAnalysisDepthProfile;
export declare function buildGapAnalysisDepthDedupeScope(params: {
    organizationId: string;
    jurisdictionCode: string;
    frameworks: readonly string[];
    benchmarkDocumentIds: readonly string[];
    analysisDepth: GapAnalysisDepth;
    focusAreas: readonly string[];
}): string;
export declare const GAP_ANALYSIS_DEPTH_PRODUCT_COPY: {
    readonly quick: {
        readonly label: "Quick Scan";
        readonly description: "Fast screening for significant evidence-backed gaps.";
        readonly breadth: "Limited breadth";
    };
    readonly standard: {
        readonly label: "Standard Analysis";
        readonly description: "Balanced policy and regulatory review.";
        readonly breadth: "Recommended";
    };
    readonly deep: {
        readonly label: "Deep Analysis";
        readonly description: "Expanded retrieval, cross-section review, and enhanced verification.";
        readonly breadth: "Most thorough";
    };
};
//# sourceMappingURL=gap-analysis-depth-profiles.d.ts.map