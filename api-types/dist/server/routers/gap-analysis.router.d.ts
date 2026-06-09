export declare const gapAnalysisRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Return the list of regulatory frameworks available to the current user.
     * Each framework carries a `locked` flag when the framework's tier exceeds
     * the user's current subscription plan.
     *
     * @protected
     */
    getFrameworks: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            slug: string;
            name: string;
            category: string;
            description: string | null;
            tier: string;
            locked: boolean;
        }[];
        meta: object;
    }>;
    /**
     * Run a full AI+RAG gap analysis on an uploaded policy document.
     *
     * Security: organizationId is derived exclusively from ctx.orgMembership
     * (set by requireOrgMembership via orgMemberProcedure) and never from the
     * request body, closing the IDOR that allowed cross-tenant org attribution.
     * Dedup key uses v2 namespace keyed on userId to prevent cross-tenant cache
     * poisoning with the same file hash.
     *
     * @protected @org-member @rate-limited
     */
    runGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            fileName: string;
            fileType: "pdf" | "docx" | "doc" | "txt";
            fileContent: string;
            regulatoryFrameworks: string[];
            benchmarkDocumentIds?: string[] | undefined;
            analysisDepth?: "quick" | "standard" | "deep" | undefined;
            focusAreas?: string[] | undefined;
        };
        output: {
            id: string;
            status: string;
            progress: number;
        };
        meta: object;
    }>;
    /**
     * List all gap analyses for the current user.
     *
     * @protected
     */
    getGapAnalyses: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            documentName: string;
            documentType: string;
            regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
            analysisDepth: string;
            overallScore: number | null;
            status: string;
            progress: number;
            errorMessage: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: object;
    }>;
    /**
     * Get a specific gap analysis result by ID.
     *
     * @protected
     */
    getGapAnalysisResult: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            documentName: string;
            documentType: string;
            documentUrl: string;
            regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
            analysisDepth: string;
            focusAreas: import("@prisma/client/runtime/client").JsonValue | null;
            results: import("../../lib/ai/prompts/gap-analysis").GapAnalysisResult | null;
            overallScore: number | null;
            status: string;
            progress: number;
            errorMessage: string | null;
            ragGrounded: boolean;
            chunksProcessed: number;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userName: string | null;
            organizationName: string | null;
        };
        meta: object;
    }>;
    /**
     * Returns the caller's per-tier gap analysis file size limit.
     */
    getGapAnalysisLimits: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            maxFileSizeMB: number;
        };
        meta: object;
    }>;
    /**
     * Delete a gap analysis record and its R2 file.
     *
     * @protected
     */
    deleteGapAnalysis: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=gap-analysis.router.d.ts.map