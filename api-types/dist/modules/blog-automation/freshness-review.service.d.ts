import { BlogFreshnessAction, BlogFreshnessRiskTier, type BlogPost, type BlogPostSource } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { completeStructured as defaultCompleteStructured } from '@/lib/ai/structured/completeStructured';
import type { CompleteStructuredDependencies } from '@/lib/ai/structured/completeStructured';
import { type ContentOpsAlertService } from '@/modules/agents/automation/content-ops-alert.service';
import { type RevisionRequestService } from './revision-request.service';
/**
 * Phase D Part 2 - proactive freshness review for published content. See
 * docs/editorial-intelligence/freshness-and-revision-policy.md for the full
 * cadence/evidence-guardrail/idempotency policy this file implements.
 *
 * Simplification disclosed here and in the policy doc: "new linked
 * RegulatorySignal" detection uses jurisdiction-string matching
 * (BlogPost.jurisdiction vs RegulatorySignal.jurisdiction, normalized)
 * rather than an exact FK-chain match, since BlogPost carries no direct FK to
 * BlogSourceItem/RegulatorySignal. This uses only already-stored data (no new
 * fetch), consistent with the "no new web-fetch" rule, but is a coarser
 * signal than an exact chain match would be - see the policy doc.
 */
export declare const FRESHNESS_REVIEW_AGENT_TYPE = "freshness-review";
export declare const HIGH_RISK_CADENCE_DAYS = 30;
export declare const NORMAL_CADENCE_DAYS = 90;
export declare const EVERGREEN_CADENCE_DAYS = 180;
export declare const SOURCE_STALENESS_THRESHOLD_DAYS = 730;
export declare function determineRiskTier(post: Pick<BlogPost, 'category'>, sources: readonly Pick<BlogPostSource, 'sourceType'>[], suggestionArticleType?: string | null): BlogFreshnessRiskTier;
export declare function cadenceDaysFor(tier: BlogFreshnessRiskTier): number;
export declare function computeNextReviewAt(lastReviewedAt: Date | null, publishedAt: Date | null, tier: BlogFreshnessRiskTier, now: Date): Date;
export declare class FreshnessReviewValidationError extends Error {
    constructor(message: string);
}
/** Raised when the AI's non-FRESH action lacks required evidence, or its rationale doesn't cite any - a safety invariant, never silently downgraded. */
export declare class FreshnessEvidenceGuardrailError extends Error {
    constructor(message: string);
}
export interface RunFreshnessReviewInput {
    blogPostId: string;
    idempotencyKey: string;
    triggeredBy?: 'SCHEDULE' | 'SIGNAL' | 'MANUAL';
}
export type RunFreshnessReviewResult = {
    outcome: 'agents_disabled';
} | {
    outcome: 'budget_halted';
    agentRunId: string;
} | {
    outcome: 'completed';
    freshnessReviewId: string;
    action: BlogFreshnessAction;
    freshnessScore: number;
    revisionRequestId?: string;
    replayed: boolean;
};
export interface FreshnessCandidate {
    blogPostId: string;
    riskTier: BlogFreshnessRiskTier;
    reason: 'SCHEDULED' | 'SIGNAL_TRIGGERED';
    nextReviewAt: Date | null;
}
export type FreshnessReviewPrisma = {
    blogPost: Pick<typeof defaultPrisma.blogPost, 'findUnique' | 'findMany'>;
    blogFreshnessReview: Pick<typeof defaultPrisma.blogFreshnessReview, 'findFirst' | 'create'>;
    regulatorySignal: Pick<typeof defaultPrisma.regulatorySignal, 'findMany'>;
    blogResearchPack: Pick<typeof defaultPrisma.blogResearchPack, 'findFirst'>;
};
type CompleteStructuredFn = typeof defaultCompleteStructured;
export interface FreshnessReviewServiceDependencies {
    prisma?: FreshnessReviewPrisma;
    agentRuns?: Pick<AgentRunService, 'beginRun' | 'completeRun' | 'failRun'>;
    completeStructuredFn?: CompleteStructuredFn;
    llmGateway?: CompleteStructuredDependencies['llmGateway'];
    contentOpsAlert?: ContentOpsAlertService;
    revisionRequests?: Pick<RevisionRequestService, 'createRevisionRequest'>;
    now?: () => Date;
}
export declare class FreshnessReviewService {
    private readonly prisma;
    private readonly agentRuns;
    private readonly completeStructuredFn;
    private readonly llmGateway;
    private readonly contentOpsAlert;
    private readonly revisionRequests;
    private readonly now;
    constructor(dependencies?: FreshnessReviewServiceDependencies);
    selectFreshnessCandidates(maxItems: number): Promise<FreshnessCandidate[]>;
    private jurisdictionCodesFor;
    runFreshnessReview(input: RunFreshnessReviewInput): Promise<RunFreshnessReviewResult>;
    private runReview;
    private assertEvidenceGuardrail;
}
export declare const freshnessReviewService: FreshnessReviewService;
export {};
//# sourceMappingURL=freshness-review.service.d.ts.map