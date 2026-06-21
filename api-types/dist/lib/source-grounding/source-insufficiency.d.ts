import type { SearchResult } from '@/lib/rag/rag.service';
export type ComplianceFallbackReason = 'NO_RAG_CHUNKS' | 'ALL_CHUNKS_FAILED_VERIFICATION' | 'LOW_RELEVANCE' | 'OUT_OF_SCOPE' | 'ROUTE_ERROR';
export declare const COMPLIANCE_SOURCE_INSUFFICIENCY_MESSAGE = "SheriaBot could not find a sufficiently verified source in the indexed corpus for this specific question.";
export declare const COMPLIANCE_FALLBACK_MESSAGES: Record<ComplianceFallbackReason, string>;
export declare const GAP_ANALYSIS_SOURCE_INSUFFICIENCY_MESSAGE = "The selected benchmark/source documents do not provide enough verified regulatory evidence to complete this legal gap assessment. Please select stronger benchmark documents or add the missing regulatory source.";
export declare const POLICY_SOURCE_INSUFFICIENCY_MESSAGE = "I cannot generate legal citations or legal obligations for this policy without verified source documents. Please attach or select the relevant regulatory sources first.";
export declare function hasUsableSourceContext(input: {
    results?: SearchResult[] | null;
    context?: string | null;
}): boolean;
export declare function buildComplianceSourceInsufficiencyAnswer(fallbackReason?: ComplianceFallbackReason | null): string;
export declare function buildUnsupportedClaimsAnswer(unsupportedClaims: string[]): string;
export declare class SourceInsufficiencyError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=source-insufficiency.d.ts.map