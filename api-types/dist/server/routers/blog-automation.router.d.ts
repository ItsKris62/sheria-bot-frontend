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