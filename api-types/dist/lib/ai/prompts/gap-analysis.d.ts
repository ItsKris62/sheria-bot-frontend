/**
 * Gap Analysis Generation Prompts
 * AI prompts for comparing uploaded policy documents against
 * jurisdiction-scoped regulatory requirements using RAG-retrieved context.
 */
import { z } from 'zod';
import { type JurisdictionContext } from '@/types/jurisdiction';
export type { JurisdictionContext };
export interface GapAnalysisParams {
    policyText: string;
    documentName: string;
    documentType: string;
    regulatoryFrameworks: string[];
    benchmarkDocumentIds?: string[];
    analysisDepth: 'quick' | 'standard' | 'deep';
    focusAreas?: string[];
    ragContext?: string;
    jurisdictionContext?: JurisdictionContext;
}
export interface BenchmarkDocumentSummary {
    id: string;
    title: string;
    documentType?: string | null;
    regulatoryBody?: string | null;
}
export declare const GapItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    regulatoryBasis: z.ZodString;
    description: z.ZodString;
    policyCurrentState: z.ZodString;
    recommendation: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    priority: z.ZodNumber;
    evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
    regulatoryDeadline: z.ZodOptional<z.ZodString>;
    citationVerified: z.ZodOptional<z.ZodBoolean>;
    verificationStatus: z.ZodOptional<z.ZodEnum<{
        verified: "verified";
        unverified: "unverified";
        not_checked: "not_checked";
    }>>;
    sourceDocumentTitle: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    authorityStatus: z.ZodOptional<z.ZodString>;
    isBinding: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const FrameworkResultSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    score: z.ZodNumber;
    gaps: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        severity: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>;
        regulatoryBasis: z.ZodString;
        description: z.ZodString;
        policyCurrentState: z.ZodString;
        recommendation: z.ZodString;
        effort: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
        }>;
        priority: z.ZodNumber;
        evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
        responsibleRole: z.ZodOptional<z.ZodString>;
        regulatoryDeadline: z.ZodOptional<z.ZodString>;
        citationVerified: z.ZodOptional<z.ZodBoolean>;
        verificationStatus: z.ZodOptional<z.ZodEnum<{
            verified: "verified";
            unverified: "unverified";
            not_checked: "not_checked";
        }>>;
        sourceDocumentTitle: z.ZodOptional<z.ZodString>;
        sourceSection: z.ZodOptional<z.ZodString>;
        sourceSnippet: z.ZodOptional<z.ZodString>;
        authorityStatus: z.ZodOptional<z.ZodString>;
        isBinding: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    strengths: z.ZodArray<z.ZodString>;
    summary: z.ZodString;
}, z.core.$strip>;
export declare const ActionPlanItemSchema: z.ZodObject<{
    priority: z.ZodNumber;
    action: z.ZodString;
    framework: z.ZodString;
    deadline: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    resources: z.ZodArray<z.ZodString>;
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GapAnalysisResultSchema: z.ZodObject<{
    overallScore: z.ZodNumber;
    executiveSummary: z.ZodString;
    frameworks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        score: z.ZodNumber;
        gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            severity: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            regulatoryBasis: z.ZodString;
            description: z.ZodString;
            policyCurrentState: z.ZodString;
            recommendation: z.ZodString;
            effort: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
            }>;
            priority: z.ZodNumber;
            evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
            responsibleRole: z.ZodOptional<z.ZodString>;
            regulatoryDeadline: z.ZodOptional<z.ZodString>;
            citationVerified: z.ZodOptional<z.ZodBoolean>;
            verificationStatus: z.ZodOptional<z.ZodEnum<{
                verified: "verified";
                unverified: "unverified";
                not_checked: "not_checked";
            }>>;
            sourceDocumentTitle: z.ZodOptional<z.ZodString>;
            sourceSection: z.ZodOptional<z.ZodString>;
            sourceSnippet: z.ZodOptional<z.ZodString>;
            authorityStatus: z.ZodOptional<z.ZodString>;
            isBinding: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        strengths: z.ZodArray<z.ZodString>;
        summary: z.ZodString;
    }, z.core.$strip>>;
    crossCuttingStrengths: z.ZodArray<z.ZodString>;
    actionPlan: z.ZodArray<z.ZodObject<{
        priority: z.ZodNumber;
        action: z.ZodString;
        framework: z.ZodString;
        deadline: z.ZodString;
        effort: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
        }>;
        resources: z.ZodArray<z.ZodString>;
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>>>;
        responsibleRole: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    metadata: z.ZodObject<{
        documentName: z.ZodString;
        analysisDepth: z.ZodString;
        frameworksAnalysed: z.ZodArray<z.ZodString>;
        totalGaps: z.ZodNumber;
        criticalGaps: z.ZodNumber;
        highGaps: z.ZodNumber;
        mediumGaps: z.ZodOptional<z.ZodNumber>;
        lowGaps: z.ZodOptional<z.ZodNumber>;
        analysisDate: z.ZodString;
        calculatedScore: z.ZodOptional<z.ZodNumber>;
        scoringVersion: z.ZodOptional<z.ZodString>;
        modelSuggestedScore: z.ZodOptional<z.ZodNumber>;
        selectedBenchmarkDocuments: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodPipe<z.ZodString, z.ZodTransform<{
            id: string;
            title: string;
            documentType: null;
            regulatoryBody: null;
        }, string>>, z.ZodObject<{
            id: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            title: z.ZodString;
            documentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            regulatoryBody: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>]>>>;
        chunksProcessed: z.ZodOptional<z.ZodNumber>;
        tokenCost: z.ZodOptional<z.ZodObject<{
            inputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            estimatedCostUsd: z.ZodNumber;
        }, z.core.$strip>>;
        jurisdictionCode: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            KE: "KE";
            MW: "MW";
            RW: "RW";
            NG: "NG";
        }>>>;
        verifierStatus: z.ZodOptional<z.ZodEnum<{
            PARTIAL: "PARTIAL";
            PASS: "PASS";
            FAIL: "FAIL";
        }>>;
        unsupportedClaims: z.ZodOptional<z.ZodArray<z.ZodString>>;
        retrievalVersion: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Raw gap item returned by the per-chunk phase.
 * Identical to GapItemSchema but includes a `framework` identifier so the
 * merge pass can group gaps by framework.
 */
