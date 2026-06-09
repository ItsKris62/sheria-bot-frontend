export declare const customFrameworkRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | undefined;
        } | undefined;
        output: any;
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            description?: string | null | undefined;
            jurisdiction?: string | null | undefined;
            regulator?: string | null | undefined;
            category?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    updateMetadata: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            jurisdiction?: string | null | undefined;
            regulator?: string | null | undefined;
            category?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    createSection: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            frameworkId: string;
            title: string;
            description?: string | null | undefined;
            order?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    updateSection: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            description?: string | null | undefined;
            order?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    deleteSection: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    createControl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            frameworkId: string;
            title: string;
            requirement: string;
            sectionId?: string | null | undefined;
            code?: string | null | undefined;
            guidance?: string | null | undefined;
            evidenceRequired?: unknown;
            severity?: string | null | undefined;
            frequency?: string | null | undefined;
            regulatorReference?: string | null | undefined;
            order?: number | undefined;
        };
        output: any;
        meta: object;
    }>;
    updateControl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            code?: string | null | undefined;
            title?: string | undefined;
            severity?: string | null | undefined;
            guidance?: string | null | undefined;
            order?: number | undefined;
            sectionId?: string | null | undefined;
            requirement?: string | undefined;
            evidenceRequired?: unknown;
            frequency?: string | null | undefined;
            regulatorReference?: string | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    deleteControl: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    publish: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    archive: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=custom-framework.router.d.ts.map