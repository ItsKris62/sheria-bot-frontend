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
            status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "AWAITING_FEEDBACK" | "WITHDRAWN" | undefined;
            search?: string | undefined;
        };
        output: {
            applications: ({
                _count: {
                    timelineEvents: number;
                    documents: number;
                    fees: number;
                    regulatorFeedback: number;
                };
            } & {
                id: string;
                title: string;
                userId: string;
                status: string;
                organizationId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                regulator: string;
                licenseType: string;
                progress: number;
                referenceNumber: string | null;
                nextAction: string | null;
                dueDate: Date | null;
                submittedAt: Date | null;
                decidedAt: Date | null;
            })[];
            stats: {
                total: number;
                inProgress: number;
                submitted: number;
                approved: number;
            };
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: ({
            user: {
                id: string;
                email: string;
                fullName: string;
            };
            timelineEvents: {
                id: string;
                title: string;
                description: string | null;
                userId: string;
                createdAt: Date;
                applicationId: string;
                eventDate: Date;
                completed: boolean;
            }[];
            documents: {
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
            }[];
            fees: {
                id: string;
                description: string;
                userId: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                applicationId: string;
                amount: number;
                paidAt: Date | null;
            }[];
            regulatorFeedback: {
                message: string;
                id: string;
                userId: string;
                createdAt: Date;
                dueDate: Date | null;
                applicationId: string;
                fromName: string | null;
                actionRequired: boolean;
                receivedAt: Date;
            }[];
        } & {
            id: string;
            title: string;
            userId: string;
            status: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            regulator: string;
            licenseType: string;
            progress: number;
            referenceNumber: string | null;
            nextAction: string | null;
            dueDate: Date | null;
            submittedAt: Date | null;
            decidedAt: Date | null;
        }) | null;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            regulator: string;
            licenseType: string;
            status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "AWAITING_FEEDBACK" | "WITHDRAWN" | undefined;
            progress?: number | undefined;
            referenceNumber?: string | undefined;
            nextAction?: string | undefined;
            dueDate?: Date | undefined;
        };
        output: {
            id: string;
            title: string;
            userId: string;
            status: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            regulator: string;
            licenseType: string;
            progress: number;
            referenceNumber: string | null;
            nextAction: string | null;
            dueDate: Date | null;
            submittedAt: Date | null;
            decidedAt: Date | null;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            regulator?: string | undefined;
            licenseType?: string | undefined;
            status?: "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED" | "AWAITING_FEEDBACK" | "WITHDRAWN" | undefined;
            progress?: number | undefined;
            referenceNumber?: string | undefined;
            nextAction?: string | undefined;
            dueDate?: Date | undefined;
            submittedAt?: Date | null | undefined;
            decidedAt?: Date | null | undefined;
        };
        output: {
            id: string;
            title: string;
            userId: string;
            status: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            regulator: string;
            licenseType: string;
            progress: number;
            referenceNumber: string | null;
            nextAction: string | null;
            dueDate: Date | null;
            submittedAt: Date | null;
            decidedAt: Date | null;
        };
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