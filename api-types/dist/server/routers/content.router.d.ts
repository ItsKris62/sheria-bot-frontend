/**
 * Content Router
 *
 * Handles CRUD operations for blog posts, knowledge base articles,
 * and policy templates. Supports publishing workflows, versioning,
 * and engagement tracking.
 */
export declare const contentRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").Context;
    meta: object;
    errorShape: {
        message: string;
        data: {
            stack: string | undefined;
            fieldErrors: Record<string, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
        };
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /**
     * Create a new blog post or KB article
     *
     * @protected
     */
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            contentType: "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE";
            title: string;
            content: string;
            slug?: string | undefined;
            excerpt?: string | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            tags?: string[] | undefined;
            seoTitle?: string | undefined;
            seoDescription?: string | undefined;
            seoKeywords?: string[] | undefined;
            status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
        };
        output: {
            id: any;
            slug: any;
            contentType: any;
            contentStatus: any;
            title: any;
            createdAt: any;
        };
        meta: object;
    }>;
    /**
     * Update existing content
     *
     * @protected
     */
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            slug?: string | undefined;
            excerpt?: string | undefined;
            content?: string | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            tags?: string[] | undefined;
            seoTitle?: string | undefined;
            seoDescription?: string | undefined;
            seoKeywords?: string[] | undefined;
            status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
        };
        output: {
            id: any;
            slug: any;
            contentStatus: any;
            title: any;
            updatedAt: any;
        };
        meta: object;
    }>;
    /**
     * List published Knowledge Base articles for the public site.
     *
     * @public
     */
    listPublishedKnowledgeBase: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            search?: string | undefined;
            category?: string | undefined;
            tag?: string | undefined;
        };
        output: {
            items: {
                id: any;
                title: any;
                slug: any;
                excerpt: any;
                category: any;
                subcategory: any;
                tags: any;
                publishedAt: any;
                updatedAt: any;
                viewCount: any;
                readingTime: number;
                author: {
                    id: any;
                    name: any;
                    avatar: any;
                } | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: any;
                totalPages: number;
            };
        };
        meta: object;
    }>;
    /**
     * List content with filtering and pagination
     *
     * @protected
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            contentType?: "REGULATORY_DOCUMENT" | "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE" | undefined;
            status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "UNDER_REVIEW" | undefined;
            category?: string | undefined;
            tag?: string | undefined;
            search?: string | undefined;
            authorId?: string | undefined;
        };
        output: {
            items: any;
            pagination: {
                page: number;
                limit: number;
                total: any;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * Get content by ID
     *
     * @protected
     */
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    /**
     * Get published content by slug (public endpoint)
     */
    getBySlug: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            slug: string;
            contentType?: "KNOWLEDGE_BASE_ARTICLE" | undefined;
        };
        output: {
            id: any;
            contentType: any;
            title: any;
            slug: any;
            excerpt: any;
            htmlContent: any;
            content: any;
            category: any;
            subcategory: any;
            tags: any;
            seoTitle: any;
            seoDescription: any;
            seoKeywords: any;
            publishedAt: any;
            updatedAt: any;
            viewCount: any;
            helpfulCount: any;
            notHelpfulCount: any;
            author: any;
        };
        meta: object;
    }>;
    /**
     * Publish content
     *
     * @protected
     */
    publish: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: any;
            slug: any;
            contentStatus: any;
            publishedAt: any;
        };
        meta: object;
    }>;
    /**
     * Soft delete content
     *
     * @protected
     */
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Rate content as helpful or not helpful
     *
     * @protected
     */
    rate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            helpful: boolean;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=content.router.d.ts.map