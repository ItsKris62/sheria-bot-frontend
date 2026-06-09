/**
 * Admin Support Router
 *
 * Admin-only ticket management: view all tickets, update statuses, respond.
 * All business logic is delegated to supportService.
 */
export declare const adminSupportRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * List all tickets with filtering, search, and pagination
     * @admin
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
            category?: "ACCOUNT" | "BILLING" | "TECHNICAL" | "COMPLIANCE_QUERY" | "FEATURE_REQUEST" | "OTHER" | undefined;
            search?: string | undefined;
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            tickets: any;
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: object;
    }>;
    /**
     * Get full ticket detail including user info and all comments
     * @admin
     */
    getByTicketNumber: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            ticketNumber: string;
        };
        output: any;
        meta: object;
    }>;
    /**
     * Update ticket status and notify the user
     * @admin
     */
    updateStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            ticketId: string;
            status: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED";
        };
        output: any;
        meta: object;
    }>;
    /**
     * Add an admin response to a ticket, optionally updating the status
     * @admin
     */
    addResponse: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            ticketId: string;
            message: string;
            updateStatusTo?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
        };
        output: any;
        meta: object;
    }>;
    /**
     * Get aggregate ticket stats for the admin dashboard
     * @admin
     */
    stats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            open: any;
            inProgress: any;
            awaitingUser: any;
            resolved: any;
            closed: any;
            urgent: any;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=adminSupport.router.d.ts.map