export declare const regulatorySourceRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    createSource: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            sourceKey: string;
            name: string;
            regulatoryBody: string;
            baseUrl: string;
            jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
            authorityType?: "PRIMARY_OFFICIAL" | "AUTHORITATIVE" | "SECONDARY_VERIFIED" | undefined;
            sourceType?: "WEBSITE" | "FEED_RSS" | "GAZETTE_FEED" | "API" | "PORTAL" | undefined;
            fetchUrl?: string | undefined;
            isActive?: boolean | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        output: {
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            regulatoryBody: string;
            jurisdictionCode: string;
            isActive: boolean;
            authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
            baseUrl: string;
            sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
            sourceKey: string;
            fetchUrl: string | null;
            lastCheckedAt: Date | null;
            lastSuccessfulFetchAt: Date | null;
            lastFailureAt: Date | null;
            failureCount: number;
            lastFailureReason: string | null;
        };
        meta: object;
    }>;
    updateSource: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        } & {
            name?: string | undefined;
            jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
            regulatoryBody?: string | undefined;
            authorityType?: "PRIMARY_OFFICIAL" | "AUTHORITATIVE" | "SECONDARY_VERIFIED" | undefined;
            sourceType?: "WEBSITE" | "FEED_RSS" | "GAZETTE_FEED" | "API" | "PORTAL" | undefined;
            baseUrl?: string | undefined;
            fetchUrl?: string | null | undefined;
            isActive?: boolean | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        output: {
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            regulatoryBody: string;
            jurisdictionCode: string;
            isActive: boolean;
            authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
            baseUrl: string;
            sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
            sourceKey: string;
            fetchUrl: string | null;
            lastCheckedAt: Date | null;
            lastSuccessfulFetchAt: Date | null;
            lastFailureAt: Date | null;
            failureCount: number;
            lastFailureReason: string | null;
        };
        meta: object;
    }>;
    deactivateSource: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            regulatoryBody: string;
            jurisdictionCode: string;
            isActive: boolean;
            authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
            baseUrl: string;
            sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
            sourceKey: string;
            fetchUrl: string | null;
            lastCheckedAt: Date | null;
            lastSuccessfulFetchAt: Date | null;
            lastFailureAt: Date | null;
            failureCount: number;
            lastFailureReason: string | null;
        };
        meta: object;
    }>;
    getSource: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            regulatoryBody: string;
            jurisdictionCode: string;
            isActive: boolean;
            authorityType: import(".prisma/client").$Enums.RegulatoryAuthorityType;
            baseUrl: string;
            sourceType: import(".prisma/client").$Enums.RegulatorySourceType;
            sourceKey: string;
            fetchUrl: string | null;
            lastCheckedAt: Date | null;
            lastSuccessfulFetchAt: Date | null;
            lastFailureAt: Date | null;
            failureCount: number;
            lastFailureReason: string | null;
        };
        meta: object;
    }>;
    listSources: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
            regulatoryBody?: string | undefined;
            authorityType?: "PRIMARY_OFFICIAL" | "AUTHORITATIVE" | "SECONDARY_VERIFIED" | undefined;
            isActive?: boolean | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        };
        output: {
            sources: import(".prisma/client").RegulatorySource[];
            total: number;
        };
        meta: object;
    }>;
    testConnection: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            ok: boolean;
            httpStatus: number;
            latencyMs: number;
            contentType?: string;
            previewText?: string;
            error?: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=regulatory-source.router.d.ts.map