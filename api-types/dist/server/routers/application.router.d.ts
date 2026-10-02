export declare const applicationRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            page?: number | undefined;
            limit?: number | undefined;
            jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
            status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "REJECTED" | "AWAITING_FEEDBACK" | undefined;
            search?: string | undefined;
        };
        output: {
            applications: any;
            stats: {
                total: any;
                inProgress: any;
                submitted: any;
                approved: any;
            };
            pagination: {
                page: number;
                limit: number;
                total: any;
                pages: number;
            };
        };
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
            title: string;
            regulator: string;
            licenseType: string;
            jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
            status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "REJECTED" | "AWAITING_FEEDBACK" | undefined;
            progress?: number | undefined;
            referenceNumber?: string | undefined;
            nextAction?: string | undefined;
            dueDate?: Date | undefined;
        };
        output: any;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
            regulator?: string | undefined;
            licenseType?: string | undefined;
            status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "WITHDRAWN" | "REJECTED" | "AWAITING_FEEDBACK" | undefined;
            progress?: number | undefined;
            referenceNumber?: string | undefined;
            nextAction?: string | undefined;
            dueDate?: Date | undefined;
            submittedAt?: Date | null | undefined;
            decidedAt?: Date | null | undefined;
        };
        output: any;
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    addTimelineEvent: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            applicationId: string;
            title: string;
            description?: string | undefined;
            eventDate?: Date | undefined;
            completed?: boolean | undefined;
        };
        output: {
            id: string;
            title: string;
            description: string | null;
            userId: string;
            createdAt: Date;
            applicationId: string;
            eventDate: Date;
            completed: boolean;
        };
        meta: object;
    }>;
    addDocument: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            applicationId: string;
            name: string;
            status?: "APPROVED" | "UPLOADED" | "REJECTED" | "REQUIRED" | undefined;
            vaultDocumentId?: string | undefined;
            notes?: string | undefined;
            uploadedAt?: Date | null | undefined;
        };
        output: {
            id: string;
            userId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationId: string;
            vaultDocumentId: string | null;
            notes: string | null;
            uploadedAt: Date | null;
        };
        meta: object;
    }>;
    addFee: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            applicationId: string;
            description: string;
            amount: number;
            currency?: string | undefined;
            status?: "PENDING" | "WAIVED" | "PAID" | undefined;
            paidAt?: Date | null | undefined;
        };
        output: {
            id: string;
            description: string;
            userId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            applicationId: string;
            amount: number;
            currency: string;
            paidAt: Date | null;
        };
        meta: object;
    }>;
    addRegulatorFeedback: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            applicationId: string;
            message: string;
            fromName?: string | undefined;
            actionRequired?: boolean | undefined;
            dueDate?: Date | null | undefined;
            receivedAt?: Date | undefined;
        };
        output: {
            message: string;
            id: string;
            userId: string;
            createdAt: Date;
            dueDate: Date | null;
            applicationId: string;
            fromName: string | null;
            actionRequired: boolean;
            receivedAt: Date;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=application.router.d.ts.map