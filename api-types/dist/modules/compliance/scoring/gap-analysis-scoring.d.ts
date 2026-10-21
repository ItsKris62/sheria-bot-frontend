import { type JurisdictionCode } from '@/types/jurisdiction';
export interface RegulatoryEvidenceRef {
    evidenceId: string;
    vectorId: string;
    documentId?: string | null;
    documentTitle: string;
    jurisdiction: JurisdictionCode | 'GLOBAL' | 'INTERNATIONAL';
    frameworkSlug: string;
    sourceAuthority?: string;
    section?: string;
    page?: number;
    effectiveDate?: string;
    sourceStatus?: string;
    excerpt: string;
    similarityScore?: number;
    rerankScore?: number;
}
export interface PolicyEvidenceRef {
    policyEvidenceId: string;
    chunkIndex?: number;
    page?: number;
    sectionHeading?: string;
    excerpt: string;
    startOffset?: number;
    endOffset?: number;
}
export interface DocumentCoverage {
    totalChunks: number;
    processedChunks: number;
    failedChunks: number;
    skippedChunks: number;
    extractionComplete: boolean;
}
export type FrameworkEvidenceStatus = 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT' | 'UNAVAILABLE';
export interface FrameworkCoverage {
    frameworkSlug: string;
    evidenceStatus: FrameworkEvidenceStatus;
    assessedRequirementCount: number;
    totalKnownRequirementCount?: number;
    unassessedRequirementCount?: number;
    notes?: string[];
}
export type VerificationVerdict = 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'UNSUPPORTED' | 'NOT_VERIFIABLE';
export interface FindingVerification {
    verdict: VerificationVerdict;
    confidence?: number;
    unsupportedClaims?: string[];
    reason?: string;
}
export interface FindingCoverage {
    regulatoryEvidenceAvailable: boolean;
    policySectionAssessed: boolean;
    extractionComplete: boolean;
}
export type RequirementOutcome = 'COMPLIANT' | 'PARTIAL' | 'GAP' | 'NOT_ASSESSED' | 'INSUFFICIENT_EVIDENCE';
export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export interface RequirementAssessment {
    id: string;
    frameworkSlug: string;
    jurisdiction: JurisdictionCode;
    requirement: string;
    requirementSummary?: string;
    status: RequirementOutcome;
    severity: FindingSeverity;
    severityRationale: string;
    weight?: number;
    policyEvidence: PolicyEvidenceRef[];
    regulatoryEvidence: RegulatoryEvidenceRef[];
    gapDescription?: string;
    remediation?: string;
    verification: FindingVerification;
    coverage: FindingCoverage;
    requestedEvidenceIds?: string[];
    resolvedEvidenceIds?: string[];
    invalidEvidenceIds?: string[];
    requestedPolicyEvidenceIds?: string[];
    resolvedPolicyEvidenceIds?: string[];
    invalidPolicyEvidenceIds?: string[];
}
export declare const SCORING_VERSION_V2 = "v2.0-evidence-backed";
export declare const OUTCOME_SCORES: Record<RequirementOutcome, number>;
export declare const SEVERITY_WEIGHTS: Record<FindingSeverity, number>;
export interface CalculatedScoringResult {
    scoringVersion: string;
    complianceAlignmentScore: number;
    assessmentCoverageScore: number;
    overallScore: number;
    coverageStatus: 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT';
    assessmentCoverage: 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT';
    assessedCount: number;
    validAssessedCount: number;
    totalCount: number;
    breakdown: {
        compliantCount: number;
        partialCount: number;
        gapCount: number;
        notAssessedCount: number;
        insufficientEvidenceCount: number;
        unsupportedQuarantinedCount: number;
        partiallySupportedCount?: number;
        notVerifiableCount?: number;
    };
    documentCoverage: DocumentCoverage;
}
/**
 * Pure, deterministic calculation of Compliance Alignment Score and Assessment Coverage.
 *
 * Principles:
 * 1. Alignment score reflects the weighted achievement across validly assessed requirements.
 * 2. Requirements with verification verdict 'UNSUPPORTED' are quarantined and do not contribute
 *    positively or negatively to the score.
 * 3. Requirements with verification verdict 'NOT_VERIFIABLE' cannot improve alignment and reduce coverage.
 * 4. Requirements with verdict 'PARTIALLY_SUPPORTED' contribute discounted credit (0.5x) rather than full credit.
 * 5. NOT_ASSESSED and INSUFFICIENT_EVIDENCE do not count toward alignment points, but reduce coverage.
 * 6. Assessment Coverage accounts for document completeness (processed / total chunks) and
 *    the proportion of requirements with sufficient regulatory and policy evidence.
 * 7. If hasKnownRequirementInventory is false (no exhaustive statutory provision registry loaded),
 *    coverage can NEVER claim COMPLETE and is capped at PARTIAL.
 */
export declare function calculateComplianceAlignmentScore(params: {
    assessments: RequirementAssessment[];
    documentCoverage: DocumentCoverage;
    expectedRequirementCount?: number;
    hasKnownRequirementInventory?: boolean;
}): CalculatedScoringResult;
//# sourceMappingURL=gap-analysis-scoring.d.ts.map