export declare const RawChunkGapItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    regulatoryBasis: z.ZodString;
    description: z.ZodString;
    policyCurrentState: z.ZodString;
    recommendation: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    priority: z.ZodNumber;
    evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
    regulatoryDeadline: z.ZodOptional<z.ZodString>;
    citationVerified: z.ZodOptional<z.ZodBoolean>;
    verificationStatus: z.ZodOptional<z.ZodEnum<{
        verified: "verified";
        unverified: "unverified";
        not_checked: "not_checked";
    }>>;
    sourceDocumentTitle: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    authorityStatus: z.ZodOptional<z.ZodString>;
    isBinding: z.ZodOptional<z.ZodBoolean>;
    framework: z.ZodString;
}, z.core.$strip>;
/** Zod schema for the full JSON array a single chunk analysis returns. */
export declare const ChunkOutputSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    severity: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    regulatoryBasis: z.ZodString;
    description: z.ZodString;
    policyCurrentState: z.ZodString;
    recommendation: z.ZodString;
    effort: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>;
    priority: z.ZodNumber;
    evidenceRequired: z.ZodDefault<z.ZodArray<z.ZodString>>;
    responsibleRole: z.ZodOptional<z.ZodString>;
    regulatoryDeadline: z.ZodOptional<z.ZodString>;
    citationVerified: z.ZodOptional<z.ZodBoolean>;
    verificationStatus: z.ZodOptional<z.ZodEnum<{
        verified: "verified";
        unverified: "unverified";
        not_checked: "not_checked";
    }>>;
    sourceDocumentTitle: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    sourceSnippet: z.ZodOptional<z.ZodString>;
    authorityStatus: z.ZodOptional<z.ZodString>;
    isBinding: z.ZodOptional<z.ZodBoolean>;
    framework: z.ZodString;
}, z.core.$strip>>;
export type GapItem = z.infer<typeof GapItemSchema>;
export type FrameworkResult = z.infer<typeof FrameworkResultSchema>;
export type ActionPlanItem = z.infer<typeof ActionPlanItemSchema>;
export type GapAnalysisResult = z.infer<typeof GapAnalysisResultSchema>;
export type RawChunkGapItem = z.infer<typeof RawChunkGapItemSchema>;
export type ChunkOutput = z.infer<typeof ChunkOutputSchema>;
export interface PolicyChunk {
    index: number;
    total: number;
    text: string;
    charStart: number;
    charEnd: number;
}
/**
 * Chunk size and overlap constants.
 * A chunk of ~6,000 characters fits comfortably within Claude's context
 * alongside the system prompt, RAG context, and JSON response buffer.
 */
