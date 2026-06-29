import { BlogVerificationRunType } from '@prisma/client';
import type { prisma as appPrisma } from '@/lib/prisma/client';
type BlogAutomationPrisma = typeof appPrisma;
export declare function runBlogPostVerification({ prisma, blogPostId, requestedByUserId, runType, useAiReview, }: {
    prisma: BlogAutomationPrisma;
    blogPostId: string;
    requestedByUserId?: string;
    runType?: BlogVerificationRunType;
    useAiReview?: boolean;
}): Promise<{
    issues: {
        id: string;
        title: string;
        description: string;
        severity: import("@prisma/client").$Enums.BlogVerificationIssueSeverity;
        createdAt: Date;
        excerpt: string | null;
        claimText: string | null;
        sourceId: string | null;
        sourceUrl: string | null;
        runId: string;
        issueType: import("@prisma/client").$Enums.BlogVerificationIssueType;
        recommendation: string | null;
        paragraphIndex: number | null;
        sentenceIndex: number | null;
    }[];
} & {
    id: string;
    status: import("@prisma/client").$Enums.BlogVerificationStatus;
    createdAt: Date;
    updatedAt: Date;
    summary: string | null;
    errorMessage: string | null;
    completedAt: Date | null;
    startedAt: Date;
    blogPostId: string;
    draftGenerationRunId: string | null;
    runType: import("@prisma/client").$Enums.BlogVerificationRunType;
    qualityScore: number;
    sourceScore: number;
    claimRiskScore: number;
    jurisdictionScore: number;
    readinessScore: number;
    blockingIssueCount: number;
    warningIssueCount: number;
    infoIssueCount: number;
    recommendedAction: string | null;
    requestedById: string | null;
}>;
export {};
//# sourceMappingURL=blog-verification.service.d.ts.map