export declare const enterpriseContractRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    adminList: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            organizationId?: string | undefined;
            status?: string | undefined;
        } | undefined;
        output: any;
        meta: object;
    }>;
    adminGet: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    adminCreate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            organizationId: string;
            reason: string;
            contractName?: string | null | undefined;
            contractNumber?: string | null | undefined;
            startsAt?: unknown;
            endsAt?: unknown;
            renewalDate?: unknown;
            billingCycle?: string | null | undefined;
            currency?: string | null | undefined;
            monthlyAmount?: number | null | undefined;
            annualAmount?: number | null | undefined;
            notes?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminUpdate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
            organizationId?: string | undefined;
            contractName?: string | null | undefined;
            contractNumber?: string | null | undefined;
            startsAt?: unknown;
            endsAt?: unknown;
            renewalDate?: unknown;
            billingCycle?: string | null | undefined;
            currency?: string | null | undefined;
            monthlyAmount?: number | null | undefined;
            annualAmount?: number | null | undefined;
            notes?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    adminActivate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: any;
        meta: object;
    }>;
    adminSuspend: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: any;
        meta: object;
    }>;
    adminArchive: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: any;
        meta: object;
    }>;
    adminAddOverride: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            contractId: string;
            key: "seats.limit" | "features.customFrameworks" | "features.policyGeneration" | "features.licenseManagement" | "features.complianceCalendar" | "features.gapAnalysis" | "features.benchmarkDocuments" | "limits.complianceQueries.month" | "limits.gapAnalysis.month" | "limits.policyGeneration.month" | "limits.documentUploads.month" | "limits.storageGb" | "limits.customFrameworks.count" | "limits.benchmarkDocuments.count" | "support.tier";
            value: unknown;
            reason: string;
            startsAt?: unknown;
            endsAt?: unknown;
        };
        output: any;
        meta: object;
    }>;
    adminUpdateOverride: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
            contractId?: string | undefined;
            key?: "seats.limit" | "features.customFrameworks" | "features.policyGeneration" | "features.licenseManagement" | "features.complianceCalendar" | "features.gapAnalysis" | "features.benchmarkDocuments" | "limits.complianceQueries.month" | "limits.gapAnalysis.month" | "limits.policyGeneration.month" | "limits.documentUploads.month" | "limits.storageGb" | "limits.customFrameworks.count" | "limits.benchmarkDocuments.count" | "support.tier" | undefined;
            value?: unknown;
            startsAt?: unknown;
            endsAt?: unknown;
        };
        output: any;
        meta: object;
    }>;
    adminDisableOverride: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            reason: string;
        };
        output: any;
        meta: object;
    }>;
    adminPreviewEffectiveEntitlements: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            organizationId: string;
        };
        output: {
            organization: any;
            planDefault: import("@/config/entitlements.config").PlanEntitlementConfig;
            effectiveEntitlements: import("@/config/entitlements.config").PlanEntitlementConfig;
            appliedOverrides: import("@/modules/billing/enterprise-contract-overrides").AppliedEnterpriseOverride[];
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=enterprise-contract.router.d.ts.map