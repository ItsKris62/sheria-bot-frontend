/**
 * Usage Router
 *
 * tRPC procedures for per-organisation usage data.
 * All business logic is delegated to UsageTrackingService  -  this router
 * only handles input validation, calls the service, and formats errors.
 *
 * Procedures:
 *   usage.current       -  Current period summary (dashboard card)
 *   usage.history       -  Last N completed months (for period selector)
 *   usage.compare       -  Side-by-side comparison with a past period
 *   usage.periodDetail  -  Full breakdown for any single period (drill-down)
 */
export declare const usageRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Get the current billing period's usage summary.
     *
     * Returns period boundaries, days remaining, plan tier, and a per-category
     * breakdown (current / limit / percentUsed / available).
     *
     * Hot path: reads live Redis counters and triggers a non-blocking DB sync.
     * Frontend should set staleTime to ~60 s  -  usage changes infrequently per session.
     *
     * @protected  -  requires authentication + withPlanContext
     */
    current: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            period: {
                start: Date;
                end: Date;
                daysRemaining: number;
                daysTotal: number;
            };
            planTier: string;
            categories: {
                key: string;
                label: string;
                current: number;
                limit: number;
                available: boolean;
                percentUsed: number;
            }[];
        };
        meta: object;
    }>;
    /**
     * Get usage summaries for the last N completed months.
     *
     * "Completed" = any billing period before the current EAT calendar month.
     * Results are ordered newest -> oldest.
     * Reads entirely from the UsagePeriod DB table  -  no Redis access.
     *
     * Used to populate the comparison month selector in the UI.
     *
     * @protected  -  requires authentication
     */
    history: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            months?: number | undefined;
        };
        output: {
            periodId: string;
            periodStart: Date;
            periodEnd: Date;
            planTier: string;
            categories: {
                key: string;
                label: string;
                current: number;
                limit: number;
                available: boolean;
                percentUsed: number;
            }[];
        }[];
        meta: object;
    }>;
    /**
     * Compare the current period against a specific past period.
     *
     * `comparePeriodStart` must be the exact `periodStart` Date from a UsagePeriod
     * record (as returned by `usage.history`). Pass it as an ISO-8601 string;
     * Zod coerces it to Date.
     *
     * Returns current + previous summaries and a per-category change breakdown
     * with direction ("up" | "down" | "same") and change percentage.
     *
     * @protected  -  requires authentication
     */
    compare: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            comparePeriodStart: string;
        };
        output: {
            current: {
                periodId: string;
                periodStart: Date;
                periodEnd: Date;
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            };
            previous: {
                periodId: string;
                periodStart: Date;
                periodEnd: Date;
                planTier: string;
                categories: {
                    key: string;
                    label: string;
                    current: number;
                    limit: number;
                    available: boolean;
                    percentUsed: number;
                }[];
            };
            changes: {
                key: string;
                label: string;
                currentCount: number;
                previousCount: number;
                changePercent: number;
                direction: "down" | "up" | "same";
            }[];
        };
        meta: object;
    }>;
    /**
     * Get the full usage breakdown for a specific period by its DB record ID.
     *
     * Useful for drill-down views. Always reads from the DB snapshot  -  not Redis.
     * The current period's live counters are NOT reflected here; use `usage.current`
     * for the live view.
     *
     * @protected  -  requires authentication; org-scoped (cannot access another org's data)
     */
    periodDetail: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            periodId: string;
        };
        output: {
            periodId: string;
            periodStart: Date;
            periodEnd: Date;
            planTier: string;
            categories: {
                key: string;
                label: string;
                current: number;
                limit: number;
                available: boolean;
                percentUsed: number;
            }[];
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=usage.router.d.ts.map