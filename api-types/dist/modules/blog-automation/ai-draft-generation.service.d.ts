/**
 * notifyUserId defaults to adminUserId (identical to prior behavior for the
 * existing admin-dashboard caller, adminGenerateAiDraft, which never passes
 * a third argument). Automation-originated callers pass a real human
 * reviewer id separately from the FK-attribution id (adminUserId) they use,
 * since adminUserId for an automation call is the sys-automation-orchestrator
 * service principal - notifying that id directly would never reach a human.
 */
export declare function generateAiDraftForBlogPost(blogPostId: string, adminUserId: string, notifyUserId?: string): Promise<{
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