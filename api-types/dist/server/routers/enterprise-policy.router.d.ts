type PolicySection = {
    id: string;
    title?: string;
    content?: unknown;
    contentMarkdown?: string;
    status?: string;
    wordCount?: number;
    editedAt?: string;
    editedByUserId?: string;
};
export declare const enterprisePolicyRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Creates a new GeneratedPolicy record in INITIALIZING state.
     *
     * Middleware chain:
     * 1. protectedProcedure  → ensures authenticated user
     * 2. rateLimited         → max 3 policy generations per 15-min window
     * 3. withPlanContext      → resolves ctx.plan to the effective subscription plan
     * 4. requirePlanFeature   → ENTERPRISE-only gate (policyGeneration)
     * 5. checkUsageLimit      → Redis monthly counter (deferred increment)
     *
     * @returns { policyId, status } — the frontend starts polling getStatus
     */
    createDraft: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            policyType: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_CFT" | "CONSUMER_PROTECTION" | "CUSTOM" | "IT_SECURITY";
            title: string;
            regulatoryFrameworks: string[];
            description?: string | undefined;
            targetAudience?: string | undefined;
            organizationType?: string | undefined;
            jurisdiction?: string | undefined;
            sourceGapAnalysisId?: string | undefined;
            sourceGapId?: string | undefined;
        };
        output: {
            policyId: string;
            status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
            title: string;
            policyType: string;
            jobId: string;
            createdAt: Date;
        };
        meta: object;
    }>;
    /**
     * Returns the current pipeline status and progress percentage.
     * Frontend polls this with refetchInterval: 2000 while !isComplete && !isFailed.
     */
    getStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            policyId: string;
        };
        output: {
            policyId: string;
            job: {
                id: string;
                status: string;
                updatedAt: Date;
                attempts: number;
                maxAttempts: number;
                lastError: string | null;
                events: {
                    type: string;
                    message: string | null;
                    createdAt: Date;
                    progress: number | null;
                }[];
            } | null;
            jobId: {} | null;
            status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
            progress: number;
            title: string;
            currentStage: string;
            isComplete: boolean;
            isFailed: boolean;
            errorMessage: string | null;
            updatedAt: Date;
        };
        meta: object;
    }>;
    /**
     * Fetches a single generated policy with all content, sections,
     * citations, and metadata. Used when the editor is loaded.
     */
    getPolicy: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            policyId: string;
        };
        output: {
            citations: {
                id: string;
                createdAt: Date;
                actName: string;
                section: string;
                subsection: string | null;
                textSnippet: string;
                confidence: string;
                verified: boolean;
                rawSource: import("@prisma/client/runtime/client").JsonValue | null;
                sectionId: string;
                generatedPolicyId: string;
                citationVerified: boolean | null;
                sourceSnapshotId: string | null;
            }[];
            sourceGapAnalysis: {
                id: string;
                documentName: string;
                regulatoryFrameworks: import("@prisma/client/runtime/client").JsonValue;
                overallScore: number | null;
            } | null;
        } & {
            id: string;
            title: string;
            description: string | null;
            userId: string;
            status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationType: string | null;
            executiveSummary: string | null;
            targetAudience: string | null;
            generationMetadata: import("@prisma/client/runtime/client").JsonValue | null;
            isLatestVersion: boolean;
            parentId: string | null;
            version: number;
            errorMessage: string | null;
            progress: number;
            completedAt: Date | null;
            regulatoryFrameworks: string[];
            ragGrounded: boolean;
            jurisdiction: string;
            reviewNotes: string | null;
            policyType: string;
            sourceGapAnalysisId: string | null;
            sourceGapId: string | null;
            tableOfContents: import("@prisma/client/runtime/client").JsonValue | null;
            sections: import("@prisma/client/runtime/client").JsonValue | null;
            lastExportedAt: Date | null;
            lastExportFormat: string | null;
        };
        meta: object;
    }>;
    /**
     * Returns a paginated list of generated policies for the current user's
     * organization.
     */
    listPolicies: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "COMPLETED" | "FAILED" | "ARCHIVED" | "INITIALIZING" | "OUTLINING" | "DRAFTING" | "REVIEWING" | undefined;
            policyType?: "DATA_PROTECTION" | "CYBERSECURITY" | "AML_CFT" | "CONSUMER_PROTECTION" | "CUSTOM" | "IT_SECURITY" | undefined;
            cursor?: string | undefined;
            limit?: number | undefined;
        };
        output: {
            items: {
                id: string;
                title: string;
                description: string | null;
                status: import("@prisma/client").$Enums.GeneratedPolicyStatus;
                createdAt: Date;
                updatedAt: Date;
                version: number;
                progress: number;
                completedAt: Date | null;
                regulatoryFrameworks: string[];
                jurisdiction: string;
                policyType: string;
                sourceGapAnalysisId: string | null;
                lastExportedAt: Date | null;
                lastExportFormat: string | null;
            }[];
            nextCursor: string | undefined;
            totalEstimate: number;
        };
        meta: object;
    }>;
    /**
     * Saves updated TipTap JSON content for a single policy section.
     * Called by the editor on auto-save (3-second debounce) or manual save.
     */
    updateSectionContent: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            policyId: string;
            sectionId: string;
            content: any;
            contentMarkdown?: string | undefined;
        };
        output: {
            success: boolean;
            section: PolicySection | undefined;
            version: number;
            updatedAt: Date;
        };
        meta: object;
    }>;
    updateSectionStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            policyId: string;
            sectionId: string;
            status: "DRAFT" | "APPROVED" | "REVIEWED" | "NEEDS_REVISION";
        };
        output: {
            success: boolean;
            section: PolicySection | undefined;
            version: number;
            updatedAt: Date;
        };
        meta: object;
    }>;
    getVersionHistory: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            policyId: string;
        };
        output: {
            sectionTitle: string;
            editedByName: string;
            id: string;
            createdAt: Date;
            version: number;
            sectionId: string;
            previousStatus: string | null;
            newStatus: string | null;
            editedByUserId: string;
        }[];
        meta: object;
    }>;
    /**
     * Soft-deletes a generated policy by setting deletedAt.
     */
    deletePolicy: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            policyId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    exportPolicy: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            policyId: string;
            format: "PDF" | "DOCX";
        };
        output: {
            downloadUrl: string;
            filename: string;
            expiresAt: string;
        };
        meta: object;
    }>;
}>>;
export {};
//# sourceMappingURL=enterprise-policy.router.d.ts.map