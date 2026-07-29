import { z } from 'zod';
import { BlogEditorialRecommendation, type BlogEditorialTriageRun } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { completeStructured as defaultCompleteStructured } from '@/lib/ai/structured/completeStructured';
import type { CompleteStructuredDependencies } from '@/lib/ai/structured/completeStructured';
/**
 * Stage C6 - Editorial triage service (Pack 1 Phase C). Extends the existing
 * deterministic relevance scorer with versioned, schema-validated AI
 * enrichment. Never replaces relevance-scoring.service.ts - it is called,
 * never re-implemented. See docs/editorial-intelligence/editorial-triage-policy.md
 * for the full scoring/versioning/idempotency policy this file implements.
 */
export declare const EDITORIAL_TRIAGE_PROMPT_VERSION = "editorial-triage-v1";
export declare const EDITORIAL_TRIAGE_AGENT_TYPE = "editorial-triage";
export declare const DETERMINISTIC_SCORE_WEIGHT = 0.6;
export declare const AI_SCORE_WEIGHT = 0.4;
export declare const LOW_SOURCE_CONFIDENCE_THRESHOLD = 50;
export declare const LOW_SOURCE_CONFIDENCE_SCORE_CAP = 60;
export declare const UNSUPPORTED_JURISDICTION_SCORE_CAP = 50;
export declare const PRIORITISE_NOW_THRESHOLD = 85;
export declare const QUEUE_THRESHOLD = 70;
export declare const MONITOR_THRESHOLD = 45;
export declare const MAX_AUDIENCES = 6;
export declare const MAX_CHANNELS = 6;
export declare const MAX_HUMAN_REVIEW_SIGNALS = 8;
export declare const MAX_RATIONALE_LENGTH = 1200;
export declare const MAX_STRING_ITEM_LENGTH = 120;
export declare const EditorialEnrichmentSchema: z.ZodObject<{
    aiRelevanceScore: z.ZodNumber;
    targetAudiences: z.ZodArray<z.ZodString>;
    recommendedChannels: z.ZodArray<z.ZodString>;
    recommendedArticleType: z.ZodOptional<z.ZodEnum<{
        SINGLE_JURISDICTION_UPDATE: "SINGLE_JURISDICTION_UPDATE";
        COUNTRY_SPECIFIC_GUIDE: "COUNTRY_SPECIFIC_GUIDE";
        CROSS_COUNTRY_COMPARISON: "CROSS_COUNTRY_COMPARISON";
        REGIONAL_TREND_ANALYSIS: "REGIONAL_TREND_ANALYSIS";
        EVERGREEN_EXPLAINER: "EVERGREEN_EXPLAINER";
        PRODUCT_EDUCATION: "PRODUCT_EDUCATION";
    }>>;
    urgency: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>;
    sourceConfidence: z.ZodNumber;
    rationale: z.ZodString;
    confidence: z.ZodNumber;
    requiresHumanReviewSignals: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type EditorialEnrichment = z.infer<typeof EditorialEnrichmentSchema>;
export declare class EditorialTriageValidationError extends Error {
    constructor(message: string);
}
export interface TriageEditorialCandidateInput {
    sourceItemId?: string;
    suggestionId?: string;
    regulatorySignalId?: string;
    idempotencyKey: string;
    forceRetriage?: boolean;
}
export type TriageEditorialCandidateResult = {
    outcome: 'agents_disabled';
} | {
    outcome: 'budget_halted';
    agentRunId: string;
} | {
    outcome: 'completed';
    triageRunId: string;
    recommendation: BlogEditorialRecommendation;
    finalScore: number;
    requiresHumanReview: boolean;
    version: number;
    replayed: boolean;
};
export type EditorialTriagePrisma = Pick<typeof defaultPrisma, 'blogSourceItem' | 'blogArticleSuggestion' | 'regulatorySignal' | 'blogSuggestionSource' | 'blogEditorialTriageRun'>;
type CompleteStructuredFn = typeof defaultCompleteStructured;
export interface EditorialTriageServiceDependencies {
    prisma?: EditorialTriagePrisma;
    agentRuns?: Pick<AgentRunService, 'beginRun' | 'completeRun' | 'failRun'>;
    completeStructuredFn?: CompleteStructuredFn;
    llmGateway?: CompleteStructuredDependencies['llmGateway'];
    now?: () => Date;
}
export declare function combineScores(input: {
    deterministicScore: number;
    aiRelevanceScore: number | null;
    sourceConfidence: number;
    jurisdictionSupported: boolean;
}): number;
export declare function mapRecommendation(input: {
    finalScore: number;
    requiresHumanReview: boolean;
    isDuplicate: boolean;
}): BlogEditorialRecommendation;
/**
 * Extends relevance-scoring.service.ts + human-review-policy.ts with
 * schema-validated AI enrichment, versioning and idempotency. See
 * docs/editorial-intelligence/editorial-triage-policy.md.
 */
export declare class EditorialTriageService {
    private readonly prisma;
    private readonly agentRuns;
    private readonly completeStructuredFn;
    private readonly llmGateway;
    private readonly now;
    constructor(dependencies?: EditorialTriageServiceDependencies);
    getEditorialTriage(triageRunId: string): Promise<BlogEditorialTriageRun | null>;
    triageEditorialCandidate(input: TriageEditorialCandidateInput): Promise<TriageEditorialCandidateResult>;
    private resolveCandidate;
    private isDuplicateCandidate;
    private deterministicAssessment;
    private allocateNextVersion;
    private findLatestComplete;
    private createTriageRunWithRetry;
    private runTriage;
}
export declare const editorialTriageService: EditorialTriageService;
export {};
//# sourceMappingURL=editorial-triage.service.d.ts.map