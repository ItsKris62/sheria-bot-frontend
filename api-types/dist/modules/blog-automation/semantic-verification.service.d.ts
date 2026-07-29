import { BlogClaimCategory, BlogClaimVerificationStatus, BlogVerificationIssueSeverity, BlogVerificationStatus } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { completeStructured as defaultCompleteStructured } from '@/lib/ai/structured/completeStructured';
import type { CompleteStructuredDependencies } from '@/lib/ai/structured/completeStructured';
import { type ContentOpsAlertService } from '@/modules/agents/automation/content-ops-alert.service';
import { runBlogPostVerification } from './blog-verification.service';
import { type VerificationEvidencePrisma } from './verification-evidence';
/**
 * Phase D Part 1 - semantic claim verification. EXTENDS the existing
 * runBlogPostVerification structural pass (called, never duplicated) with an
 * AI-assisted semantic layer that grounds every legal/factual claim against
 * research-pack (or BlogPostSource-fallback) evidence. See
 * docs/editorial-intelligence/semantic-verification-policy.md.
 */
export declare const SEMANTIC_VERIFICATION_AGENT_TYPE = "semantic-verification";
/**
 * Exhaustive over all 13 BlogClaimCategory values (10 high-stakes + 3
 * low-stakes here = 13). NUMERICAL_CLAIM/FACTUAL_EVENT are not named in
 * either bucket by phase-b-data-model.md §3's mapping table; they default to
 * high-stakes here (conservative) - a documented gap-fill, not a silent guess.
 */
export declare const HIGH_STAKES_CLAIM_CATEGORIES: readonly BlogClaimCategory[];
export declare const LOW_STAKES_CLAIM_CATEGORIES: readonly BlogClaimCategory[];
/**
 * The exact, code-authoritative severity mapping from
 * phase-b-data-model.md §3 - never taken from the model's own
 * severityOpinion field. Returns null for VERIFIED (no issue row).
 */
export declare function computeClaimSeverity(status: BlogClaimVerificationStatus, category: BlogClaimCategory): BlogVerificationIssueSeverity | null;
export declare class SemanticVerificationValidationError extends Error {
    constructor(message: string);
}
export interface RunSemanticVerificationInput {
    blogPostId: string;
    idempotencyKey: string;
    requestedByUserId?: string;
    /** Forces second-model review even for claims whose primary severity isn't BLOCKING. */
    requestSecondReview?: boolean;
}
export type RunSemanticVerificationResult = {
    outcome: 'agents_disabled';
} | {
    outcome: 'budget_halted';
    agentRunId: string;
} | {
    outcome: 'completed';
    verificationRunId: string;
    status: BlogVerificationStatus;
    blockingIssueCount: number;
    requiresHumanReview: boolean;
    replayed: boolean;
};
export type SemanticVerificationPrisma = VerificationEvidencePrisma & {
    blogPost: Pick<typeof defaultPrisma.blogPost, 'findUnique'>;
    blogVerificationRun: Pick<typeof defaultPrisma.blogVerificationRun, 'findFirst' | 'update'>;
    blogVerificationIssue: Pick<typeof defaultPrisma.blogVerificationIssue, 'createMany'>;
    blogArticleSuggestion: Pick<typeof defaultPrisma.blogArticleSuggestion, 'update'>;
};
type CompleteStructuredFn = typeof defaultCompleteStructured;
export interface SemanticVerificationServiceDependencies {
    prisma?: SemanticVerificationPrisma;
    agentRuns?: Pick<AgentRunService, 'beginRun' | 'advanceRun' | 'completeRun' | 'failRun'>;
    completeStructuredFn?: CompleteStructuredFn;
    llmGateway?: CompleteStructuredDependencies['llmGateway'];
    contentOpsAlert?: ContentOpsAlertService;
    runStructuralVerification?: typeof runBlogPostVerification;
}
export declare class SemanticVerificationService {
    private readonly prisma;
    private readonly agentRuns;
    private readonly completeStructuredFn;
    private readonly llmGateway;
    private readonly contentOpsAlert;
    private readonly runStructuralVerification;
    constructor(dependencies?: SemanticVerificationServiceDependencies);
    runSemanticVerification(input: RunSemanticVerificationInput): Promise<RunSemanticVerificationResult>;
    private findLatestReusable;
    private runVerification;
    private buildIssueRows;
}
export declare const semanticVerificationService: SemanticVerificationService;
export {};
//# sourceMappingURL=semantic-verification.service.d.ts.map