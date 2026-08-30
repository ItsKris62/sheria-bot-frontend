import { type SearchResult } from '@/lib/rag/rag.service';
import { type SourceCitation } from '@/lib/source-grounding/citations';
import type { ComplianceFallbackReason } from '@/lib/source-grounding/source-insufficiency';
import type { GraderFailureClassification } from '@/modules/compliance/orchestrator/grader.agent';
import type { JurisdictionContext } from '@/types/jurisdiction';
export type RegulatoryIntelligenceFeature = 'COMPLIANCE_QUERY' | 'FOLLOW_UP' | 'QUICK_CHECK' | 'GAP_ANALYSIS' | 'CHECKLIST' | 'POLICY' | 'ROADMAP' | 'RECOMMENDATION' | 'CUSTOM_FRAMEWORK' | 'POLICY_CITATION_VERIFICATION';
export type RegulatoryFailureClassification = ComplianceFallbackReason | GraderFailureClassification | 'RAG_NO_EVIDENCE' | 'RAG_CORPUS_GAP' | 'GRADER_REJECTED_ALL' | 'ANTHROPIC_BILLING_BLOCKED' | 'ANTHROPIC_RATE_LIMIT' | 'ANTHROPIC_AUTH_FAILURE' | 'ANTHROPIC_OVERLOADED' | 'VERIFIER_PARTIAL' | 'VERIFIER_FAIL';
export interface RegulatoryIntelligenceRequest {
    question: string;
    feature: RegulatoryIntelligenceFeature;
    jurisdictionContext: JurisdictionContext;
    organizationContext?: {
        organizationId: string;
        organizationType?: string;
        industry?: string;
    };
    retrievalProfile?: {
        topK?: number;
        minScore?: number;
        filter?: Record<string, unknown>;
        sourceIndexMode?: 'v1' | 'v2' | 'prefer-v2';
    };
    generationProfile?: string;
    runId?: string;
    effectivePlan?: string;
    mode?: JurisdictionContext['mode'];
}
export interface RegulatoryIntelligenceResult {
    runId: string;
    grounded: boolean;
    evidence: SearchResult[];
    rejectedEvidence: SearchResult[];
    citations: SourceCitation[];
    verifierVerdict: 'PASS' | 'PARTIAL' | 'FAIL';
    unsupportedClaims: string[];
    abstained: boolean;
    failureReason?: RegulatoryFailureClassification;
    retrievedCount: number;
    acceptedCount: number;
    rejectedCount: number;
    corpusVersionSnapshot: Record<string, string | undefined>;
    retrievalVersion: string;
    acceptedContext: string;
    diagnostics?: Record<string, unknown>;
}
export declare class RegulatoryIntelligenceService {
    retrieveAndGrade(input: RegulatoryIntelligenceRequest): Promise<RegulatoryIntelligenceResult>;
    private logComplete;
}
export declare const regulatoryIntelligenceService: RegulatoryIntelligenceService;
//# sourceMappingURL=regulatory-intelligence.service.d.ts.map