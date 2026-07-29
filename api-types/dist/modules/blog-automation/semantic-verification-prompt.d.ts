import { z } from 'zod';
import type { VerificationEvidence } from './verification-evidence';
/**
 * Strict, bounded schema and prompt builders for Phase D semantic claim
 * verification. See docs/editorial-intelligence/semantic-verification-policy.md
 * for the full severity-mapping and second-model policy this schema feeds.
 */
export declare const SEMANTIC_VERIFICATION_PROMPT_VERSION = "semantic-verification-v1";
export declare const MAX_CLAIMS = 40;
export declare const MAX_CLAIM_TEXT_LENGTH = 500;
export declare const MAX_EXPLANATION_LENGTH = 600;
export declare const MAX_RECOMMENDATION_LENGTH = 300;
export declare const MAX_SOURCE_REFS_PER_CLAIM = 10;
export declare const MAX_SOURCE_REF_LENGTH = 20;
/**
 * The model's own severity opinion is captured for audit purposes only - the
 * SERVICE always computes the persisted `severity` from the fixed
 * (verificationStatus, category) mapping table, never from this field
 * directly. See "AI must not silently override deterministic editorial
 * scoring" in the governing rules.
 */
export declare const ClaimSeverityOpinionSchema: z.ZodEnum<{
    INFO: "INFO";
    WARNING: "WARNING";
    BLOCKING: "BLOCKING";
}>;
export declare const SemanticClaimSchema: z.ZodObject<{
    claimText: z.ZodString;
    category: z.ZodEnum<{
        LEGAL_OBLIGATION: "LEGAL_OBLIGATION";
        DEADLINE: "DEADLINE";
        PENALTY: "PENALTY";
        REGULATOR_AUTHORITY: "REGULATOR_AUTHORITY";
        LICENSING_REQUIREMENT: "LICENSING_REQUIREMENT";
        REPORTING_REQUIREMENT: "REPORTING_REQUIREMENT";
        SECURITY_REQUIREMENT: "SECURITY_REQUIREMENT";
        DATA_PROTECTION_REQUIREMENT: "DATA_PROTECTION_REQUIREMENT";
        NUMERICAL_CLAIM: "NUMERICAL_CLAIM";
        FACTUAL_EVENT: "FACTUAL_EVENT";
        INTERPRETATION: "INTERPRETATION";
        RECOMMENDATION: "RECOMMENDATION";
        MARKETING_STATEMENT: "MARKETING_STATEMENT";
    }>;
    paragraphIndex: z.ZodOptional<z.ZodNumber>;
    sentenceIndex: z.ZodOptional<z.ZodNumber>;
    verificationStatus: z.ZodEnum<{
        VERIFIED: "VERIFIED";
        PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
        UNSUPPORTED: "UNSUPPORTED";
        CONTRADICTED: "CONTRADICTED";
        STALE_SOURCE: "STALE_SOURCE";
        HUMAN_REVIEW_REQUIRED: "HUMAN_REVIEW_REQUIRED";
    }>;
    severityOpinion: z.ZodEnum<{
        INFO: "INFO";
        WARNING: "WARNING";
        BLOCKING: "BLOCKING";
    }>;
    confidence: z.ZodNumber;
    sourceRefs: z.ZodArray<z.ZodString>;
    explanation: z.ZodString;
    recommendation: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SemanticClaim = z.infer<typeof SemanticClaimSchema>;
export declare const SemanticVerificationSchema: z.ZodObject<{
    claims: z.ZodArray<z.ZodObject<{
        claimText: z.ZodString;
        category: z.ZodEnum<{
            LEGAL_OBLIGATION: "LEGAL_OBLIGATION";
            DEADLINE: "DEADLINE";
            PENALTY: "PENALTY";
            REGULATOR_AUTHORITY: "REGULATOR_AUTHORITY";
            LICENSING_REQUIREMENT: "LICENSING_REQUIREMENT";
            REPORTING_REQUIREMENT: "REPORTING_REQUIREMENT";
            SECURITY_REQUIREMENT: "SECURITY_REQUIREMENT";
            DATA_PROTECTION_REQUIREMENT: "DATA_PROTECTION_REQUIREMENT";
            NUMERICAL_CLAIM: "NUMERICAL_CLAIM";
            FACTUAL_EVENT: "FACTUAL_EVENT";
            INTERPRETATION: "INTERPRETATION";
            RECOMMENDATION: "RECOMMENDATION";
            MARKETING_STATEMENT: "MARKETING_STATEMENT";
        }>;
        paragraphIndex: z.ZodOptional<z.ZodNumber>;
        sentenceIndex: z.ZodOptional<z.ZodNumber>;
        verificationStatus: z.ZodEnum<{
            VERIFIED: "VERIFIED";
            PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
            UNSUPPORTED: "UNSUPPORTED";
            CONTRADICTED: "CONTRADICTED";
            STALE_SOURCE: "STALE_SOURCE";
            HUMAN_REVIEW_REQUIRED: "HUMAN_REVIEW_REQUIRED";
        }>;
        severityOpinion: z.ZodEnum<{
            INFO: "INFO";
            WARNING: "WARNING";
            BLOCKING: "BLOCKING";
        }>;
        confidence: z.ZodNumber;
        sourceRefs: z.ZodArray<z.ZodString>;
        explanation: z.ZodString;
        recommendation: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SemanticVerificationResult = z.infer<typeof SemanticVerificationSchema>;
export declare const SecondaryClaimReviewSchema: z.ZodObject<{
    verificationStatus: z.ZodEnum<{
        VERIFIED: "VERIFIED";
        PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED";
        UNSUPPORTED: "UNSUPPORTED";
        CONTRADICTED: "CONTRADICTED";
        STALE_SOURCE: "STALE_SOURCE";
        HUMAN_REVIEW_REQUIRED: "HUMAN_REVIEW_REQUIRED";
    }>;
    confidence: z.ZodNumber;
    explanation: z.ZodString;
}, z.core.$strip>;
export type SecondaryClaimReview = z.infer<typeof SecondaryClaimReviewSchema>;
export declare function buildPrimarySystemPrompt(): string;
export declare function buildPrimaryUserPrompt(content: string, evidence: VerificationEvidence): string;
export declare function buildSecondarySystemPrompt(): string;
export declare function buildSecondaryUserPrompt(claimText: string, evidence: VerificationEvidence): string;
//# sourceMappingURL=semantic-verification-prompt.d.ts.map