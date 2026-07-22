import type { prisma as appPrisma } from '@/lib/prisma/client';
type BlogAutomationPrisma = typeof appPrisma;
export declare function createSuggestionFromSourceItem(params: {
    prisma: BlogAutomationPrisma;
    sourceItemId: string;
    minScore?: number;
    createdByUserId?: string;
}): Promise<{
    createdSuggestion: boolean;
    scoringResult: import("./relevance-scoring.service").ScoringResult;
    suggestion: null;
    reason?: undefined;
} | {
    createdSuggestion: boolean;
    scoringResult: import("./relevance-scoring.service").ScoringResult;
    suggestion: null;
    reason: string;
} | {
    createdSuggestion: boolean;
    scoringResult: import("./relevance-scoring.service").ScoringResult;
    suggestion: {
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.BlogSuggestionStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        targetAudience: string[];
        summary: string | null;
        category: string;
        priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
        jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
        reason: string | null;
        approvedAt: Date | null;
        dismissedReason: string | null;
        blogPostId: string | null;
        suggestedSlug: string | null;
        jurisdictions: import(".prisma/client").$Enums.BlogJurisdiction[];
        articleType: import(".prisma/client").$Enums.BlogArticleType;
        relevanceScore: number;
        sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
        recommendedTags: string[];
        suggestedNextAction: string | null;
        requiresOfficialSource: boolean;
        requiresHumanReview: boolean;
        needsMoreSources: boolean;
        dismissedAt: Date | null;
        dismissedById: string | null;
        approvedById: string | null;
    };
    reason?: undefined;
}>;
export {};
//# sourceMappingURL=suggestion-builder.d.ts.map