export declare const CHUNK_SIZE = 6000;
export declare const CHUNK_OVERLAP = 800;
/**
 * Split policy text into overlapping chunks that respect paragraph boundaries.
 * If the text fits within CHUNK_SIZE the result is a single-element array  -
 * callers should check length === 1 to skip the multi-pass path.
 */
export declare function chunkPolicyText(text: string, chunkSize?: number, overlap?: number): PolicyChunk[];
/**
 * Patterns that are characteristic of prompt injection attacks embedded inside
 * a policy document.  Each pattern is replaced with '[REDACTED]' so the
 * surrounding text remains readable but the instruction cannot be executed.
 *
 * Returns the sanitized text and a flag indicating whether any substitution
 * was made (so callers can log the event).
 */
export declare function sanitizePolicyText(text: string): {
    sanitized: string;
    wasModified: boolean;
};
/**
 * System prompt for gap analysis (T4: expanded regulation list).
 */
export declare function generateGapAnalysisSystemPrompt(jurisdictionContext?: JurisdictionContext): string;
/**
 * User prompt for the first-pass per-chunk phase.
 * Only identifies gaps in the given chunk  -  no scoring or consolidation.
 */
export declare function generateChunkAnalysisUserPrompt(params: Omit<GapAnalysisParams, 'policyText'> & {
    chunkText: string;
}, chunkIndex: number, totalChunks: number): string;
/**
 * User prompt for the second-pass consolidation merge.
 * Receives all raw per-chunk gaps and produces the full GapAnalysisResult.
 */
export declare function generateMergeUserPrompt(rawGaps: unknown[], params: Omit<GapAnalysisParams, 'policyText'> & {
    chunkCount: number;
}): string;
/**
 * User prompt for gap analysis  -  used for single-pass (document <= CHUNK_SIZE).
 */
export declare function generateGapAnalysisUserPrompt(params: GapAnalysisParams): string;
export declare const GAP_SCORING_VERSION = "v1.0-deterministic";
export interface DeterministicScoreBreakdown {
    calculatedScore: number;
    modelSuggestedScore?: number;
    scoringVersion: string;
    penalties: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        totalPenalty: number;
    };
    gapCounts: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        total: number;
    };
}
/**
 * Authoritative deterministic score calculation for policy gap analysis.
 * Formula: 100 - (25 * CRITICAL) - (15 * HIGH) - (8 * MEDIUM) - (3 * LOW), clamped to [0, 100].
 */
export declare function calculateDeterministicGapScore(gaps: Array<{
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}>, modelSuggestedScore?: number): DeterministicScoreBreakdown;
/**
 * Parse and validate AI gap analysis output using Zod (T3).
 * Falls back to regex JSON extraction if the response contains surrounding text.
 */
export declare function parseGapAnalysisOutput(rawContent: string): GapAnalysisResult;
/**
 * Parse and validate the JSON array output from a single chunk analysis.
 * Each chunk prompt returns `[]` or an array of raw gap objects with an extra
 * `framework` field. Returns an empty array on an empty/null AI response rather
 * than throwing, so a single bad chunk does not abort the whole analysis.
 */
export declare function parseChunkAnalysisOutput(rawContent: string, chunkIndex: number): RawChunkGapItem[];
//# sourceMappingURL=gap-analysis.d.ts.map