export declare const blogAutomationRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    adminListMonitors: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
            authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
            sourceType?: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | undefined;
            monitoringMethod?: "MANUAL" | "RSS" | "HTML_LISTING" | "API" | undefined;
            status?: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING" | undefined;
            isActive?: boolean | undefined;
            search?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminGetMonitor: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminCreateMonitor: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            jurisdiction: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL";
            authorityType: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY";
            sourceType: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA";
            baseUrl: string;
            description?: string | null | undefined;
            countryLabel?: string | null | undefined;
            monitoringMethod?: "MANUAL" | "RSS" | "HTML_LISTING" | "API" | undefined;
            feedUrl?: string | null | undefined;
            topics?: string[] | undefined;
            keywords?: string[] | undefined;
            status?: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING" | undefined;
            isActive?: boolean | undefined;
            maxItemsPerRun?: number | undefined;
            fetchTimeoutMs?: number | undefined;
            respectRobots?: boolean | undefined;
            notes?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminUpdateMonitor: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
            countryLabel?: string | null | undefined;
            authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
            sourceType?: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | undefined;
            monitoringMethod?: "MANUAL" | "RSS" | "HTML_LISTING" | "API" | undefined;
            baseUrl?: string | undefined;
            feedUrl?: string | null | undefined;
            topics?: string[] | undefined;
            keywords?: string[] | undefined;
            maxItemsPerRun?: number | undefined;
            fetchTimeoutMs?: number | undefined;
            respectRobots?: boolean | undefined;
            notes?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminSetMonitorStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING";
            isActive?: boolean | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminVerifyMonitor: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            notes?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminDeleteMonitor: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminListSourceItems: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            monitorId?: string | undefined;
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
            authorityType?: "OTHER" | "DATA_PROTECTION" | "AML_CFT" | "INTERNATIONAL_STANDARD" | "CONSUMER_PROTECTION" | "INTERNAL" | "CENTRAL_BANK" | "COMMUNICATIONS" | "SECURITIES" | "COMPETITION" | "GAZETTE" | "LEGAL_DATABASE" | "DEVELOPMENT_FINANCE" | "INDUSTRY_BODY" | undefined;
            sourceType?: "INTERNATIONAL_STANDARD" | "OFFICIAL" | "THIRD_PARTY" | "INTERNAL" | "MEDIA" | undefined;
            status?: "DUPLICATE" | "NEW" | "READY_FOR_SCORING" | "SCORED" | "DISMISSED" | "FETCH_FAILED" | "CONVERTED_TO_SUGGESTION" | undefined;
            search?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminGetSourceItem: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminDismissSourceItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: any;
        meta: object;
    }>;
    adminRunMonitorNow: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            monitorId: string;
        };
        output: any;
        meta: object;
    }>;
    adminListDiscoveryRuns: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            monitorId?: string | undefined;
            status?: "FAILED" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "SKIPPED_LOCKED" | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminScoreSourceItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            sourceItemId: string;
            minScore?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminScoreEligibleSourceItems: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            minScore?: number | undefined;
            limit?: number | undefined;
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
            monitorId?: string | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminListSuggestions: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "DUPLICATE" | "DISMISSED" | "PENDING_REVIEW" | "APPROVED_FOR_DRAFT" | "DRAFT_CREATED" | "NEEDS_MORE_SOURCES" | undefined;
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
            jurisdiction?: "KE" | "MW" | "RW" | "NG" | "REGIONAL" | "GLOBAL" | undefined;
            category?: string | undefined;
            articleType?: "SINGLE_JURISDICTION_UPDATE" | "COUNTRY_SPECIFIC_GUIDE" | "CROSS_COUNTRY_COMPARISON" | "REGIONAL_TREND_ANALYSIS" | "EVERGREEN_EXPLAINER" | "PRODUCT_EDUCATION" | undefined;
            search?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminGetSuggestion: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminDismissSuggestion: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: any;
        meta: object;
    }>;
    adminApproveSuggestionForDraft: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminMarkSuggestionNeedsMoreSources: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason?: string | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminDeleteSuggestion: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminCreateDraftFromSuggestion: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            suggestionId: string;
        };
        output: any;
        meta: object;
    }>;
    adminGenerateAiDraft: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            blogPostId: string;
        };
        output: any;
        meta: object;
    }>;
    adminRunBlogVerification: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            blogPostId: string;
            runType?: "SYSTEM" | "MANUAL" | "PRE_PUBLISH" | undefined;
            useAiReview?: boolean | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminListBlogVerificationRuns: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            blogPostId?: string | undefined;
            status?: "FAILED" | "PENDING" | "RUNNING" | "PASSED" | "NEEDS_REVIEW" | "BLOCKED" | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminGetBlogVerificationRun: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminGetLatestBlogVerification: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            blogPostId: string;
        };
        output: any;
        meta: object;
    }>;
    adminListEditorialTriageRuns: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            runs: ({
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
                } | null;
                sourceItem: {
                    id: string;
                    title: string;
                    url: string;
                    status: import(".prisma/client").$Enums.BlogSourceItemStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    summary: string | null;
                    failureReason: string | null;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    publicationDate: Date | null;
                    contentHash: string;
                    authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                    sourceType: import(".prisma/client").$Enums.BlogSourceType;
                    publisher: string | null;
                    monitorId: string;
                    normalizedUrl: string;
                    discoveredAt: Date;
                    rawContentHash: string | null;
                    dismissedReason: string | null;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                createdAt: Date;
                urgency: import(".prisma/client").$Enums.BlogSuggestionPriority;
                version: number;
                errorMessage: string | null;
                completedAt: Date | null;
                promptVersion: string;
                recommendation: import(".prisma/client").$Enums.BlogEditorialRecommendation;
                requiresHumanReview: boolean;
                suggestionId: string | null;
                sourceItemId: string | null;
                agentRunId: string | null;
                deterministicScore: number;
                aiRelevanceScore: number | null;
                finalScore: number;
                targetAudiences: string[];
                recommendedArticleType: import(".prisma/client").$Enums.BlogArticleType | null;
                recommendedChannels: string[];
                rationale: string;
                sourceConfidence: number;
                modelProvider: string | null;
                modelName: string | null;
                inputHash: string;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    adminGetEditorialTriageRun: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
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
            } | null;
            sourceItem: {
                id: string;
                title: string;
                url: string;
                status: import(".prisma/client").$Enums.BlogSourceItemStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                summary: string | null;
                failureReason: string | null;
                jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                publicationDate: Date | null;
                contentHash: string;
                authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                sourceType: import(".prisma/client").$Enums.BlogSourceType;
                publisher: string | null;
                monitorId: string;
                normalizedUrl: string;
                discoveredAt: Date;
                rawContentHash: string | null;
                dismissedReason: string | null;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
            createdAt: Date;
            urgency: import(".prisma/client").$Enums.BlogSuggestionPriority;
            version: number;
            errorMessage: string | null;
            completedAt: Date | null;
            promptVersion: string;
            recommendation: import(".prisma/client").$Enums.BlogEditorialRecommendation;
            requiresHumanReview: boolean;
            suggestionId: string | null;
            sourceItemId: string | null;
            agentRunId: string | null;
            deterministicScore: number;
            aiRelevanceScore: number | null;
            finalScore: number;
            targetAudiences: string[];
            recommendedArticleType: import(".prisma/client").$Enums.BlogArticleType | null;
            recommendedChannels: string[];
            rationale: string;
            sourceConfidence: number;
            modelProvider: string | null;
            modelName: string | null;
            inputHash: string;
        };
        meta: object;
    }>;
    adminListResearchPackVersions: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            blogPostId?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            packs: ({
                blogPost: {
                    id: string;
                    title: string;
                } | null;
                reviewedBy: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogResearchPackStatus;
                createdAt: Date;
                executiveSummary: string | null;
                version: number;
                confidence: number;
                reviewedAt: Date | null;
                reviewedById: string | null;
                blogPostId: string | null;
                sourceSetHash: string;
                promptVersion: string;
                suggestionId: string | null;
                modelProvider: string | null;
                modelName: string | null;
                inputHash: string;
                researchObjective: string;
                importantDates: import("@prisma/client/runtime/client").JsonValue | null;
                authorities: import("@prisma/client/runtime/client").JsonValue | null;
                obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
                evidenceGaps: string[];
                contradictions: import("@prisma/client/runtime/client").JsonValue | null;
                reviewerStatus: string | null;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    adminGetResearchPack: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            blogPost: {
                id: string;
                title: string;
            } | null;
            reviewedBy: {
                id: string;
                fullName: string;
            } | null;
            sources: {
                id: string;
                title: string;
                createdAt: Date;
                category: import(".prisma/client").$Enums.BlogResearchSourceCategory;
                jurisdiction: string | null;
                publicationDate: Date | null;
                contentHash: string | null;
                publisher: string | null;
                sourceItemId: string | null;
                researchPackId: string;
                postSourceId: string | null;
                externalUrl: string | null;
                authority: string | null;
                retrievalDate: Date;
                trustLevel: number;
                isAvailable: boolean;
                isContradictory: boolean;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.BlogResearchPackStatus;
            createdAt: Date;
            executiveSummary: string | null;
            version: number;
            confidence: number;
            reviewedAt: Date | null;
            reviewedById: string | null;
            blogPostId: string | null;
            sourceSetHash: string;
            promptVersion: string;
            suggestionId: string | null;
            modelProvider: string | null;
            modelName: string | null;
            inputHash: string;
            researchObjective: string;
            importantDates: import("@prisma/client/runtime/client").JsonValue | null;
            authorities: import("@prisma/client/runtime/client").JsonValue | null;
            obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
            evidenceGaps: string[];
            contradictions: import("@prisma/client/runtime/client").JsonValue | null;
            reviewerStatus: string | null;
        };
        meta: object;
    }>;
    adminReviewResearchPack: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status: "REJECTED" | "REVIEWED";
            note?: string | undefined;
        };
        output: {
            id: string;
            status: import(".prisma/client").$Enums.BlogResearchPackStatus;
            createdAt: Date;
            executiveSummary: string | null;
            version: number;
            confidence: number;
            reviewedAt: Date | null;
            reviewedById: string | null;
            blogPostId: string | null;
            sourceSetHash: string;
            promptVersion: string;
            suggestionId: string | null;
            modelProvider: string | null;
            modelName: string | null;
            inputHash: string;
            researchObjective: string;
            importantDates: import("@prisma/client/runtime/client").JsonValue | null;
            authorities: import("@prisma/client/runtime/client").JsonValue | null;
            obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
            evidenceGaps: string[];
            contradictions: import("@prisma/client/runtime/client").JsonValue | null;
            reviewerStatus: string | null;
        };
        meta: object;
    }>;
    adminGetFreshnessReview: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            blogPost: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
            createdAt: Date;
            errorMessage: string | null;
            completedAt: Date | null;
            action: import(".prisma/client").$Enums.BlogFreshnessAction;
            contentHash: string;
            triggeredBy: string;
            blogPostId: string;
            sourceSetHash: string;
            promptVersion: string;
            agentRunId: string | null;
            rationale: string;
            modelProvider: string | null;
            modelName: string | null;
            riskTier: import(".prisma/client").$Enums.BlogFreshnessRiskTier;
            freshnessScore: number;
            changedSourceIds: string[];
            newSignalIds: string[];
            brokenSourceCount: number;
            staleSourceCount: number;
            nextReviewAt: Date | null;
        };
        meta: object;
    }>;
    adminListFreshnessReviews: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            blogPostId?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            reviews: ({
                blogPost: {
                    id: string;
                    title: string;
                };
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                createdAt: Date;
                errorMessage: string | null;
                completedAt: Date | null;
                action: import(".prisma/client").$Enums.BlogFreshnessAction;
                contentHash: string;
                triggeredBy: string;
                blogPostId: string;
                sourceSetHash: string;
                promptVersion: string;
                agentRunId: string | null;
                rationale: string;
                modelProvider: string | null;
                modelName: string | null;
                riskTier: import(".prisma/client").$Enums.BlogFreshnessRiskTier;
                freshnessScore: number;
                changedSourceIds: string[];
                newSignalIds: string[];
                brokenSourceCount: number;
                staleSourceCount: number;
                nextReviewAt: Date | null;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    adminListRevisionRequests: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            blogPostId?: string | undefined;
            status?: "RESOLVED" | "DISMISSED" | "PENDING_REVIEW" | "ACCEPTED" | "ASSIGNED" | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            requests: ({
                blogPost: {
                    id: string;
                    title: string;
                };
                assignedTo: {
                    id: string;
                    fullName: string;
                } | null;
                requestedBy: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogRevisionStatus;
                createdAt: Date;
                priority: import(".prisma/client").$Enums.BlogRevisionPriority;
                reason: string;
                idempotencyKey: string;
                resolvedAt: Date | null;
                blogPostId: string;
                requestedById: string | null;
                approvedById: string | null;
                freshnessReviewId: string | null;
                recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
                evidence: import("@prisma/client/runtime/client").JsonValue | null;
                assignedToId: string | null;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    adminGetRevisionRequest: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            blogPost: {
                id: string;
                title: string;
            };
            assignedTo: {
                id: string;
                fullName: string;
            } | null;
            requestedBy: {
                id: string;
                fullName: string;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.BlogRevisionStatus;
            createdAt: Date;
            priority: import(".prisma/client").$Enums.BlogRevisionPriority;
            reason: string;
            idempotencyKey: string;
            resolvedAt: Date | null;
            blogPostId: string;
            requestedById: string | null;
            approvedById: string | null;
            freshnessReviewId: string | null;
            recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
            evidence: import("@prisma/client/runtime/client").JsonValue | null;
            assignedToId: string | null;
        };
        meta: object;
    }>;
    adminAssignRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            assignedToId: string;
        };
        output: {
            id: string;
            status: import(".prisma/client").$Enums.BlogRevisionStatus;
            createdAt: Date;
            priority: import(".prisma/client").$Enums.BlogRevisionPriority;
            reason: string;
            idempotencyKey: string;
            resolvedAt: Date | null;
            blogPostId: string;
            requestedById: string | null;
            approvedById: string | null;
            freshnessReviewId: string | null;
            recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
            evidence: import("@prisma/client/runtime/client").JsonValue | null;
            assignedToId: string | null;
        };
        meta: object;
    }>;
    adminAcceptRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            status: import(".prisma/client").$Enums.BlogRevisionStatus;
            createdAt: Date;
            priority: import(".prisma/client").$Enums.BlogRevisionPriority;
            reason: string;
            idempotencyKey: string;
            resolvedAt: Date | null;
            blogPostId: string;
            requestedById: string | null;
            approvedById: string | null;
            freshnessReviewId: string | null;
            recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
            evidence: import("@prisma/client/runtime/client").JsonValue | null;
            assignedToId: string | null;
        };
        meta: object;
    }>;
    adminStartRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            status: import(".prisma/client").$Enums.BlogRevisionStatus;
            createdAt: Date;
            priority: import(".prisma/client").$Enums.BlogRevisionPriority;
            reason: string;
            idempotencyKey: string;
            resolvedAt: Date | null;
            blogPostId: string;
            requestedById: string | null;
            approvedById: string | null;
            freshnessReviewId: string | null;
            recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
            evidence: import("@prisma/client/runtime/client").JsonValue | null;
            assignedToId: string | null;
        };
        meta: object;
    }>;
    adminResolveRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            resolutionNotes: string;
        };
        output: {
            id: string;
            status: import(".prisma/client").$Enums.BlogRevisionStatus;
            createdAt: Date;
            priority: import(".prisma/client").$Enums.BlogRevisionPriority;
            reason: string;
            idempotencyKey: string;
            resolvedAt: Date | null;
            blogPostId: string;
            requestedById: string | null;
            approvedById: string | null;
            freshnessReviewId: string | null;
            recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
            evidence: import("@prisma/client/runtime/client").JsonValue | null;
            assignedToId: string | null;
        };
        meta: object;
    }>;
    adminDismissRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: {
            id: string;
            status: import(".prisma/client").$Enums.BlogRevisionStatus;
            createdAt: Date;
            priority: import(".prisma/client").$Enums.BlogRevisionPriority;
            reason: string;
            idempotencyKey: string;
            resolvedAt: Date | null;
            blogPostId: string;
            requestedById: string | null;
            approvedById: string | null;
            freshnessReviewId: string | null;
            recommendedChanges: import("@prisma/client/runtime/client").JsonValue | null;
            evidence: import("@prisma/client/runtime/client").JsonValue | null;
            assignedToId: string | null;
        };
        meta: object;
    }>;
    adminListContentOpsAlerts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "OPEN" | "RESOLVED" | "ACKNOWLEDGED" | "IGNORED" | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            alerts: ({
                resolvedBy: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                type: string;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string;
                severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
                status: import(".prisma/client").$Enums.AutomationIncidentStatus;
                createdAt: Date;
                updatedAt: Date;
                summary: string;
                entityType: string;
                entityId: string;
                resolvedAt: Date | null;
                workflowKey: string | null;
                firstSeenAt: Date;
                lastSeenAt: Date;
                occurrenceCount: number;
                executionId: string | null;
                notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
                notificationAttempts: number;
                lastNotificationAt: Date | null;
                acknowledgedById: string | null;
                acknowledgedAt: Date | null;
                resolvedById: string | null;
                resolutionNote: string | null;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    adminGetContentOpsAlert: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            resolvedBy: {
                id: string;
                fullName: string;
            } | null;
        } & {
            type: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            title: string;
            severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
            status: import(".prisma/client").$Enums.AutomationIncidentStatus;
            createdAt: Date;
            updatedAt: Date;
            summary: string;
            entityType: string;
            entityId: string;
            resolvedAt: Date | null;
            workflowKey: string | null;
            firstSeenAt: Date;
            lastSeenAt: Date;
            occurrenceCount: number;
            executionId: string | null;
            notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
            notificationAttempts: number;
            lastNotificationAt: Date | null;
            acknowledgedById: string | null;
            acknowledgedAt: Date | null;
            resolvedById: string | null;
            resolutionNote: string | null;
        };
        meta: object;
    }>;
    adminAcknowledgeContentOpsAlert: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            type: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            title: string;
            severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
            status: import(".prisma/client").$Enums.AutomationIncidentStatus;
            createdAt: Date;
            updatedAt: Date;
            summary: string;
            entityType: string;
            entityId: string;
            resolvedAt: Date | null;
            workflowKey: string | null;
            firstSeenAt: Date;
            lastSeenAt: Date;
            occurrenceCount: number;
            executionId: string | null;
            notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
            notificationAttempts: number;
            lastNotificationAt: Date | null;
            acknowledgedById: string | null;
            acknowledgedAt: Date | null;
            resolvedById: string | null;
            resolutionNote: string | null;
        };
        meta: object;
    }>;
    adminResolveContentOpsAlert: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            resolutionNotes: string;
        };
        output: {
            type: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            title: string;
            severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
            status: import(".prisma/client").$Enums.AutomationIncidentStatus;
            createdAt: Date;
            updatedAt: Date;
            summary: string;
            entityType: string;
            entityId: string;
            resolvedAt: Date | null;
            workflowKey: string | null;
            firstSeenAt: Date;
            lastSeenAt: Date;
            occurrenceCount: number;
            executionId: string | null;
            notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
            notificationAttempts: number;
            lastNotificationAt: Date | null;
            acknowledgedById: string | null;
            acknowledgedAt: Date | null;
            resolvedById: string | null;
            resolutionNote: string | null;
        };
        meta: object;
    }>;
    adminIgnoreContentOpsAlert: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: {
            type: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            title: string;
            severity: import(".prisma/client").$Enums.AutomationIncidentSeverity;
            status: import(".prisma/client").$Enums.AutomationIncidentStatus;
            createdAt: Date;
            updatedAt: Date;
            summary: string;
            entityType: string;
            entityId: string;
            resolvedAt: Date | null;
            workflowKey: string | null;
            firstSeenAt: Date;
            lastSeenAt: Date;
            occurrenceCount: number;
            executionId: string | null;
            notificationStatus: import(".prisma/client").$Enums.ContentOpsAlertNotificationStatus;
            notificationAttempts: number;
            lastNotificationAt: Date | null;
            acknowledgedById: string | null;
            acknowledgedAt: Date | null;
            resolvedById: string | null;
            resolutionNote: string | null;
        };
        meta: object;
    }>;
    adminListEditorialDigests: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminGetEditorialDigest: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminGenerateEditorialDigest: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            force?: boolean | undefined;
            periodStart?: Date | undefined;
            periodEnd?: Date | undefined;
        };
        output: any;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=blog-automation.router.d.ts.map
