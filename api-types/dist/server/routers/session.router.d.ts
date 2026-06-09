/**
 * Session Router
 *
 * Provides a lightweight heartbeat procedure that frontend idle-timeout logic
 * can call when the user clicks "Stay Logged In".
 *
 * The only purpose of the heartbeat is to hit a protectedProcedure so that
 * context.ts slides the `sheriabot:last_seen:{userId}` Redis window forward,
 * keeping the backend session alive in sync with the frontend timer reset.
 */
export declare const sessionRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Heartbeat  -  authenticated no-op.
     *
     * Reaching this procedure means the request passed through isAuthenticated,
     * which already updates last_seen in context.ts for every authenticated
     * request. No additional logic needed here.
     *
     * Called by useIdleTimeout.resetTimer() when the user clicks "Stay Logged In".
     */
    heartbeat: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            ok: true;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=session.router.d.ts.map