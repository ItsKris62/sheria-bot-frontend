import { prisma as defaultPrisma } from '@/lib/prisma/client';
/**
 * Shared, read-only publication-readiness evaluator (Pack 1 Stage C5). Never
 * mutates BlogPost or any other row. Consolidates the three existing inline
 * gate implementations (blog.router.ts::adminSetStatus,
 * content.service.ts::publishContent, blog-automation.router.ts::
 * adminGetLatestBlogVerification's own staleness computation) without yet
 * replacing any of them - see docs/editorial-intelligence/
 * publish-readiness-burn-in-runbook.md for the shadow-mode rollout this feeds.
 */
export interface PublishReadinessFinding {
    code: string;
    message: string;
}
export interface PublishReadinessResult {
    ready: boolean;
    blockers: PublishReadinessFinding[];
    warnings: PublishReadinessFinding[];
    evaluatedAt: Date;
    latestVerificationRunId?: string;
    isStale: boolean;
    isAiStale: boolean;
}
export type ReadinessPrisma = Pick<typeof defaultPrisma, 'blogPost' | 'contentOpsAlert'>;
export declare function evaluateBlogPublishReadiness(prisma: ReadinessPrisma, blogPostId: string): Promise<PublishReadinessResult>;
export interface PublishReadinessShadowCheckResult {
    mode: 'off' | 'shadow' | 'enforce';
    evaluated: boolean;
    result?: PublishReadinessResult;
    divergedFromLegacy?: boolean;
    /** Only ever true when mode === 'enforce' AND the evaluator found blockers - see the burn-in runbook for the cutover criteria before this is acted on anywhere. */
    shouldBlock: boolean;
}
/**
 * Runs the shared evaluator alongside an existing inline gate's own decision,
 * for burn-in comparison. Never throws - a bug in the new evaluator must
 * never break an existing publish path. Logs only BlogPost ID and finding
 * codes, never article content.
 */
export declare function runPublishReadinessShadowCheck(prisma: ReadinessPrisma, blogPostId: string, legacyReady: boolean, callSite: string): Promise<PublishReadinessShadowCheckResult>;
//# sourceMappingURL=publish-readiness.d.ts.map