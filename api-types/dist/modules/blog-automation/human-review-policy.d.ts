import { BlogSourceQuality, BlogSuggestionPriority, BlogVerificationStatus } from '@prisma/client';
/**
 * Shared, server-computed requiresHumanReview policy (Pack 1 Foundation E,
 * corrected per phase-b-foundations.md). This is the ONLY place this policy
 * is evaluated - callers persist the result, they must never recompute it
 * with ad hoc logic of their own.
 *
 * Design note: this function evaluates whatever evidence is ACTUALLY
 * available at the caller's current pipeline stage. Suggestion creation only
 * has source/scoring evidence (`research`/`verification` are omitted -
 * undefined, not faked). Research completion adds `research`. Verification
 * adds `verification`. Never force absent later-stage evidence into a fake
 * default that would always flip `required` to true - undefined fields are
 * simply not evaluated.
 */
export type HumanReviewReason = 'MISSING_REQUIRED_OFFICIAL_SOURCE' | 'INSUFFICIENT_SOURCE_QUALITY' | 'UNSUPPORTED_JURISDICTION' | 'UNRESOLVED_EVIDENCE_GAPS' | 'CONTRADICTORY_SOURCES' | 'SEMANTIC_CLAIM_NOT_VERIFIED' | 'VERIFICATION_NEEDS_REVIEW_OR_BLOCKED' | 'LOW_STRUCTURED_AI_CONFIDENCE';
export interface HumanReviewEvaluation {
    required: boolean;
    reasons: HumanReviewReason[];
}
export interface ResearchEvidenceInput {
    evidenceGapCount: number;
    contradictionCount: number;
}
export interface VerificationEvidenceInput {
    status: BlogVerificationStatus;
    /** True if any linked BlogVerificationIssue has claimCategory set and claimVerificationStatus !== 'VERIFIED'. */
    hasUnverifiedSemanticClaim: boolean;
}
export interface ComputeRequiresHumanReviewInput {
    /**
     * Whether the post's category requires an OFFICIAL source (mirrors the
     * category rule already enforced in blog-verification.service.ts -
     * duplicated here deliberately rather than importing it, since that module
     * is verification-stage code out of scope for this stage; see
     * OFFICIAL_SOURCE_REQUIRED_CATEGORIES below and the note in
     * phase-c3-c5-test-report.md about reconciling this in Stage C8).
     */
    categoryRequiresOfficialSource: boolean;
    hasOfficialSource: boolean;
    sourceQuality: BlogSourceQuality;
    priority: BlogSuggestionPriority;
    /** Plain string - RegulatorySignal-derived candidates carry jurisdiction as a free string, not the typed enum. */
    jurisdiction: string;
    supportedJurisdictions?: readonly string[];
    structuredAiConfidence?: number;
    confidenceThreshold?: number;
    research?: ResearchEvidenceInput;
    verification?: VerificationEvidenceInput;
}
export declare const OFFICIAL_SOURCE_REQUIRED_CATEGORIES: readonly string[];
export declare const DEFAULT_SUPPORTED_JURISDICTIONS: readonly string[];
/** 0-100 scale, matching phase-b-foundations.md Foundation E's "initial default: 0.7". */
export declare const DEFAULT_STRUCTURED_AI_CONFIDENCE_THRESHOLD = 70;
export declare function computeRequiresHumanReview(input: ComputeRequiresHumanReviewInput): HumanReviewEvaluation;
/**
 * Suggestion-creation-time-only shape: exactly the fields
 * createSuggestionFromSourceItem already persists on BlogArticleSuggestion.
 * Used both to compute the value at creation and to re-derive reasons later
 * from a stored row (see "no new column" decision in
 * phase-c3-c5-test-report.md - reasons are recomputed on demand from already-
 * persisted evidence rather than stored as a separate field).
 */
export interface SuggestionCreationEvidence {
    category: string;
    requiresOfficialSource: boolean;
    sourceQuality: BlogSourceQuality;
    priority: BlogSuggestionPriority;
    jurisdiction: string;
}
export declare function computeRequiresHumanReviewAtCreation(evidence: SuggestionCreationEvidence): HumanReviewEvaluation;
//# sourceMappingURL=human-review-policy.d.ts.map