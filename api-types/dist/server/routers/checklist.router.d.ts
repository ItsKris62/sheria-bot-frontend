export declare const checklistRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Generate an AI+RAG compliance checklist.
     * Requires authentication and active org membership. RBAC: STARTUP, ENTERPRISE, ADMIN.
     *
     * Security: organizationId is derived exclusively from ctx.orgMembership
     * (set by requireOrgMembership via orgMemberProcedure) and never from the
     * request body, closing the IDOR that allowed cross-tenant org attribution.
     *
     * @protected @org-member @rate-limited
     */
    generateChecklist: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productType: string;
            businessStage: string;
            targetSegments: string[];
            servicesOffered: string[];
            additionalConcerns?: string | undefined;
        };
        output: {
            id: string;
            title: string;
            status: string;
            checklistData: import("../../lib/ai/prompts/checklist-generation").GeneratedChecklist;
            itemProgress: Record<string, string>;
            progress: number;
            createdAt: Date;
        };
        meta: object;
    }>;
    /**
     * List all checklists for the current user scoped to their active organization.
     *
     * @protected @org-member
     */
    getUserChecklists: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            title: string;
            productType: string | null;
            businessStage: string | null;
            targetSegments: unknown;
            servicesOffered: unknown;
            additionalConcerns: string | null;
            progress: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            totalItems: number;
            criticalItems: number;
        }[];
        meta: object;
    }>;
    /**
     * Get a single checklist by ID, scoped to the caller's active organization.
     *
     * @protected @org-member
     */
    getChecklist: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            title: string;
            productType: string | null;
            businessStage: string | null;
            targetSegments: unknown;
            servicesOffered: unknown;
            additionalConcerns: string | null;
            checklistData: import("../../lib/ai/prompts/checklist-generation").GeneratedChecklist | null;
            itemProgress: Record<string, string>;
            progress: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        meta: object;
    }>;
    /**
     * @deprecated Use `updateChecklistItem` for normalized checklists (post-March 2026).
     * Kept for backward-compatibility with legacy JSON-blob checklists only.
     *
     * @protected
     * @middleware withPlanContext
     */
    updateChecklistProgress: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            checklistId: string;
            itemProgress: Record<string, "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED">;
        };
        output: {
            progress: number;
            itemProgress: Record<string, string>;
        };
        meta: object;
    }>;
    /**
     * Soft-delete a checklist (sets deletedAt; record is NOT destroyed).
     * Caller must own the checklist and be an active member of its organization.
     *
     * @protected @org-member
     * @middleware withPlanContext
     */
    deleteChecklist: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Fire-and-forget checklist generation.
     * Returns immediately with { checklistId, status: 'GENERATING' }.
     * Frontend must poll `getChecklistStatus` until status leaves GENERATING.
     *
     * @protected
     * @middleware withPlanContext + checkUsageLimit
     */
    generateChecklistAsync: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productType: string;
            businessStage: string;
            targetSegments: string[];
            servicesOffered: string[];
            additionalConcerns?: string | undefined;
        };
        output: import("@/modules/compliance/checklist.types").ChecklistGenerateResult;
        meta: object;
    }>;
    /**
     * Poll the status of a generating checklist.
     * Frontend should call every 3s until status !== 'GENERATING'.
     *
     * READ -- no plan gate.
     *
     * @protected
     */
    getChecklistStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            checklistId: string;
        };
        output: import("@/modules/compliance/checklist.types").ChecklistStatusResult;
        meta: object;
    }>;
    /**
     * List all checklists for the caller's organization (normalized path).
     * Excludes soft-deleted records.
     *
     * READ -- no plan gate.
     *
     * @protected
     */
    listChecklists: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/compliance/checklist.types").ChecklistSummary[];
        meta: object;
    }>;
    /**
     * Get full checklist detail with categories + items (normalized checklists only).
     *
     * READ -- no plan gate.
     *
     * @protected
     */
    getChecklistDetail: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            checklistId: string;
        };
        output: import("@/modules/compliance/checklist.types").ChecklistDetail;
        meta: object;
    }>;
    /**
     * Update a single normalized ChecklistItem's status and optional notes.
     *
     * @protected
     * @middleware withPlanContext
     */
    updateChecklistItem: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            checklistId: string;
            itemId: string;
            status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "NOT_APPLICABLE";
            notes?: string | undefined;
        };
        output: import("@/modules/compliance/checklist.types").UpdateItemResult;
        meta: object;
    }>;
    /**
     * Return the caller's checklist generation usage for the current period.
     *
     * READ -- no plan gate.
     *
     * @protected
     */
    getChecklistUsage: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            used: number;
            limit: number;
            period: "month" | "lifetime";
            planName: import("../../types/plan.types").EffectivePlan;
        };
        meta: object;
    }>;
    /**
     * Retry a FAILED checklist generation.
     * Resets the record to GENERATING and re-fires the pipeline.
     * Does NOT consume additional generation credits. Capped at 3 retries.
     *
     * @protected
     * @middleware withPlanContext -- no checkUsageLimit (no credit consumed on retry)
     */
    retryChecklist: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            checklistId: string;
        };
        output: {
            checklistId: string;
            status: "GENERATING";
            retryCount: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=checklist.router.d.ts.map