import { BlogSourceItem, BlogSourceMonitor, BlogSuggestionPriority, BlogArticleType, BlogSourceQuality } from '@prisma/client';
export type ScoringInput = BlogSourceItem & {
    monitor: BlogSourceMonitor;
};
export type ScoringResult = {
    relevanceScore: number;
    priority: BlogSuggestionPriority;
    category: string;
    articleType: BlogArticleType;
    sourceQuality: BlogSourceQuality;
    recommendedTitle: string;
    suggestedSlug: string;
    recommendedTags: string[];
    targetAudience: string[];
    reason: string;
    suggestedNextAction: string;
    requiresOfficialSource: boolean;
    needsMoreSources: boolean;
};
export declare function scoreSourceItemForBlogSuggestion(item: ScoringInput): ScoringResult;
//# sourceMappingURL=relevance-scoring.service.d.ts.map