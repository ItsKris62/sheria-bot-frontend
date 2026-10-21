import type { AgentTokens } from './types';
import type { SearchResult } from '@/lib/rag/rag.service';
import { type JurisdictionContext, type JurisdictionCode } from '@/types/jurisdiction';
import type { RegulatoryEvidenceRef, PolicyEvidenceRef } from '@/modules/compliance/scoring/gap-analysis-scoring';
export type VerifierVerdict = 'PASS' | 'PARTIAL' | 'FAIL';
export interface VerifierAgentResult {
    verdict: VerifierVerdict;
    unsupportedClaims: string[];
    tokens: AgentTokens;
    parseFailed: boolean;
}
export declare function runVerifierAgent(answer: string, evidence: SearchResult[], jurisdictionContext: JurisdictionContext, signal?: AbortSignal): Promise<VerifierAgentResult>;
export interface FindingVerificationInput {
    id: string;
    title?: string;
    requirement: string;
    status: 'COMPLIANT' | 'PARTIAL' | 'GAP' | 'NOT_ASSESSED' | 'INSUFFICIENT_EVIDENCE';
    severity: string;
    severityRationale?: string;
    regulatoryBasis: string;
    policyCurrentState: string;
    regulatoryEvidence: RegulatoryEvidenceRef[];
    policyEvidence: PolicyEvidenceRef[];
    frameworkSlug: string;
    jurisdiction: JurisdictionCode;
    requestedEvidenceIds?: string[];
    resolvedEvidenceIds?: string[];
    invalidEvidenceIds?: string[];
    requestedPolicyEvidenceIds?: string[];
    resolvedPolicyEvidenceIds?: string[];
    invalidPolicyEvidenceIds?: string[];
}
export interface FindingVerificationVerdict {
    findingId: string;
    verdict: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'UNSUPPORTED' | 'NOT_VERIFIABLE';
    confidence: number;
    unsupportedClaims: string[];
    reason?: string;
}
/**
 * Claim-level verification for Gap Analysis findings.
 * Evaluates each finding independently against its associated regulatory and policy evidence.
 *
 * Rules:
 * 1. Hallucinated / invalid evidence IDs -> UNSUPPORTED.
 * 2. Missing regulatory evidence -> NOT_VERIFIABLE.
 * 3. Regulatory evidence from another jurisdiction or unrelated framework -> UNSUPPORTED.
 * 4. COMPLIANT or PARTIAL status with empty policy evidence -> UNSUPPORTED.
 * 5. Grounded regulatory basis matching the authorized requirement -> SUPPORTED.
 */
export declare function verifyFindingClaims(findings: FindingVerificationInput[], analysisJurisdiction: JurisdictionCode): FindingVerificationVerdict[];
export interface EvidenceResolutionResult {
    regulatoryEvidence: RegulatoryEvidenceRef[];
    requestedEvidenceIds: string[];
    resolvedEvidenceIds: string[];
    invalidEvidenceIds: string[];
    policyEvidence: PolicyEvidenceRef[];
    requestedPolicyEvidenceIds: string[];
    resolvedPolicyEvidenceIds: string[];
    invalidPolicyEvidenceIds: string[];
}
/**
 * Strict, deterministic evidence resolution for gap findings.
 * Enforces Batch 3.1 rules:
 * - A finding may reference regulatory evidence ONLY if explicitly cited and validated.
 * - A finding may reference policy evidence ONLY if explicitly cited and matched to current upload.
 * - NO fallback to first chunk of framework or document.
 */
export declare function resolveFindingEvidence(params: {
    citedEvidenceIds?: string[];
    citedPolicyEvidenceIds?: string[];
    frameworkSlug: string;
    frameworkName?: string;
    analysisJurisdiction: JurisdictionCode;
    acceptedEvidenceMap: Map<string, RegulatoryEvidenceRef>;
    policyEvidenceMap: Map<string, PolicyEvidenceRef>;
}): EvidenceResolutionResult;
//# sourceMappingURL=verifier.agent.d.ts.map