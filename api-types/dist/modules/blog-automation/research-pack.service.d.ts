import { z } from 'zod';
import { BlogResearchPackStatus, type BlogResearchPack } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { completeStructured as defaultCompleteStructured } from '@/lib/ai/structured/completeStructured';
import type { CompleteStructuredDependencies } from '@/lib/ai/structured/completeStructured';
import { type ContentOpsAlertService } from '@/modules/agents/automation/content-ops-alert.service';
/**
 * Stage C7 - Research-pack generation and persistence (Pack 1 Phase C). Builds
 * durable, versioned research packs from EXISTING vetted sources only - never
 * fetches or scrapes anything new. See
 * docs/editorial-intelligence/research-pack-policy.md for the full
 * classification/hashing/versioning/alerting policy this file implements.
 */
export declare const RESEARCH_PACK_PROMPT_VERSION = "research-pack-v1";
export declare const RESEARCH_PACK_AGENT_TYPE = "research-pack";
export declare const ALERT_MIN_EVIDENCE_GAPS = 1;
export declare const ALERT_MIN_CONTRADICTIONS = 1;
export declare const ALERT_LOW_CONFIDENCE_THRESHOLD = 50;
export declare const MAX_IMPORTANT_DATES = 15;
export declare const MAX_AUTHORITIES = 15;
export declare const MAX_OBLIGATIONS = 25;
export declare const MAX_EVIDENCE_GAPS = 15;
export declare const MAX_CONTRADICTIONS = 10;
export declare const MAX_SOURCE_REFS_PER_OBLIGATION = 10;
export declare const MAX_SHORT_TEXT = 200;
export declare const MAX_MEDIUM_TEXT = 500;
export declare const MAX_SUMMARY_LENGTH = 3000;
export declare const MAX_SOURCE_REF_LENGTH = 20;
export declare const ResearchSynthesisSchema: z.ZodObject<{
    executiveSummary: z.ZodString;
    importantDates: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        date: z.ZodOptional<z.ZodString>;
        sourceRef: z.ZodString;
    }, z.core.$strip>>;
    authorities: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        role: z.ZodString;
        sourceRef: z.ZodString;
    }, z.core.$strip>>;
    obligations: z.ZodArray<z.ZodObject<{
        statement: z.ZodString;
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
        sourceRefs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    evidenceGaps: z.ZodArray<z.ZodString>;
    contradictions: z.ZodArray<z.ZodObject<{
        claim: z.ZodString;
        sourceRefA: z.ZodString;
        sourceRefB: z.ZodString;
        note: z.ZodString;
    }, z.core.$strip>>;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export type ResearchSynthesis = z.infer<typeof ResearchSynthesisSchema>;
export declare class ResearchPackValidationError extends Error {
    constructor(message: string);
}
export interface CreateResearchPackInput {
    blogPostId?: string;
    suggestionId?: string;
    idempotencyKey: string;
    researchObjective?: string;
    forceRegenerate?: boolean;
}
export type CreateResearchPackResult = {
    outcome: 'agents_disabled';
} | {
    outcome: 'budget_halted';
    agentRunId: string;
} | {
    outcome: 'completed';
    researchPackId: string;
    version: number;
    status: BlogResearchPackStatus;
    confidence: number;
    evidenceGapCount: number;
    replayed: boolean;
};
export type ResearchPackPrisma = Pick<typeof defaultPrisma, 'blogPost' | 'blogArticleSuggestion' | 'blogPostSource' | 'blogSuggestionSource' | 'blogResearchPack' | 'blogResearchPackSource'> & {
    $transaction: typeof defaultPrisma.$transaction;
};
type CompleteStructuredFn = typeof defaultCompleteStructured;
export interface ResearchPackServiceDependencies {
    prisma?: ResearchPackPrisma;
    agentRuns?: Pick<AgentRunService, 'beginRun' | 'advanceRun' | 'completeRun' | 'failRun'>;
    completeStructuredFn?: CompleteStructuredFn;
    llmGateway?: CompleteStructuredDependencies['llmGateway'];
    contentOpsAlert?: ContentOpsAlertService;
}
/**
 * Consolidates BlogPostSource/BlogSuggestionSource->BlogSourceItem provenance
 * into versioned BlogResearchPack + BlogResearchPackSource rows. Never fetches
 * a new URL - every source here already exists in the monitored/vetted
 * pipeline. See docs/editorial-intelligence/research-pack-policy.md.
 */
export declare class ResearchPackService {
    private readonly prisma;
    private readonly agentRuns;
    private readonly completeStructuredFn;
    private readonly llmGateway;
    private readonly contentOpsAlert;
    constructor(dependencies?: ResearchPackServiceDependencies);
    getResearchPack(input: {
        researchPackId?: string;
        blogPostId?: string;
    }): Promise<(BlogResearchPack & {
        sources: unknown[];
    }) | null>;
    createResearchPack(input: CreateResearchPackInput): Promise<CreateResearchPackResult>;
    private defaultObjective;
    private resolveTarget;
    private gatherNormalizedSources;
    private allocateNextVersion;
    private findLatestActive;
    private runResearch;
    private persistPack;
    /**
     * Attaches an already-created BlogPost to the active suggestion-keyed
     * research pack (a plain UPDATE, not a new version - the findings
     * themselves haven't changed). Not yet wired into any caller in this pass -
     * see docs/editorial-intelligence/research-pack-policy.md.
     */
    backfillBlogPostIdForSuggestion(suggestionId: string, blogPostId: string): Promise<BlogResearchPack | null>;
}
export declare const researchPackService: ResearchPackService;
export {};
//# sourceMappingURL=research-pack.service.d.ts.map