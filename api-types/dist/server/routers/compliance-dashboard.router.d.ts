export declare const complianceDashboardRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Get full compliance dashboard data for the user's organization.
     * Auto-seeds default checklist items on first access.
     * Requires: authenticated + active OrganizationMember (any role).
     */
    getComplianceDashboard: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            overallScore: number;
            trend: {
                points: number | null;
                label: "increase" | "decrease" | "no_change" | "insufficient_history";
                comparedAt: string | null;
                windowDays: 30;
            };
            categories: Array<{
                key: string;
                label: string;
                score: number;
                completedItems: number;
                totalItems: number;
            }>;
            lastUpdated: string;
        };
        meta: object;
    }>;
    /**
     * Mark a compliance dashboard item as completed or incomplete.
     * Operates on the ComplianceItem model (the seeded startup dashboard checklist).
     * Requires: authenticated + active OrganizationMember with at least MEMBER role
     * (VIEWER cannot mutate).
     */
    updateDashboardItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            itemId: string;
            isCompleted: boolean;
        };
        output: {
            id: string;
            isCompleted: boolean;
            completedAt: Date | null;
        };
        meta: object;
    }>;
    /**
     * Get all checklist items for a specific compliance category.
     * Requires: authenticated + active OrganizationMember (any role).
     */
    getChecklistByCategory: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            category: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_KYC" | "CONSUMER_PROTECTION" | "CBK_LICENSING";
        };
        output: {
            id: string;
            category: string;
            title: string;
            description: string;
            isCompleted: boolean;
            completedAt: Date | null;
            updatedAt: Date;
        }[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=compliance-dashboard.router.d.ts.map