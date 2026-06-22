import { BlogArticleType, BlogJurisdiction } from '@prisma/client';
export declare function buildDraftSkeletonFromSuggestion(input: {
    title: string;
    jurisdiction: BlogJurisdiction;
    category: string;
    articleType: BlogArticleType;
    summary?: string | null;
    sourceTitles: string[];
    sourceUrls: string[];
    targetAudience: string[];
    recommendedTags: string[];
}): string;
//# sourceMappingURL=draft-skeleton.service.d.ts.map