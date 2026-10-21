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
     * @deprecated Maintained for backward compatibility. Use getComplianceDashboardV2.
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
     * V2 Jurisdiction-First Compliance Dashboard
     * Returns discriminated union: READY | BASELINE_UNAVAILABLE | JURISDICTION_NOT_ENTITLED | JURISDICTION_NOT_CONFIGURED | JURISDICTION_UNSUPPORTED.
     */
    getComplianceDashboardV2: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            jurisdictionCode?: string | undefined;
        } | undefined;
        output: import("@/modules/compliance/compliance-dashboard-v2.service").ComplianceDashboardV2Response;
        meta: object;
    }>;
    /**
     * Assess a specific compliance requirement item under V2.
     * Replaces legacy binary toggle with 3-state review: NOT_REVIEWED | MEETS_REQUIREMENT | DOES_NOT_MEET_REQUIREMENT.
     * Requires: authenticated + active OrganizationMember with at least MEMBER role.
     */
    assessDashboardItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            itemId: string;
            status: "NOT_REVIEWED" | "MEETS_REQUIREMENT" | "DOES_NOT_MEET_REQUIREMENT";
        };
        output: import("@/modules/compliance/compliance-dashboard-v2.service").RequirementItemDTO;
        meta: object;
    }>;
    /**
     * Query the V2 rollout gate status for the authenticated user's organization.
     */
    getV2RolloutStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            isEnabled: boolean;
        };
        meta: object;
    }>;
    /**
     * Mark a compliance dashboard item as completed or incomplete (Legacy).
     * Operates on the ComplianceItem model (the seeded startup dashboard checklist).
     * Requires: authenticated + active OrganizationMember with at least MEMBER role
     * (VIEWER cannot mutate).
     * @deprecated Maintained for backward compatibility. Use assessDashboardItem.
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