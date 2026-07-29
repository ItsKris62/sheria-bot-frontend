import { z } from 'zod';
/**
 * Strict, bounded schema and prompt builders for Phase D freshness review.
 * See docs/editorial-intelligence/freshness-and-revision-policy.md.
 */
export declare const FRESHNESS_REVIEW_PROMPT_VERSION = "freshness-review-v1";
export declare const MAX_CHANGED_SOURCE_REFS = 20;
export declare const MAX_SIGNAL_REFS = 20;
export declare const MAX_RATIONALE_LENGTH = 1000;
export declare const MAX_REVISION_SUMMARY_LENGTH = 500;
export declare const FreshnessAssessmentSchema: z.ZodObject<{
    freshnessScore: z.ZodNumber;
    action: z.ZodEnum<{
        FRESH: "FRESH";
        REVIEW_SOON: "REVIEW_SOON";
        REVISION_REQUIRED: "REVISION_REQUIRED";
        URGENT_REVISION: "URGENT_REVISION";
        ARCHIVE_RECOMMENDED: "ARCHIVE_RECOMMENDED";
        HUMAN_REVIEW_REQUIRED: "HUMAN_REVIEW_REQUIRED";
    }>;
    rationale: z.ZodString;
    changedSourceRefs: z.ZodArray<z.ZodString>;
    relevantSignalRefs: z.ZodArray<z.ZodString>;
    brokenSourceCount: z.ZodNumber;
    staleSourceCount: z.ZodNumber;
    recommendedReviewDate: z.ZodOptional<z.ZodString>;
    recommendedRevisionSummary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FreshnessAssessment = z.infer<typeof FreshnessAssessmentSchema>;
export interface DeterministicFreshnessSignals {
    ageDays: number;
    riskTier: string;
    changedSources: Array<{
        ref: string;
        title: string;
    }>;
    newSignals: Array<{
        ref: string;
        title: string;
        severity: string;
    }>;
    brokenSourceCount: number;
    staleSourceCount: number;
    sourceSetHashChanged: boolean;
}
export declare function buildFreshnessSystemPrompt(): string;
export declare function buildFreshnessUserPrompt(signals: DeterministicFreshnessSignals): string;
//# sourceMappingURL=freshness-review-prompt.d.ts.map