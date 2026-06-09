/**
 * Support Router (User-facing)
 *
 * Handles ticket creation, listing, viewing, and commenting for authenticated users.
 * All business logic is delegated to supportService.
 */
export declare const supportRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Submit a new support ticket
     * @protected
     */
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            subject: string;
            description: string;
            category: "ACCOUNT" | "BILLING" | "TECHNICAL" | "COMPLIANCE_QUERY" | "FEATURE_REQUEST" | "OTHER";
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
        };
        output: any;
        meta: object;
    }>;
    /**
     * List tickets for the current user with optional status filter and pagination
     * @protected
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "OPEN" | "IN_PROGRESS" | "AWAITING_USER" | "RESOLVED" | "CLOSED" | undefined;
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
     * Get full ticket detail including comments (only the owner can view)
     * @protected
     */
    getByTicketNumber: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            ticketNumber: string;
        };
        output: any;
        meta: object;
    }>;
    /**
     * Add a comment to a ticket (user reply)
     * @protected
     */
    addComment: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            ticketId: string;
            message: string;
        };
        output: any;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=support.router.d.ts.map