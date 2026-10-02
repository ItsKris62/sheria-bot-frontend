/**
 * Policy Router
 *
 * Handles policy CRUD operations and AI-powered policy generation.
 * Includes export, refinement, and citation verification features.
 */
export declare const policyRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * List policies with pagination and filters
     *
     * @protected
     */
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            status?: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED" | undefined;
            regulatoryArea?: string | undefined;
            search?: string | undefined;
        };
        output: {
            policies: any;
            pagination: {
                page: number;
                limit: number;
                total: any;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * Get policy by ID with citations
     *
     * @protected
     */
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
        meta: object;
    }>;
    /**
     * Generate policy with AI
     *
     * @protected
     * @rate-limited
     */
    generate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            scenario: string;
            organizationType: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE";
            regulatoryAreas: string[];
            title?: string | undefined;
            specificRequirements?: string | undefined;
            targetAudience?: string | undefined;
        };
        output: {
            policyId: any;
            jobId: string;
            status: string;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Update policy
     *
     * @protected
     */
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title?: string | undefined;
            content?: string | undefined;
            status?: "DRAFT" | "GENERATING" | "COMPLETED" | "FAILED" | undefined;
            metadata?: Record<string, any> | undefined;
        };
        output: any;
        meta: object;
    }>;
    /**
     * Delete policy (soft delete)
     *
     * @protected
     */
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Export policy to PDF/DOCX
     *
     * @protected
     */
    export: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            format?: "PDF" | "DOCX" | "MD" | undefined;
        };
        output: {
            downloadUrl: string;
            filename: string;
            fileSize: number;
            expiresAt: string;
        };
        meta: object;
    }>;
    /**
     * Refine policy with AI
     *
     * @protected
     * @rate-limited
     */
    refine: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            refinementInstructions: string;
        };
        output: {
            success: boolean;
            policyId: any;
            version: any;
            message: string;
        };
        meta: object;
    }>;
    /**
     * Verify policy citations with AI
     *
     * @protected
     */
    verifyCitations: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            content: string;
            model: string;
            inputTokens: number;
            outputTokens: number;
            cost: number;
            citationCount: number;
            verified: number;
            failed: number;
        };
        meta: object;
    }>;
    /**
     * Get policy generation status (poll endpoint)
     *
     * Used by the frontend to poll status after calling `generate`.
     * Returns status + progress so the UI can show a progress bar.
     *
     * @protected
     */
    getStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            policyId: string;
        };
        output: {
            policyId: any;
            title: any;
            status: any;
            progress: number;
            isComplete: boolean;
            isFailed: boolean;
            errorMessage: any;
            generatedAt: any;
            tokensUsed: any;
            updatedAt: any;
        };
        meta: object;
    }>;
    /**
     * Get version history for a policy
     *
     * Returns the chain of versions linked via the parentId relation on Policy.
     *
     * @protected
     */
    getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            policyId: string;
        };
        output: {
            policyId: string;
            rootId: any;
            versions: any;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=policy.router.d.ts.map