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
            automationSuggestion: ({
                sources: ({
                    sourceItem: {
                        monitor: {
                            id: string;
                            description: string | null;
                            status: import("@prisma/client").$Enums.BlogMonitorStatus;
                            createdAt: Date;
                            updatedAt: Date;
                            deletedAt: Date | null;
                            name: string;
                            verificationStatus: string;
                            verifiedAt: Date | null;
                            keywords: string[];
                            notes: string | null;
                            isActive: boolean;
                            jurisdiction: import("@prisma/client").$Enums.BlogJurisdiction;
                            authorityType: import("@prisma/client").$Enums.BlogAuthorityType;
                            baseUrl: string;
                            createdById: string | null;
                            sourceType: import("@prisma/client").$Enums.BlogSourceType;
                            updatedById: string | null;
                            countryLabel: string | null;
                            monitoringMethod: import("@prisma/client").$Enums.BlogMonitoringMethod;
                            feedUrl: string | null;
                            topics: string[];
                            lastRunStatus: import("@prisma/client").$Enums.BlogMonitorLastRunStatus;
                            isOfficial: boolean;
                            lastCheckedAt: Date | null;
                            lastSuccessfulRunAt: Date | null;
                            lastFailureAt: Date | null;
                            failureCount: number;
                            lastFailureReason: string | null;
                            maxItemsPerRun: number;
                            fetchTimeoutMs: number;
                            respectRobots: boolean;
                            verifiedById: string | null;
                        };
                    } & {
                        id: string;
                        title: string;
                        url: string;
                        status: import("@prisma/client").$Enums.BlogSourceItemStatus;
                        createdAt: Date;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        summary: string | null;
                        failureReason: string | null;
                        jurisdiction: import("@prisma/client").$Enums.BlogJurisdiction;
                        publicationDate: Date | null;
                        contentHash: string;
                        authorityType: import("@prisma/client").$Enums.BlogAuthorityType;
                        sourceType: import("@prisma/client").$Enums.BlogSourceType;
                        publisher: string | null;
                        monitorId: string;
                        normalizedUrl: string;
                        discoveredAt: Date;
                        rawContentHash: string | null;
                        dismissedReason: string | null;
                    };
                } & {
                    createdAt: Date;
                    suggestionId: string;
                    sourceItemId: string;
                })[];
            } & {
                id: string;
                title: string;
                status: import("@prisma/client").$Enums.BlogSuggestionStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                targetAudience: string[];
                summary: string | null;
                category: string;
                priority: import("@prisma/client").$Enums.BlogSuggestionPriority;
                jurisdiction: import("@prisma/client").$Enums.BlogJurisdiction;
                reason: string | null;
                approvedAt: Date | null;
                dismissedReason: string | null;
                blogPostId: string | null;
                suggestedSlug: string | null;
                jurisdictions: import("@prisma/client").$Enums.BlogJurisdiction[];
                articleType: import("@prisma/client").$Enums.BlogArticleType;
                relevanceScore: number;
                sourceQuality: import("@prisma/client").$Enums.BlogSourceQuality;
                recommendedTags: string[];
                suggestedNextAction: string | null;
                requiresOfficialSource: boolean;
                requiresHumanReview: boolean;
                needsMoreSources: boolean;
                dismissedAt: Date | null;
                dismissedById: string | null;
                approvedById: string | null;
            }) | null;
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