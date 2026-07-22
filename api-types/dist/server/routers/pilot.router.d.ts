/**
 * Pilot Router
 *
 * Admin-only tRPC procedures for the Pilot Programme dashboard.
 * All procedures require ADMIN role (via adminProcedure).
 *
 * Procedures:
 *   pilot.getStats        -  aggregate stats (totals, cohorts)
 *   pilot.listTesters     -  per-tester rows with engagement metrics
 */
export declare const pilotRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    createPilotTester: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            fullName: string;
            email: string;
            organizationId?: unknown;
            organizationName?: unknown;
            role?: "STARTUP" | "ENTERPRISE" | undefined;
            phone?: string | undefined;
            temporaryPassword?: string | undefined;
            pilotDurationDays?: number | undefined;
        };
        output: {
            success: boolean;
            userId: string;
            organizationId: string | null;
            temporaryPasswordExpiresAt: string;
            pilotAccessExpiresAt: string;
            emailDeliveryStatus: "FAILED" | "SENT";
        };
        meta: object;
    }>;
    reissueTemporaryPassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
        };
        output: {
            success: boolean;
            temporaryPasswordExpiresAt: string;
            emailDeliveryStatus: "FAILED" | "SENT";
        };
        meta: object;
    }>;
    extendPilotAccess: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            extensionDays: number;
            reason?: string | undefined;
        };
        output: {
            success: boolean;
            pilotAccessExpiresAt: string;
            pilotExtensionCount: any;
        };
        meta: object;
    }>;
    revokePilotAccess: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            reason?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Aggregate stats for the pilot programme header cards.
     */
    getStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            total: number;
            active: number;
            expired: number;
            converted: number;
            totalEvents: number;
            cohorts: string[];
        };
        meta: object;
    }>;
    /**
     * Per-tester rows with engagement metrics.
     * Sorted newest-first by pilotStartedAt.
     */
    listTesters: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            email: string;
            fullName: string;
            organization: string | null;
            cohort: string | null;
            pilotStartedAt: string | null;
            pilotExpiresAt: string | null;
            pilotConvertedAt: string | null;
            pilotAccessStatus: any;
            pilotExtensionCount: any;
            pilotFirstExtensionGrantedAt: any;
            pilotSecondExtensionGrantedAt: any;
            status: string;
            daysRemaining: number;
            daysSinceStart: number;
            engagementScore: number;
            engagementPercent: number;
            totalEvents: number;
            lastEventAt: string;
            eventsByAction: Record<string, number>;
        }[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=pilot.router.d.ts.map