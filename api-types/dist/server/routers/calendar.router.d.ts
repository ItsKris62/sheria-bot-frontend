/**
 * Calendar Router
 *
 * Thin tRPC layer for the organisation-scoped Compliance Calendar.
 * All business logic lives in CalendarModule.
 *
 * All queries/mutations are scoped to ctx.user!.organizationId so no
 * org ID is required in the input  -  multi-tenant isolation is enforced here.
 */
export declare const calendarRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Create a new compliance event.
     * Requires complianceCalendar feature on the org's plan.
     */
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            dueDate: string;
            description?: string | undefined;
            priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
            category?: "CUSTOM" | "FILING" | "AUDIT" | "RENEWAL" | "REVIEW" | "REGULATORY_DEADLINE" | "DOCUMENT_EXPIRY" | "COMPLIANCE_TASK" | undefined;
            regulation?: string | undefined;
            recurrence?: "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | undefined;
            assigneeId?: string | undefined;
        };
        output: import("@/modules/calendar").CalendarEventRecord;
        meta: object;
    }>;
    /**
     * List events for the calendar grid  -  filtered by month/year and optional
     * status/priority filters.
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            month?: number | undefined;
            year?: number | undefined;
            status?: "COMPLETED" | "IN_PROGRESS" | "OVERDUE" | "UPCOMING" | undefined;
            priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        };
        output: import("@/modules/calendar").CalendarEventRecord[];
        meta: object;
    }>;
    /**
     * Fetch a single event by ID (org-scoped).
     */
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: import("@/modules/calendar").CalendarEventRecord;
        meta: object;
    }>;
    /**
     * Update an existing event (partial  -  only provided fields are changed).
     */
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            description?: string | undefined;
            dueDate?: string | undefined;
            priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
            status?: "COMPLETED" | "IN_PROGRESS" | "OVERDUE" | "UPCOMING" | undefined;
            category?: "CUSTOM" | "FILING" | "AUDIT" | "RENEWAL" | "REVIEW" | "REGULATORY_DEADLINE" | "DOCUMENT_EXPIRY" | "COMPLIANCE_TASK" | undefined;
            regulation?: string | undefined;
            recurrence?: "NONE" | "MONTHLY" | "QUARTERLY" | "ANNUALLY" | undefined;
            assigneeId?: string | undefined;
        };
        output: import("@/modules/calendar").CalendarEventRecord;
        meta: object;
    }>;
    /**
     * Hard-delete an event (org-scoped ownership check in module).
     */
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
        };
        meta: object;
    }>;
    /**
     * Upcoming deadlines for the sidebar (events due within daysAhead days).
     */
    upcoming: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            daysAhead?: number | undefined;
        };
        output: import("@/modules/calendar").CalendarEventRecord[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=calendar.router.d.ts.map