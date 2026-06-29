import { BlogPost, BlogDraftGenerationRun, BlogVerificationRun, BlogPostSource } from '@prisma/client';
type BlogPostWithRelations = BlogPost & {
    sources: BlogPostSource[];
    draftGenerationRuns: BlogDraftGenerationRun[];
    verificationRuns: BlogVerificationRun[];
};
export declare function calculateBlogStaleness(post: BlogPostWithRelations): {
    isStale: boolean;
    isAiStale: boolean;
};
export {};
//# sourceMappingURL=blog-staleness.d.ts.map