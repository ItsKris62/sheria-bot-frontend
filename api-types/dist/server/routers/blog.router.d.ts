export declare const blogRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    publicList: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            category?: string | undefined;
            search?: string | undefined;
            tag?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
            featured?: boolean | undefined;
        };
        output: {
            posts: {
                readingTime: number;
                sourceCount: number;
                id: string;
                title: string;
                updatedAt: Date;
                category: string;
                excerpt: string | null;
                publishedAt: Date | null;
                slug: string;
                tags: string[];
                coverImageUrl: string | null;
                featured: boolean;
                lastReviewedAt: Date | null;
                author: {
                    id: string;
                    fullName: string;
                };
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
    publicGetBySlug: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            slug: string;
        };
        output: {
            readingTime: number;
            author: {
                id: string;
                fullName: string;
            };
            sources: {
                id: string;
                title: string;
                url: string | null;
                createdAt: Date;
                updatedAt: Date;
                publishedAt: Date | null;
                notes: string | null;
                sourceType: import("@prisma/client").$Enums.BlogSourceType;
                postId: string;
                publisher: string | null;
                accessedAt: Date;
            }[];
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.BlogPostStatus;
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
        meta: object;
    }>;
    getFeatured: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
        };
        output: {
            readingTime: number;
            sourceCount: number;
            id: string;
            title: string;
            updatedAt: Date;
            category: string;
            excerpt: string | null;
            publishedAt: Date | null;
            slug: string;
            tags: string[];
            coverImageUrl: string | null;
            featured: boolean;
            lastReviewedAt: Date | null;
            author: {
                id: string;
                fullName: string;
            };
        }[];
        meta: object;
    }>;
    publicSlugs: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            updatedAt: Date;
            publishedAt: Date | null;
            slug: string;
        }[];
        meta: object;
    }>;
    adminList: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "IN_REVIEW" | undefined;
            category?: string | undefined;
            search?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            posts: {
                sourceCount: number;
                _count: {
                    sources: number;
                };
                author: {
                    id: string;
                    fullName: string;
                };
                reviewer: {
                    id: string;
                    fullName: string;
                } | null;
                id: string;
                title: string;
                status: import("@prisma/client").$Enums.BlogPostStatus;
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
    adminGetById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            sources: {
                id: string;
                title: string;
                url: string | null;
                createdAt: Date;
                updatedAt: Date;
                publishedAt: Date | null;
                notes: string | null;
                sourceType: import("@prisma/client").$Enums.BlogSourceType;
                postId: string;
                publisher: string | null;
                accessedAt: Date;
            }[];
        } & {
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.BlogPostStatus;
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
        meta: object;
    }>;
    adminCreate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            slug?: string | undefined;
            excerpt?: string | undefined;
            category?: string | undefined;
        };
        output: {
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.BlogPostStatus;
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
        meta: object;
    }>;
    adminUpdate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            slug?: string | undefined;
            excerpt?: string | null | undefined;
            content?: string | null | undefined;
            coverImageUrl?: string | null | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            jurisdiction?: string | undefined;
            relatedRegulations?: string[] | undefined;
            featured?: boolean | undefined;
            seoTitle?: string | null | undefined;
            seoDescription?: string | null | undefined;
            canonicalUrl?: string | null | undefined;
            ogImageUrl?: string | null | undefined;
            reviewerId?: string | null | undefined;
            sources?: {
                sourceType: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA";
                title: string;
                id?: string | undefined;
                publisher?: string | null | undefined;
                url?: string | null | undefined;
                publishedAt?: Date | null | undefined;
                notes?: string | null | undefined;
            }[] | undefined;
        };
        output: {
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.BlogPostStatus;
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
        meta: object;
    }>;
    adminSetStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status: "DRAFT" | "ARCHIVED" | "PUBLISHED" | "IN_REVIEW";
        };
        output: {
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.BlogPostStatus;
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
        meta: object;
    }>;
    adminDelete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.BlogPostStatus;
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
        meta: object;
    }>;
}>>;
//# sourceMappingURL=blog.router.d.ts.map