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
        output: {
            monitors: ({
                verifiedBy: {
                    id: string;
                    fullName: string;
                } | null;
                updatedBy: {
                    id: string;
                    fullName: string;
                } | null;
                createdBy: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
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
    adminGetMonitor: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            verifiedBy: {
                id: string;
                fullName: string;
            } | null;
            updatedBy: {
                id: string;
                fullName: string;
            } | null;
            createdBy: {
                id: string;
                fullName: string;
            } | null;
        } & {
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
        output: {
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
        output: {
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
        meta: object;
    }>;
    adminSetMonitorStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status: "ACTIVE" | "INACTIVE" | "NEEDS_VERIFICATION" | "FAILING";
            isActive?: boolean | undefined;
        };
        output: {
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
        meta: object;
    }>;
    adminVerifyMonitor: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            notes?: string | null | undefined;
        };
        output: {
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
        meta: object;
    }>;
    adminDeleteMonitor: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        output: {
            items: ({
                monitor: {
                    id: string;
                    name: string;
                    jurisdiction: import("@prisma/client").$Enums.BlogJurisdiction;
                    authorityType: import("@prisma/client").$Enums.BlogAuthorityType;
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
    adminGetSourceItem: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
    }>;
    adminDismissSourceItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: {
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
        meta: object;
    }>;
    adminRunMonitorNow: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            monitorId: string;
        };
        output: {
            status: string;
            message: string;
            itemsFound?: undefined;
            itemsCreated?: undefined;
            duplicateCount?: undefined;
            failureCount?: undefined;
            errorMessage?: undefined;
        } | {
            status: "FAILED" | "SUCCESS" | "PARTIAL_SUCCESS";
            itemsFound: number;
            itemsCreated: number;
            duplicateCount: number;
            failureCount: number;
            errorMessage: string | null;
            message?: undefined;
        };
        meta: object;
    }>;
    adminListDiscoveryRuns: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            monitorId?: string | undefined;
            status?: "FAILED" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "SKIPPED_LOCKED" | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            runs: ({
                monitor: {
                    id: string;
                    name: string;
                } | null;
                triggeredByUser: {
                    id: string;
                    fullName: string;
                } | null;
            } & {
                id: string;
                status: import("@prisma/client").$Enums.BlogDiscoveryRunStatus;
                createdAt: Date;
                updatedAt: Date;
                errorMessage: string | null;
                completedAt: Date | null;
                startedAt: Date;
                failureCount: number;
                monitorId: string | null;
                itemsFound: number;
                itemsCreated: number;
                duplicateCount: number;
                triggeredBy: string;
                triggeredByUserId: string | null;
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
}>>;
//# sourceMappingURL=blog-automation.router.d.ts.map