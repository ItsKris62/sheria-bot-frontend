/**
 * Analytics Router
 *
 * Powers dashboards and data export for all user roles.
 * User-level and org-level analytics for protected procedures.
 * Platform-wide analytics for admins only.
 *
 * Business logic delegated to AnalyticsModule.
 */
export declare const analyticsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Get activity summary for the current user
     *
     * @protected
     */
    getUserSummary: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
        };
        output: import("@/modules/analytics").UserActivitySummary;
        meta: object;
    }>;
    /**
     * Get organization dashboard analytics
     *
     * @protected  -  uses caller's org if orgId not supplied
     */
    getOrgDashboard: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            orgId?: string | undefined;
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
        };
        output: import("@/modules/analytics").OrgDashboard;
        meta: object;
    }>;
    /**
     * Get compliance score for the user's organization
     *
     * @protected
     */
    getOrgComplianceScore: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/analytics").ComplianceScoreReport;
        meta: object;
    }>;
    /**
     * Get compliance trend data over time
     *
     * @protected
     */
    getComplianceTrends: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            orgId?: string | undefined;
            periods?: number | undefined;
        };
        output: import("@/modules/analytics").ComplianceTrend[];
        meta: object;
    }>;
    /**
     * Get compliance gap analysis for the organization
     *
     * @protected
     */
    getGapAnalysis: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/analytics").GapAnalysis;
        meta: object;
    }>;
    /**
     * Get deadline alerts for the user's organization
     *
     * @protected
     */
    getDeadlineAlerts: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/analytics").DeadlineAlert[];
        meta: object;
    }>;
    /**
     * Get document usage statistics for the organization
     *
     * @protected
     */
    getDocumentStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/analytics").DocumentStats;
        meta: object;
    }>;
    /**
     * Generate a compliance report
     *
     * @protected
     */
    generateReport: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orgId?: string | undefined;
            reportType?: "compliance" | "audit" | "executive" | undefined;
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
            includeDetails?: boolean | undefined;
        };
        output: import("@/modules/analytics").GeneratedReport;
        meta: object;
    }>;
    /**
     * Export analytics data as CSV or JSON
     *
     * @protected
     */
    exportData: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            format?: "csv" | "json" | undefined;
            type?: "policies" | "users" | "documents" | "audit" | "queries" | undefined;
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
            orgId?: string | undefined;
        };
        output: import("@/modules/analytics").ExportResult;
        meta: object;
    }>;
    /**
     * Get platform-wide overview (admin only)
     *
     * @admin
     */
    getPlatformOverview: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
        };
        output: import("@/modules/analytics").PlatformOverview;
        meta: object;
    }>;
    /**
     * Get user growth metrics (admin only)
     *
     * @admin
     */
    getUserGrowth: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
        };
        output: import("@/modules/analytics").GrowthMetrics;
        meta: object;
    }>;
    /**
     * Get organization growth metrics (admin only)
     *
     * @admin
     */
    getOrgGrowth: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            dateRange?: {
                from?: string | undefined;
                to?: string | undefined;
                days?: number | undefined;
            } | undefined;
        };
        output: import("@/modules/analytics").GrowthMetrics;
        meta: object;
    }>;
    /**
     * Daily Active Users -- distinct userId count per calendar day (Africa/Nairobi).
     * Returns today's DAU as a headline number plus a per-day series for charting.
     *
     * @admin
     */
    getDailyActiveUsers: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            range?: "last7d" | "last30d" | "last90d" | undefined;
        };
        output: {
            today: number;
            series: Array<{
                date: string;
                dau: number;
            }>;
        };
        meta: object;
    }>;
    /**
     * Queries per user -- total, 30-day, 7-day counts plus status breakdown and
     * last-query timestamp for a given userId. Admin-only.
     *
     * @admin
     */
    getQueriesPerUser: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            range?: "alltime" | "last7d" | "last30d" | undefined;
        };
        output: {
            total: number;
            last30d: number;
            last7d: number;
            byStatus: {
                completed: number;
                processing: number;
                failed: number;
            };
            lastQueryAt: string | null;
        };
        meta: object;
    }>;
    /**
     * Feedback summary -- aggregated thumbs up/down counts plus paginated vote rows.
     * Backed by the existing QueryFeedback table. Admin-only.
     *
     * @admin
     */
    getFeedbackSummary: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            range?: "last7d" | "last30d" | "last90d" | undefined;
            page?: number | undefined;
            pageSize?: number | undefined;
        };
        output: {
            aggregate: {
                totalVotes: number;
                upVotes: number;
                downVotes: number;
                upPct: number;
            };
            rows: Array<{
                queryId: string;
                userId: string;
                userEmail: string;
                orgName: string | null;
                rating: "up" | "down";
                createdAt: string;
            }>;
            pagination: {
                page: number;
                pageSize: number;
                totalRows: number;
                totalPages: number;
            };
        };
        meta: object;
    }>;
    getWorkflowEventSummary: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            days?: number | undefined;
            page?: number | undefined;
            pageSize?: number | undefined;
        };
        output: {
            aggregate: {
                [k: string]: number;
            };
            rows: {
                id: string;
                action: string;
                entityType: string | null;
                entityId: string | null;
                metadata: import("@prisma/client/runtime/client").JsonValue;
                createdAt: Date;
                userEmail: string | null;
                userName: string | null;
            }[];
            pagination: {
                page: number;
                pageSize: number;
                totalRows: number;
                totalPages: number;
            };
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=analytics.router.d.ts.map