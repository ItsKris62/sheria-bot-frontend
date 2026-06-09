export declare const frameworkRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            includeInactive?: boolean | undefined;
        } | undefined;
        output: any[];
        meta: object;
    }>;
    getBySlug: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            slug: string;
        };
        output: {
            id: string;
            slug: string;
            name: string;
            description: string | null;
            category: string;
            tier: string;
            isActive: boolean;
            version: string | null;
            documentCount: number;
            isCustom: boolean;
            organizationId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=framework.router.d.ts.map