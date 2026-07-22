export declare const alertRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    createStreamToken: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            token: string;
            expiresInSeconds: number;
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            summary: string;
            body: string;
            regulatoryBody: "GAZETTE" | "CBK" | "CMA" | "ODPC" | "CA";
            category: "DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL";
            sourceUrl?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
            effectiveDate?: string | undefined;
            expiresAt?: string | undefined;
        };
        output: {
            id: string;
            title: string;
            severity: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            effectiveDate: Date | null;
            regulatoryBody: string;
            summary: string;
            category: string;
            publishedAt: Date;
            isActive: boolean;
            body: string;
            sourceUrl: string | null;
            publishedById: string;
        };
        meta: object;
    }>;
    publish: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            alertId: string;
        };
        output: void;
        meta: object;
    }>;
    getAlerts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            regulatoryBody?: "GAZETTE" | "CBK" | "CMA" | "ODPC" | "CA" | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
            unreadOnly?: boolean | undefined;
        };
        output: import("@/modules/alert").GetAlertsResult;
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            alertId: string;
        };
        output: import("@/modules/alert").AlertWithReadStatus;
        meta: object;
    }>;
    getUnreadCount: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            count: number;
        };
        meta: object;
    }>;
    markAsRead: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            notificationId: string;
        };
        output: void;
        meta: object;
    }>;
    markAllAsRead: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: void;
        meta: object;
    }>;
    upsertSubscription: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            regulatoryBodies: ("GAZETTE" | "CBK" | "CMA" | "ODPC" | "CA")[];
            categories: ("DATA_PROTECTION" | "AML_CFT" | "PRUDENTIAL" | "LICENSING" | "CAPITAL_MARKETS" | "GENERAL")[];
            severityThreshold: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
            emailEnabled: boolean;
            inAppEnabled: boolean;
            emailFrequency: "REALTIME" | "DAILY" | "WEEKLY";
        };
        output: {
            emailFrequency: string;
            id: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            inAppEnabled: boolean;
            emailEnabled: boolean;
            regulatoryBodies: string[];
            categories: string[];
            severityThreshold: string;
        };
        meta: object;
    }>;
    getSubscription: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            emailFrequency: string;
            id: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            inAppEnabled: boolean;
            emailEnabled: boolean;
            regulatoryBodies: string[];
            categories: string[];
            severityThreshold: string;
        } | null;
        meta: object;
    }>;
    getAdminAlerts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            alerts: import(".prisma/client").RegulatoryAlert[];
            total: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=alert.router.d.ts.map