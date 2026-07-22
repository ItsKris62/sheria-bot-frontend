export declare const agentsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    beginRun: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            agentType: string;
            idempotencyKey: string;
            organizationId?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
            estimatedCostUsd?: number | undefined;
        };
        output: import("@/modules/agents/agent-run.service").BeginAgentRunResult;
        meta: object;
    }>;
    getRun: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            runId: string;
        };
        output: ({
            error: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            status: string;
            organizationId: string | null;
            inputTokens: number;
            outputTokens: number;
            completedAt: Date | null;
            idempotencyKey: string;
            startedAt: Date;
            costUsd: import("@prisma/client-runtime-utils").Decimal;
            agentType: string;
            iterations: number;
        } & {
            reports: import(".prisma/client").AgentReport[];
        }) | null;
        meta: object;
    }>;
    advanceRun: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            runId: string;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            costUsd?: number | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        output: {
            error: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            status: string;
            organizationId: string | null;
            inputTokens: number;
            outputTokens: number;
            completedAt: Date | null;
            idempotencyKey: string;
            startedAt: Date;
            costUsd: import("@prisma/client-runtime-utils").Decimal;
            agentType: string;
            iterations: number;
        };
        meta: object;
    }>;
    completeRun: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            runId: string;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            costUsd?: number | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        output: {
            error: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            status: string;
            organizationId: string | null;
            inputTokens: number;
            outputTokens: number;
            completedAt: Date | null;
            idempotencyKey: string;
            startedAt: Date;
            costUsd: import("@prisma/client-runtime-utils").Decimal;
            agentType: string;
            iterations: number;
        };
        meta: object;
    }>;
    failRun: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            runId: string;
            error: string;
            metadata?: Record<string, unknown> | undefined;
        };
        output: {
            error: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            id: string;
            status: string;
            organizationId: string | null;
            inputTokens: number;
            outputTokens: number;
            completedAt: Date | null;
            idempotencyKey: string;
            startedAt: Date;
            costUsd: import("@prisma/client-runtime-utils").Decimal;
            agentType: string;
            iterations: number;
        };
        meta: object;
    }>;
    createReport: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            agentRunId: string;
            summary?: string | undefined;
            signals?: Record<string, unknown> | undefined;
            recommendedActions?: Record<string, unknown> | undefined;
            risks?: Record<string, unknown> | undefined;
            humanApproved?: boolean | undefined;
        };
        output: {
            id: string;
            createdAt: Date;
            summary: string | null;
            agentRunId: string;
            signals: import("@prisma/client/runtime/client").JsonValue | null;
            recommendedActions: import("@prisma/client/runtime/client").JsonValue | null;
            risks: import("@prisma/client/runtime/client").JsonValue | null;
            humanApproved: boolean;
        };
        meta: object;
    }>;
    marketing: import("@trpc/server").TRPCBuiltRouter<{
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
        runDrafting: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey?: string | undefined;
                maxSignals?: number | undefined;
            } | undefined;
            output: import("@/modules/agents/marketing/types").MarketingRunResult;
            meta: object;
        }>;
        listDrafts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: "DRAFT" | "DISMISSED" | "REVIEWED" | undefined;
                contentType?: "newsletter_item" | "linkedin_post" | undefined;
            };
            output: {
                drafts: import("@/modules/agents/marketing/types").PersistedMarketingDraft[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        getDraft: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                draftId: string;
            };
            output: import("@/modules/agents/marketing/types").PersistedMarketingDraft | null;
            meta: object;
        }>;
        reviewDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                draftId: string;
                status: "DISMISSED" | "REVIEWED";
                editedBody?: string | undefined;
            };
            output: import("@/modules/agents/marketing/types").PersistedMarketingDraft;
            meta: object;
        }>;
    }>>;
    regIntel: import("@trpc/server").TRPCBuiltRouter<{
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
        runScan: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey?: string | undefined;
                maxItems?: number | undefined;
            } | undefined;
            output: import("@/modules/agents/regulatory-intelligence/reg-intel.agent").RegIntelRunResult;
            meta: object;
        }>;
        getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("@/modules/agents/regulatory-intelligence/reg-intel.agent").LatestReportRow | null;
            meta: object;
        }>;
        listSignals: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                jurisdiction?: string | undefined;
                severity?: string | undefined;
                corpusGap?: boolean | undefined;
                status?: string | undefined;
            };
            output: {
                signals: import("@/modules/agents/regulatory-intelligence/reg-intel.agent").RegulatorySignalListRow[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        acknowledgeSignal: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                signalId: string;
            };
            output: import("@/modules/agents/regulatory-intelligence/reg-intel.agent").RegulatorySignalListRow;
            meta: object;
        }>;
    }>>;
    sales: import("@trpc/server").TRPCBuiltRouter<{
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
        runDrafting: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey?: string | undefined;
                maxProspects?: number | undefined;
            } | undefined;
            output: import("@/modules/agents/sales/types").SalesRunResult;
            meta: object;
        }>;
        listDrafts: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                status?: "DRAFT" | "QUEUED" | "DISMISSED" | "REVIEWED" | undefined;
            };
            output: {
                drafts: import("@/modules/agents/sales/types").PersistedSalesOutreachDraft[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
        getDraft: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                draftId: string;
            };
            output: import("@/modules/agents/sales/types").PersistedSalesOutreachDraft | null;
            meta: object;
        }>;
        reviewDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                draftId: string;
                status: "DISMISSED" | "REVIEWED";
                editedBody?: string | undefined;
            };
            output: import("@/modules/agents/sales/types").PersistedSalesOutreachDraft;
            meta: object;
        }>;
    }>>;
    automation: import("@trpc/server").TRPCBuiltRouter<{
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
        logEvent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                workflowKey: string;
                event: string;
                payload: Record<string, unknown>;
                executionId: string;
            };
            output: {
                received: true;
            };
            meta: object;
        }>;
        generate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                workflowKey: string;
                taskType: string;
                systemPrompt: string;
                userPrompt: string;
                maxTokens: number;
            };
            output: import("@/modules/agents/automation/automation.service").GenerateAutomationContentResult;
            meta: object;
        }>;
        getMetrics: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                department: string;
                window: string;
                jurisdictions?: string | undefined;
                detail?: string | undefined;
            };
            output: import("../../modules/agents/automation/metrics-types").GetMetricsResult;
            meta: object;
        }>;
        createApproval: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                department: string;
                workflow: string;
                kind: string;
                summary: string;
                callbackUrl: string;
                metadata: Record<string, unknown>;
            };
            output: {
                approvalId: string;
            };
            meta: object;
        }>;
        getApproval: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
            };
            output: {
                status: import("@/modules/agents/automation/approval.service").ApprovalStatus;
            };
            meta: object;
        }>;
        recordApprovalDecision: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
                decision: "approved" | "rejected";
            };
            output: {
                approvalId: string;
                status: import("@/modules/agents/automation/approval.service").ApprovalStatus;
            };
            meta: object;
        }>;
        listApprovals: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
                department?: string | undefined;
                workflow?: string | undefined;
                status?: "pending" | "approved" | "rejected" | undefined;
            };
            output: import("@/modules/agents/automation/approval.service").ListApprovalsResult;
            meta: object;
        }>;
        publishContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
                content: string;
            };
            output: {
                blogPostId: string;
                publishedAt: string;
            };
            meta: object;
        }>;
        queueContentCandidate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceItemId: string;
                title: string;
                score: number;
                jurisdiction: string;
            };
            output: {
                forwarded: boolean;
            };
            meta: object;
        }>;
        getRecentHighImpactRegulatoryItems: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                window: string;
                jurisdictions: string;
            };
            output: {
                items: import("@/modules/agents/automation/content.service").RegulatoryItem[];
            };
            meta: object;
        }>;
        getApprovedContentThisWeek: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                jurisdictions: string;
            };
            output: {
                items: import("@/modules/agents/automation/content.service").ApprovedContentItem[];
            };
            meta: object;
        }>;
        sendNewsletter: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
                html: string;
            };
            output: never;
            meta: object;
        }>;
        queueOutreach: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
                orgId: string;
                content: string;
            };
            output: {
                orgId: string;
                sent: boolean;
                messageId?: string;
            };
            meta: object;
        }>;
        getSources: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                jurisdictions: string;
            };
            output: {
                sources: import("@/modules/agents/automation/sources.service").SourceListItem[];
            };
            meta: object;
        }>;
        fetchSource: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                url: string;
                sourceId: string;
                jurisdiction: string;
            };
            output: {
                sourceId: string;
                normalizedContent: string;
                contentHash: string;
                fetchedAt: string;
            };
            meta: object;
        }>;
        dedupeSource: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contentHash: string;
                jurisdiction: string;
            };
            output: {
                isNew: boolean;
            };
            meta: object;
        }>;
        getPilotCohortStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                cohort: string;
                jurisdictions: string;
            };
            output: {
                orgs: import("@/modules/agents/automation/pilot-vendor.service").PilotCohortOrgStatus[];
            };
            meta: object;
        }>;
        getDpaVendorStatus: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                vendors: import("@/modules/agents/automation/pilot-vendor.service").DpaVendorStatus[];
                dataAvailable: boolean;
            };
            meta: object;
        }>;
    }>>;
    productBi: import("@trpc/server").TRPCBuiltRouter<{
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
        runReport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey?: string | undefined;
                windowDays?: number | undefined;
            } | undefined;
            output: import("../../modules/agents/product-bi/types").ProductBiRunResult;
            meta: object;
        }>;
        getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("@/modules/agents/product-bi/product-bi.agent").LatestReportRow | null;
            meta: object;
        }>;
        listReports: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                reports: import("@/modules/agents/product-bi/product-bi.agent").LatestReportRow[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
    }>>;
    securityOps: import("@trpc/server").TRPCBuiltRouter<{
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
        runReport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey?: string | undefined;
                windowDays?: number | undefined;
            } | undefined;
            output: import("../../modules/agents/security-ops/types").SecurityOpsRunResult;
            meta: object;
        }>;
        getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("@/modules/agents/security-ops/security-ops.agent").LatestReportRow | null;
            meta: object;
        }>;
        listReports: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                reports: import("@/modules/agents/security-ops/security-ops.agent").LatestReportRow[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
    }>>;
    chiefOfStaff: import("@trpc/server").TRPCBuiltRouter<{
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
        runBrief: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey?: string | undefined;
            } | undefined;
            output: import("../../modules/agents/chief-of-staff/types").ChiefOfStaffRunResult;
            meta: object;
        }>;
        getLatestReport: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("@/modules/agents/chief-of-staff/chief-of-staff.agent").LatestReportRow | null;
            meta: object;
        }>;
        listReports: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                page?: number | undefined;
                limit?: number | undefined;
            };
            output: {
                reports: import("@/modules/agents/chief-of-staff/chief-of-staff.agent").LatestReportRow[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
            meta: object;
        }>;
    }>>;
}>>;
//# sourceMappingURL=agents.router.d.ts.map