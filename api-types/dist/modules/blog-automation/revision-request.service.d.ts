import type { BlogRevisionPriority, BlogRevisionRequest, BlogRevisionStatus, Prisma } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
/**
 * Phase D Part 3 - durable editorial revision tasks. Pure persistence, no AI
 * call, no AgentRun. See docs/editorial-intelligence/freshness-and-revision-policy.md.
 *
 * Idempotency is always caller-supplied - never a server-synthesized key
 * (the original design's `<blogPostId>:manual` fallback silently collapsed
 * every manual revision request for a post into one shared bucket; corrected
 * per phase-b-data-model.md §5). A duplicate insert is handled through the
 * `idempotencyKey` unique constraint (insert-then-catch-P2002), the same
 * pattern AutomationApprovalService.createApproval already uses.
 */
export declare class RevisionRequestValidationError extends Error {
    constructor(message: string);
}
export interface CreateRevisionRequestInput {
    blogPostId: string;
    freshnessReviewId?: string;
    reason: string;
    priority: BlogRevisionPriority;
    recommendedChanges?: Prisma.InputJsonValue;
    evidence?: Prisma.InputJsonValue;
    /** Required, caller-supplied. Never synthesized here. */
    idempotencyKey: string;
    /** Set only when a human filed this directly; absent for system/freshness-originated requests. */
    requestedById?: string;
}
export interface CreateRevisionRequestResult {
    revisionRequestId: string;
    status: BlogRevisionStatus;
    replayed: boolean;
}
export type RevisionRequestPrisma = {
    blogPost: Pick<typeof defaultPrisma.blogPost, 'findUnique'>;
    blogFreshnessReview: Pick<typeof defaultPrisma.blogFreshnessReview, 'findUnique'>;
    blogRevisionRequest: Pick<typeof defaultPrisma.blogRevisionRequest, 'create' | 'findUnique'>;
};
export interface RevisionRequestServiceDependencies {
    prisma?: RevisionRequestPrisma;
}
/** Derives the internal, deterministic key runFreshnessReview uses - safe because freshnessReviewId is always a real, unique id in this path. */
export declare function deriveFreshnessOriginatedIdempotencyKey(blogPostId: string, freshnessReviewId: string): string;
export declare class RevisionRequestService {
    private readonly prisma;
    constructor(dependencies?: RevisionRequestServiceDependencies);
    createRevisionRequest(input: CreateRevisionRequestInput): Promise<CreateRevisionRequestResult>;
}
export declare const revisionRequestService: RevisionRequestService;
export type { BlogRevisionRequest };
//# sourceMappingURL=revision-request.service.d.ts.map