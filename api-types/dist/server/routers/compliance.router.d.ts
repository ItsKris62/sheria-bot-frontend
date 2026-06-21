import { type SourceCitation } from '@/lib/source-grounding/citations';
/**
 * Compliance Router
 *
 * Handles compliance queries with RAG-powered answers, document search,
 * and compliance checking features.
 */
export declare const complianceRouter: import("@trpc/server").TRPCBuiltRouter<{
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
     * Submit compliance query with RAG
     *
     * @protected
     * @rate-limited
     */
    query: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            question: string;
            organizationType?: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE" | undefined;
            industry?: string | undefined;
            context?: string | undefined;
            answerDetail?: "standard" | "detailed" | undefined;
        };
        output: {
            queryId: any;
            answer: string;
            citations: SourceCitation[];
            confidence: number | null;
            suggestedFollowUps: never[];
            route: string;
            grounded: boolean;
            abstained: false;
            runId: string | null;
        } | {
            queryId: any;
            answer: string;
            citations: SourceCitation[];
            confidence: null;
            suggestedFollowUps: never[];
            route: string | null;
            grounded: boolean;
            abstained: boolean;
            runId: string | null;
        };
        meta: object;
    }>;
    /**
     * Follow-up query
     *
     * @protected
     * @rate-limited
     */
    followUp: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            originalQueryId: string;
            question: string;
        };
        output: {
            queryId: any;
            answer: string;
            citations: SourceCitation[];
        };
        meta: object;
    }>;
    /**
     * Search legal documents with RAG
     *
     * @protected
     */
    search: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            query: string;
            limit?: number | undefined;
            filter?: {
                documentType?: string | undefined;
                regulatoryArea?: string | undefined;
                dateFrom?: Date | undefined;
                dateTo?: Date | undefined;
            } | undefined;
        };
        output: {
            results: {
                text: any;
                source: any;
                section: any;
                score: any;
                documentId: any;
                authorityStatus: any;
                isBinding: any;
                sourceAuthority: any;
                version: any;
            }[];
            summary: {
                query: string;
                totalResults: number;
                documentsFound: string[];
                topSections: string[];
                citations: string[];
                avgScore: number;
            };
            totalResults: number;
        };
        meta: object;
    }>;
    /**
     * Get query history, scoped to the caller's active organization.
     *
     * @protected @org-member
     */
    history: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            queries: {
                id: string;
                query: string;
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                };
                createdAt: Date;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * Get query by ID
     *
     * @protected
     */
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            user: {
                id: string;
                email: string;
                fullName: string;
            };
        } & {
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            userId: string;
            query: string;
            status: string;
            organizationId: string | null;
            createdAt: Date;
            updatedAt: Date;
            regulatoryAreas: import("@prisma/client/runtime/client").JsonValue | null;
            recommendations: import("@prisma/client/runtime/client").JsonValue | null;
            confidence: number | null;
            summary: string | null;
            response: string | null;
            citations: import("@prisma/client/runtime/client").JsonValue | null;
            processingTimeMs: number | null;
            productCategory: string | null;
            regulations: import("@prisma/client/runtime/client").JsonValue | null;
            requirements: import("@prisma/client/runtime/client").JsonValue | null;
            gaps: import("@prisma/client/runtime/client").JsonValue | null;
        };
        meta: object;
    }>;
    getFollowUps: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            originalQueryId: string;
        };
        output: {
            followUps: any;
        };
        meta: object;
    }>;
    /**
     * Quick compliance check
     *
     * @protected
     * @rate-limited
     */
    quickCheck: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            scenario: string;
            organizationType: "OTHER" | "FINTECH" | "BANK" | "TELECOM" | "INSURANCE";
        };
        output: import("../../lib/ai/client").AICompletionResult;
        meta: object;
    }>;
    /**
     * Get compliance score for the user's organization
     *
     * @protected
     */
    getScore: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/compliance").ComplianceScore;
        meta: object;
    }>;
    /**
     * Get compliance score history
     *
     * @protected
     */
    getScoreHistory: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            days?: number | undefined;
        };
        output: import("@/modules/compliance").ScoreHistory[];
        meta: object;
    }>;
    /**
     * Get compliance recommendations
     *
     * @protected
     */
    getRecommendations: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: string[];
        meta: object;
    }>;
    /**
     * Get requirements for the organization
     *
     * @protected
     */
    getRequirements: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            status?: string | undefined;
            area?: string | undefined;
        };
        output: {
            requirements: import("@/modules/compliance").Requirement[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: object;
    }>;
    /**
     * Update a requirement's status
     *
     * @protected
     */
    updateRequirement: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            requirementId: string;
            status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "OVERDUE" | "WAIVED";
            notes?: string | undefined;
        };
        output: import("@/modules/compliance").Requirement;
        meta: object;
    }>;
    /**
     * Get upcoming compliance deadlines
     *
     * @protected
     */
    getDeadlines: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            daysAhead?: number | undefined;
        };
        output: import("@/modules/compliance").UpcomingDeadline[];
        meta: object;
    }>;
    /**
     * Generate a compliance roadmap
     *
     * @protected
     * @rate-limited
     */
    getRoadmap: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@/modules/compliance").ComplianceRoadmap;
        meta: object;
    }>;
    /**
     * Get personalised suggested queries for the active user.
     *
     * Builds 5 suggestions from five signal tiers (graceful degradation):
     * 1. Organization.industry -> curated template match
     * 2. User's recent query regulatory areas (last ~20)
     * 3. Most recent active RegulatoryAlert
     * 4. Cohort popular templates (same organizationType, >=5 distinct orgs, 30d)
     * 5. Curated baseline
     *
     * Result is cached per-user in Redis for 1 hour.
     *
     * @protected @org-member
     */
    getSuggestedQueries: import("@trpc/server").TRPCQueryProcedure<{
        input: Record<string, never>;
        output: {
            suggestions: {
                id: string;
                text: string;
                reason: "industry" | "history" | "alert" | "cohort" | "curated";
                relatedArea?: string;
            }[];
        };
        meta: object;
    }>;
    /**
     * Record a suggestion click for telemetry.
     *
     * Fire-and-forget from the frontend. Never blocks the user.
     *
     * @protected
     */
    recordSuggestionClick: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            suggestionId: string;
            suggestionText?: string | undefined;
            surface?: "other" | "empty_state" | "sidebar" | "dashboard" | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Submit or toggle feedback (thumbs up / thumbs down) on a compliance query.
     *
     * Toggle semantics (server-side):
     *  - No existing feedback  -> create with given rating
     *  - Existing same rating  -> delete (toggle off), return null
     *  - Existing diff rating  -> update to new rating
     *
     * @protected
     */
    submitFeedback: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            queryId: string;
            rating: "down" | "up";
        };
        output: {
            rating: "down" | "up" | null;
            action: "created" | "updated" | "cleared";
            tracked: boolean;
        };
        meta: object;
    }>;
    /**
     * Get the current user's feedback rating for a specific query.
     *
     * @protected
     */
    getFeedbackStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            queryId: string;
        };
        output: {
            rating: "up" | "down" | null;
        };
        meta: object;
    }>;
    /**
     * Toggle save/bookmark status for a compliance query response.
     *
     *  - Not saved -> save it, return { saved: true }
     *  - Already saved -> unsave it, return { saved: false }
     *
     * @protected
     */
    toggleSave: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            queryId: string;
            notes?: string | undefined;
        };
        output: {
            saved: boolean;
            savedAt: Date | null;
        };
        meta: object;
    }>;
    /**
     * Get save status for a specific query response.
     *
     * @protected
     */
    getSavedStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            queryId: string;
        };
        output: {
            saved: boolean;
            savedAt: Date | null;
            notes: string | null;
        };
        meta: object;
    }>;
    /**
     * List all saved responses for the current user, paginated.
     *
     * @protected
     */
    listSavedResponses: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            items: ({
                query: {
                    id: string;
                    query: string;
                    createdAt: Date;
                    response: string | null;
                };
            } & {
                id: string;
                userId: string;
                createdAt: Date;
                notes: string | null;
                queryId: string;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
        meta: object;
    }>;
    /**
     * Log a client-side PDF export to the audit log.
     * Called fire-and-forget from the frontend immediately after the print window opens.
     *
     * @protected
     */
    logExport: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            analysisId: string;
            format: "pdf" | "docx";
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    /**
     * Generate and upload a DOCX report for a completed gap analysis.
     * Returns a signed R2 download URL with 15-minute expiry.
     *
     * Gated: BUSINESS and ENTERPRISE plans only (requirePlanFeature('gapAnalysis') already
     * restricts to these tiers via the entitlements config).
     *
     * @protected
     */
    exportDocx: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            analysisId: string;
        };
        output: {
            downloadUrl: string;
            expiresAt: string;
            fileName: string;
        };
        meta: object;
    }>;
    /**
     * Export a completed compliance checklist as a DOCX file.
     *
     * Generates a professionally formatted Word document, uploads it to R2,
     * and returns a signed download URL with 15-minute expiry.
     *
     * Gated: STARTUP plan and above (same gate as generateChecklist).
     *
     * @protected
     */
    exportChecklistDocx: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            checklistId: string;
        };
        output: {
            downloadUrl: string;
            expiresAt: string;
            fileName: string;
        };
        meta: object;
    }>;
    /**
     * Export a compliance query as a DOCX file.
     *
     * Generates a Word document containing the question and AI response,
     * uploads it to R2, and returns a signed download URL with 1-hour expiry.
     *
     * @protected @org-member - gated on complianceQuery feature
     */
    exportQueryDocx: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            queryId: string;
        };
        output: {
            downloadUrl: string;
            expiresAt: string;
            fileName: string;
        };
        meta: object;
    }>;
    /**
     * Report a corpus gap for a compliance query that returned no grounded evidence.
     * Writes a CorpusGapFeedback row for the corpus expansion backlog.
     *
     * @protected -- orgMemberProcedure; queryId ownership verified against ctx.user.id
     */
    reportGap: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            queryId: string;
            runId: string | null;
            suggestedDocument?: string | undefined;
            notes?: string | undefined;
        };
        output: {
            feedbackId: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=compliance.router.d.ts.map