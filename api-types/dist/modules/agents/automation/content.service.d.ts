import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type AutomationApprovalService } from './approval.service';
type ContentPrisma = Pick<typeof defaultPrisma, 'blogPost' | 'blogSourceItem' | 'regulatorySignal'>;
export interface PublishContentInput {
    approvalId: string;
    content: string;
}
export interface QueueContentCandidateInput {
    sourceItemId: string;
    title: string;
    score: number;
    jurisdiction: string;
}
export interface GetRecentHighImpactRegulatoryItemsInput {
    window: string;
    jurisdictions: string;
}
export interface GetApprovedContentThisWeekInput {
    jurisdictions: string;
}
export interface RegulatoryItem {
    id: string;
    title: string;
    score: number;
    jurisdiction: string;
    summary?: string;
}
export interface ApprovedContentItem {
    id: string;
    title: string;
    jurisdiction: string;
    publishedAt: string;
}
type FetchLike = typeof fetch;
export interface AutomationContentServiceDependencies {
    prisma?: ContentPrisma;
    approvalService?: AutomationApprovalService;
    fetchImpl?: FetchLike;
    now?: () => Date;
}
export declare class AutomationContentService {
    private readonly prisma;
    private readonly approvalService;
    private readonly fetchImpl;
    private readonly now;
    constructor(dependencies?: AutomationContentServiceDependencies);
    /**
     * approval.metadata carries { blogPostId } (createApproval's own caller sets
     * this) - publishContent itself only receives {approvalId, content} per the
     * n8n wire contract, so the BlogPost link has to travel through metadata,
     * the same pattern used for every other "approval gates a pre-existing
     * backend row" case in this module. Applies input.content as the post's
     * final body, then runs the exact same publish gates as blog.router.ts's
     * adminSetStatus('PUBLISHED') (title/slug/excerpt/category present, >=1
     * source, category-specific source-type rule, verification not BLOCKED/stale)
     * - duplicated here rather than calling into blog.router.ts directly, since
     * that logic lives inline in the router, not a separately exported service.
     */
    publishContent(input: PublishContentInput): Promise<{
        blogPostId: string;
        publishedAt: string;
    }>;
    /**
     * No new persistence layer added for the "candidate queue" itself - the
     * brief describes this procedure's job as fanning the candidate out to n8n,
     * and no read-back procedure for queued candidates exists anywhere else in
     * the brief, so a DB table here would have no consumer. Logged (Pino,
     * type field) and forwarded; if a durable queue is wanted later, that's a
     * new requirement, not an oversight in this pass.
     */
    queueContentCandidate(input: QueueContentCandidateInput): Promise<{
        forwarded: boolean;
    }>;
    getRecentHighImpactRegulatoryItems(input: GetRecentHighImpactRegulatoryItemsInput): Promise<{
        items: RegulatoryItem[];
    }>;
    /**
     * "This week" implemented as a rolling 7-day window (matches Phase 1's
     * BASELINE_WINDOW_DAYS convention), not a calendar ISO week - simpler and
     * avoids a Monday-boundary edge case for a shape the brief left otherwise
     * unspecified (`output: { items: [...] }` gave no field list - this shape
     * is a best-effort guess, flagged for review).
     */
    getApprovedContentThisWeek(input: GetApprovedContentThisWeekInput): Promise<{
        items: ApprovedContentItem[];
    }>;
}
export declare const automationContentService: AutomationContentService;
export {};
//# sourceMappingURL=content.service.d.ts.map