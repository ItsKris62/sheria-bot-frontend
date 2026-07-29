import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { createSuggestionFromSourceItem } from '@/modules/blog-automation/suggestion-builder';
import { createBlogDraftFromSuggestion } from '@/modules/blog-automation/draft-creation.service';
import { generateAiDraftForBlogPost } from '@/modules/blog-automation/ai-draft-generation.service';
import { type AgentRunService } from '@/modules/agents/agent-run.service';
import { type ContentOpsAlertService } from './content-ops-alert.service';
type FullPrisma = typeof defaultPrisma;
export interface CreateDraftFromCandidateInput {
    sourceItemId: string;
}
export type CreateDraftFromCandidateResult = {
    status: 'created';
    suggestionId: string;
    blogPostId: string;
    slug: string;
} | {
    status: 'below_threshold' | 'duplicate';
} | {
    status: 'human_review_required';
    suggestionId: string;
    reasons: string[];
};
export interface GenerateDraftContentInput {
    blogPostId: string;
    idempotencyKey: string;
}
export interface GenerateDraftContentResult {
    blogPostId: string;
    generationRunId: string;
    reviewerNotes: string;
    uncertaintyFlags: string[];
}
export interface AutomationBlogDraftServiceDependencies {
    prisma?: FullPrisma;
    createSuggestion?: typeof createSuggestionFromSourceItem;
    createDraft?: typeof createBlogDraftFromSuggestion;
    generateDraft?: typeof generateAiDraftForBlogPost;
    agentRuns?: AgentRunService;
    contentOpsAlert?: ContentOpsAlertService;
    now?: () => Date;
}
/**
 * Bridges W-CONTENT-01's queueContentCandidate handoff to the existing
 * blog-automation suggestion/draft pipeline (Gap 2). Delegates entirely to
 * createSuggestionFromSourceItem (scoring/classification, unmodified) and
 * createBlogDraftFromSuggestion (the same transactional block
 * adminCreateDraftFromSuggestion uses) - no new templating or scoring logic.
 *
 * Automation-originated suggestions skip the PENDING_REVIEW human
 * suggestion-review step and are promoted straight to APPROVED_FOR_DRAFT:
 * the meaningful human checkpoint for this pipeline is the later
 * AutomationApproval gate (createApproval / recordApprovalDecision)
 * reviewing the actual generated draft content, not a pre-draft suggestion
 * idea - requiring both would mean two human touchpoints per candidate
 * instead of one. BlogArticleSuggestion.requiresHumanReview defaults true
 * but is not read/enforced anywhere else in this codebase (confirmed via
 * full-tree grep), so this does not bypass an active control.
 *
 * Notification delivery for automation-originated events (HIGH/URGENT
 * suggestions, drafts ready for verification) goes through
 * ContentOpsAlertService - a fixed-address email
 * (appConfig.marketing.adminNotificationEmail), not the in-app
 * notificationModule keyed to a per-monitor createdById. Deliberately
 * decoupled from attribution: createdById/approvedById still record who
 * created/approved each row for audit, but the actual delivery target
 * doesn't depend on that id staying valid, so it keeps working if a source
 * monitor's creator account is ever deactivated or the monitor reassigned.
 */
export declare class AutomationBlogDraftService {
    private readonly prisma;
    private readonly createSuggestion;
    private readonly createDraft;
    private readonly generateDraft;
    private readonly agentRuns;
    private readonly contentOpsAlert;
    private readonly now;
    constructor(dependencies?: AutomationBlogDraftServiceDependencies);
    createDraftFromCandidate(input: CreateDraftFromCandidateInput, agentUserId: string): Promise<CreateDraftFromCandidateResult>;
    /**
     * Gap 1 (W-CONTENT-02 Phase B, Batch 2). Delegates directly to
     * generateAiDraftForBlogPost - the same function adminGenerateAiDraft
     * already calls - no new templating logic. Wraps it with the same
     * agentRunService.beginRun/completeRun/failRun idempotency primitive
     * automation.service.ts's own generate() uses, since
     * generateAiDraftForBlogPost has no idempotency guard of its own: a
     * caller-supplied idempotencyKey (required body field, not a header)
     * prevents a network retry / duplicate n8n delivery from triggering a
     * second real LLM call and silently re-overwriting the post's content a
     * second time.
     */
    generateDraftContent(input: GenerateDraftContentInput, agentUserId: string): Promise<GenerateDraftContentResult>;
    /**
     * A duplicate beginRun() result means an identical (blogPostId,
     * idempotencyKey) request already exists. Mirrors
     * AutomationService.resolveDuplicate's shape exactly: replay a completed
     * run's stashed result, reject anything else so a second generation is
     * never triggered for the same idempotency key.
     */
    private resolveDuplicateDraftGeneration;
}
export declare const automationBlogDraftService: AutomationBlogDraftService;
export {};
//# sourceMappingURL=blog-draft.service.d.ts.map