export declare function generateAiDraftForBlogPost(blogPostId: string, adminUserId: string): Promise<{
    post: {
        id: string;
        title: string;
        status: import(".prisma/client").$Enums.BlogPostStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string | null;
        authorId: string;
        category: string;
        excerpt: string | null;
        htmlContent: string | null;
        publishedAt: Date | null;
        seoDescription: string | null;
        seoTitle: string | null;
        slug: string;
        tags: string[];
        jurisdiction: string;
        archivedAt: Date | null;
        coverImageUrl: string | null;
        featured: boolean;
        relatedRegulations: string[];
        canonicalUrl: string | null;
        ogImageUrl: string | null;
        reviewerId: string | null;
        updatedById: string | null;
        lastReviewedAt: Date | null;
    };
    runId: string;
    reviewerNotes: string;
    uncertaintyFlags: string[];
}>;
//# sourceMappingURL=ai-draft-generation.service.d.ts.map