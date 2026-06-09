/**
 * Public Marketing Router - Phase B4
 *
 * Unauthenticated procedures for:
 *   - Unsubscribe token validation
 *   - Unsubscribe confirmation
 *   - Pilot programme application
 */
export declare const publicMarketingRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Validate an unsubscribe token without consuming it.
     * Returns { valid: true, email } or { valid: false }
     */
    validateUnsubscribeToken: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            token: string;
        };
        output: {
            valid: false;
            email: null;
        } | {
            valid: true;
            email: string;
        };
        meta: object;
    }>;
    /**
     * Confirm unsubscribe - suppresses the contact and marks the token used.
     */
    unsubscribe: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            token: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Apply for the SheriaBot Pilot Programme.
     *
     * Security controls applied in middleware-chain order:
     *   1. rateLimited('pilotApply', 5, { window: 600 }) -- 5 submissions per
     *      IP per 10 min; identifier is ctx.req.ip (Fastify, respects
     *      trustProxy setting in app.ts).
     *   2. Email idempotency sentinel -- redis nx key on normalised email hash,
     *      600 s TTL. Duplicate submissions within the window return the same
     *      { success: true } shape without re-running the contact flow.
     *
     * Creates/updates a Contact with consent on first submission.
     */
    applyForPilot: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            firstName: string;
            lastName: string;
            email: string;
            companyName: string;
            jobTitle: string;
            phone?: string | undefined;
            message?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=publicMarketing.router.d.ts.map