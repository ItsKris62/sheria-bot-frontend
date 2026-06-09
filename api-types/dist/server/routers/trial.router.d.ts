/**
 * Trial Router
 *
 * Routes:
 *  - trial.activate -- one-time mutation to activate the 7-day free trial
 *  - trial.status   -- query to get current trial state and usage
 */
export declare const trialRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Activate the free trial for the authenticated user.
     *
     * One-time only. Returns CONFLICT if the trial has already been used
     * (whether active or expired). Does not require an organization.
     *
     * @protected -- requires isAuthenticated
     */
    activate: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: import("@/modules/trial").TrialStatus;
        meta: object;
    }>;
    /**
     * Get the current trial status for the authenticated user.
     *
     * Returns isEligible, isActive, usage counters, and limits.
     * Used by the frontend PlanProvider to drive the trial CTA and status banner.
     *
     * @protected -- requires isAuthenticated
     */
    status: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/trial").TrialStatus;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=trial.router.d.ts.map