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
            contentType: "BLOG_POST" | "KNOWLEDGE_BASE_ARTICLE" | "POLICY_TEMPLATE";
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
            id: string;
            slug: string | null;
            contentType: import("@prisma/client").$Enums.ContentType;
            contentStatus: import("@prisma/client").$Enums.ContentStatus;
            title: string | null;
            createdAt: Date;
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
            id: string;
            slug: string | null;
            contentStatus: import("@prisma/client").$Enums.ContentStatus;
            title: string | null;
            updatedAt: Date;
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
            items: {
                id: string;
                title: string | null;
                createdAt: Date;
                updatedAt: Date;
                version: number;
                authorId: string | null;
                category: string | null;
                contentStatus: import("@prisma/client").$Enums.ContentStatus;
                contentType: import("@prisma/client").$Enums.ContentType;
                excerpt: string | null;
                helpfulCount: number;
                publishedAt: Date | null;
                slug: string | null;
                subcategory: string | null;
                tags: string[];
                viewCount: number;
                author: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                } | null;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
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
        output: {
            publisher: {
                id: string;
                fullName: string;
            } | null;
            author: {
                id: string;
                fullName: string;
                avatar: string | null;
            } | null;
        } & {
            id: string;
            title: string | null;
            userId: string | null;
            status: import("@prisma/client").$Enums.DocumentStatus;
            organizationId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            content: string | null;
            isLatestVersion: boolean;
            parentId: string | null;
            version: number;
            actName: string;
            documentType: string;
            enactmentDate: Date | null;
            effectiveDate: Date | null;
            amendedBy: string[];
            regulatoryBody: string | null;
            originalFilename: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            totalChunks: number | null;
            processedAt: Date | null;
            fullText: string | null;
            summary: string | null;
            keywords: string[];
            authorId: string | null;
            category: string | null;
            contentStatus: import("@prisma/client").$Enums.ContentStatus;
            contentType: import("@prisma/client").$Enums.ContentType;
            excerpt: string | null;
            helpfulCount: number;
            htmlContent: string | null;
            notHelpfulCount: number;
            publishedAt: Date | null;
            publishedBy: string | null;
            seoDescription: string | null;
            seoKeywords: string[];
            seoTitle: string | null;
            slug: string | null;
            subcategory: string | null;
            tags: string[];
            viewCount: number;
        };
        meta: object;
    }>;
    /**
     * Get published content by slug (public endpoint)
     */
    getBySlug: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            slug: string;
        };
        output: {
            id: string;
            contentType: import("@prisma/client").$Enums.ContentType;
            title: string | null;
            slug: string | null;
            excerpt: string | null;
            htmlContent: string | null;
            content: string | null;
            category: string | null;
            subcategory: string | null;
            tags: string[];
            seoTitle: string | null;
            seoDescription: string | null;
            seoKeywords: string[];
            publishedAt: Date | null;
            viewCount: number;
            helpfulCount: number;
            notHelpfulCount: number;
            author: {
                id: string;
                fullName: string;
                avatar: string | null;
            } | null;
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
            id: string;
            slug: string | null;
            contentStatus: import("@prisma/client").$Enums.ContentStatus;
            publishedAt: Date | null;
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