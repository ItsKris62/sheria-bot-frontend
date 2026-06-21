import type { SearchResult } from '@/lib/rag/rag.service';
export type SourceVerificationExpectedBehavior = 'ANSWER' | 'ABSTAIN' | 'PARTIAL';
export type SourceVerificationEvalItem = {
    id: string;
    question: string;
    jurisdiction?: string;
    framework?: string;
    expectedBehavior: SourceVerificationExpectedBehavior;
    expectedSourceTitles?: string[];
    expectedDocumentIds?: string[];
    forbiddenSourceTitles?: string[];
    forbiddenDocumentIds?: string[];
    requiresExactProvision?: boolean;
    notes?: string;
};
export type RetrievalEvalResult = {
    id: string;
    expectedBehavior: SourceVerificationExpectedBehavior;
    retrievedCount: number;
    expectedSourceHit: boolean;
    forbiddenSourceHit: boolean;
    abstainSatisfied: boolean;
    precisionSignal: number;
    metadataCompleteness: number;
    missingMetadataFields: string[];
};
export declare function scoreSourceMetadataCompleteness(results: SearchResult[]): {
    score: number;
    missingFields: string[];
};
export declare function evaluateRetrievalResults(item: SourceVerificationEvalItem, results: SearchResult[]): RetrievalEvalResult;
//# sourceMappingURL=evals.d.ts.map