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
        leads: import("@trpc/server").TRPCBuiltRouter<{
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
            getDiscoverySources: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    jurisdiction?: string | undefined;
                } | undefined;
                output: import("../../modules/marketing/lead-discovery-sources").DiscoverySourceDefinition[];
                meta: object;
            }>;
            updateDiscoverySourceState: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    sourceId: string;
                    result: "FAILED" | "SUCCESS" | "SKIPPED_UNCHANGED";
                    contentFingerprint?: string | null | undefined;
                    processedCursor?: string | null | undefined;
                    recordIdentifier?: string | null | undefined;
                    sourceVersion?: string | null | undefined;
                    errorMessage?: string | null | undefined;
                    metadata?: Record<string, unknown> | undefined;
                };
                output: import("../../modules/marketing/lead-discovery-sources").DiscoverySourceState;
                meta: object;
            }>;
            getBudgetStatus: import("@trpc/server").TRPCQueryProcedure<{
                input: {
                    period?: string | undefined;
                } | undefined;
                output: {
                    period: string;
                    budgetUsd: number;
                    spentUsd: number;
                    reservedUsd: number;
                    remainingUsd: number;
                    percentUsed: number;
                    isHalted: boolean;
                    providers: Record<import("../../lib/ai/gateway/types").LLMProviderName, number>;
                };
                meta: object;
            }>;
            initDiscoveryRun: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    runIdempotencyKey: string;
                    workflowName?: string | undefined;
                    sourceAuthority?: string | null | undefined;
                    sourceUrl?: string | null | undefined;
                    jurisdiction?: string | undefined;
                    sourceSetId?: string | undefined;
                    metadata?: Record<string, unknown> | undefined;
                };
                output: {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: import(".prisma/client").$Enums.DiscoveryRunStatus;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    startedAt: Date;
                    sourceUrl: string;
                    sourceAuthority: string;
                    runIdempotencyKey: string;
                    workflowName: string;
                    totalDiscovered: number;
                    totalQualified: number;
                    totalDeduplicated: number;
                    totalRejected: number;
                    totalCreated: number;
                    totalUpdated: number;
                };
                meta: object;
            }>;
            ingestBatch: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    discoveryRunId: string;
                    batchId: string;
                    candidates: {
                        name: string;
                        primarySourceUrl: string;
                        domain?: string | null | undefined;
                        country?: string | undefined;
                        industry?: string | null | undefined;
                        regulatoryBody?: string | null | undefined;
                        licenceType?: string | null | undefined;
                        licenceNumber?: string | null | undefined;
                        licenceStatus?: string | null | undefined;
                        sizeClass?: "ENTERPRISE" | "MEDIUM" | "UNKNOWN" | "MICRO" | "SMALL" | "LARGE" | null | undefined;
                        primarySourceAuthority?: string | null | undefined;
                        confidence?: number | undefined;
                        hasComplianceObligation?: boolean | undefined;
                        operatesCrossBorder?: boolean | undefined;
                        handlesPersonalData?: boolean | undefined;
                        handlesCustomerFunds?: boolean | undefined;
                        hasNamedBuyerContact?: boolean | undefined;
                        buyerRoleIdentified?: boolean | undefined;
                        targetRoleTitle?: string | null | undefined;
                        recentRegulatoryEvent?: boolean | undefined;
                        recentLicensingDeadline?: boolean | undefined;
                        evidence?: {
                            field: string;
                            extractedValue: string;
                            sourceUrl: string;
                            normalizedValue?: string | null | undefined;
                            confidence?: number | undefined;
                            sourceAuthority?: string | null | undefined;
                            sourceRecordId?: string | null | undefined;
                            evidenceSnippet?: string | null | undefined;
                            verificationState?: "VERIFIED" | "UNVERIFIED" | "REJECTED" | "CONFLICTING" | undefined;
                            extractionMethod?: string | null | undefined;
                            modelProvider?: string | null | undefined;
                            modelName?: string | null | undefined;
                            extractorVersion?: string | null | undefined;
                        }[] | undefined;
                    }[];
                };
                output: import("@/modules/marketing/lead-ingestion.service").IngestBatchResult;
                meta: object;
            }>;
            completeDiscoveryRun: import("@trpc/server").TRPCMutationProcedure<{
                input: {
                    discoveryRunId: string;
                    status?: "COMPLETED" | "FAILED" | "RUNNING" | "PARTIALLY_COMPLETED" | undefined;
                    errorMessage?: string | undefined;
                    metadata?: Record<string, unknown> | undefined;
                };
                output: {
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
                    id: string;
                    status: import(".prisma/client").$Enums.DiscoveryRunStatus;
                    errorMessage: string | null;
                    completedAt: Date | null;
                    startedAt: Date;
                    sourceUrl: string;
                    sourceAuthority: string;
                    runIdempotencyKey: string;
                    workflowName: string;
                    totalDiscovered: number;
                    totalQualified: number;
                    totalDeduplicated: number;
                    totalRejected: number;
                    totalCreated: number;
                    totalUpdated: number;
                };
                meta: object;
            }>;
        }>>;
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
                idempotencyKey: string;
                reviewerEmail?: string | undefined;
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
                decidedBy: string | null;
                blogPost?: import("@/modules/agents/automation/approval.service").ApprovalBlogPostSummary;
            };
            meta: object;
        }>;
        recordApprovalDecision: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
                decision: "rejected" | "approved";
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
                status?: "rejected" | "pending" | "approved" | undefined;
            };
            output: import("@/modules/agents/automation/approval.service").ListApprovalsResult;
            meta: object;
        }>;
        listApprovalsForAutomation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                department?: string | undefined;
                workflow?: string | undefined;
                status?: "rejected" | "pending" | "approved" | undefined;
                limit?: number | undefined;
            };
            output: import("@/modules/agents/automation/approval.service").ListApprovalsResult;
            meta: object;
        }>;
        publishContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                approvalId: string;
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
        createDraftFromCandidate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceItemId: string;
            };
            output: import("@/modules/agents/automation/blog-draft.service").CreateDraftFromCandidateResult;
            meta: object;
        }>;
        generateDraftContent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                blogPostId: string;
                idempotencyKey: string;
            };
            output: import("@/modules/agents/automation/blog-draft.service").GenerateDraftContentResult;
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
            };
            output: import("@/modules/agents/automation/newsletter.service").SendNewsletterResult;
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
        shouldNotify: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                dedupeKey: string;
                ttlSeconds: number;
            };
            output: {
                shouldNotify: boolean;
            };
            meta: object;
        }>;
        triageEditorialCandidate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey: string;
                sourceItemId?: string | undefined;
                suggestionId?: string | undefined;
                regulatorySignalId?: string | undefined;
                forceRetriage?: boolean | undefined;
            };
            output: import("@/modules/blog-automation/editorial-triage.service").TriageEditorialCandidateResult;
            meta: object;
        }>;
        getEditorialTriage: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                triageRunId: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.BlogEditorialTriageStatus;
                createdAt: Date;
                urgency: import(".prisma/client").$Enums.BlogSuggestionPriority;
                version: number;
                errorMessage: string | null;
                completedAt: Date | null;
                sourceItemId: string | null;
                modelProvider: string | null;
                modelName: string | null;
                promptVersion: string;
                recommendation: import(".prisma/client").$Enums.BlogEditorialRecommendation;
                requiresHumanReview: boolean;
                suggestionId: string | null;
                agentRunId: string | null;
                deterministicScore: number;
                aiRelevanceScore: number | null;
                finalScore: number;
                targetAudiences: string[];
                recommendedArticleType: import(".prisma/client").$Enums.BlogArticleType | null;
                recommendedChannels: string[];
                rationale: string;
                sourceConfidence: number;
                inputHash: string;
            } | null;
            meta: object;
        }>;
        createResearchPack: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                idempotencyKey: string;
                blogPostId?: string | undefined;
                suggestionId?: string | undefined;
            };
            output: import("@/modules/blog-automation/research-pack.service").CreateResearchPackResult;
            meta: object;
        }>;
        getResearchPack: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                researchPackId?: string | undefined;
                blogPostId?: string | undefined;
            };
            output: ({
                id: string;
                status: import(".prisma/client").$Enums.BlogResearchPackStatus;
                createdAt: Date;
                executiveSummary: string | null;
                version: number;
                confidence: number;
                reviewedAt: Date | null;
                reviewedById: string | null;
                modelProvider: string | null;
                modelName: string | null;
                blogPostId: string | null;
                sourceSetHash: string;
                promptVersion: string;
                suggestionId: string | null;
                inputHash: string;
                researchObjective: string;
                importantDates: import("@prisma/client/runtime/client").JsonValue | null;
                authorities: import("@prisma/client/runtime/client").JsonValue | null;
                obligationsSummary: import("@prisma/client/runtime/client").JsonValue | null;
                evidenceGaps: string[];
                contradictions: import("@prisma/client/runtime/client").JsonValue | null;
                reviewerStatus: string | null;
            } & {
                sources: unknown[];
            }) | null;
            meta: object;
        }>;
        verifyBlogPostClaims: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                blogPostId: string;
                idempotencyKey: string;
                requestSecondReview?: boolean | undefined;
            };
            output: import("@/modules/blog-automation/semantic-verification.service").RunSemanticVerificationResult;
            meta: object;
        }>;
        getVerificationResult: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                verificationRunId?: string | undefined;
                blogPostId?: string | undefined;
            };
            output: ({
                issues: {
                    id: string;
                    title: string;
                    description: string;
                    severity: import(".prisma/client").$Enums.BlogVerificationIssueSeverity;
                    createdAt: Date;
                    confidence: number | null;
                    excerpt: string | null;
                    claimText: string | null;
                    sourceId: string | null;
                    sourceUrl: string | null;
                    runId: string;
                    issueType: import(".prisma/client").$Enums.BlogVerificationIssueType;
                    recommendation: string | null;
                    paragraphIndex: number | null;
                    sentenceIndex: number | null;
                    claimCategory: import(".prisma/client").$Enums.BlogClaimCategory | null;
                    claimVerificationStatus: import(".prisma/client").$Enums.BlogClaimVerificationStatus | null;
                    claimHash: string | null;
                    reviewProvenance: import("@prisma/client/runtime/client").JsonValue | null;
                }[];
            } & {
                id: string;
                status: import(".prisma/client").$Enums.BlogVerificationStatus;
                createdAt: Date;
                updatedAt: Date;
                summary: string | null;
                errorMessage: string | null;
                completedAt: Date | null;
                contentHash: string | null;
                startedAt: Date;
                blogPostId: string;
                draftGenerationRunId: string | null;
                runType: import(".prisma/client").$Enums.BlogVerificationRunType;
                qualityScore: number;
                sourceScore: number;
                claimRiskScore: number;
                jurisdictionScore: number;
                readinessScore: number;
                blockingIssueCount: number;
                warningIssueCount: number;
                infoIssueCount: number;
                recommendedAction: string | null;
                requestedById: string | null;
                sourceSetHash: string | null;
                promptVersion: string | null;
            }) | null;
            meta: object;
        }>;
        listFreshnessReviewCandidates: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                maxItems?: number | undefined;
            };
            output: import("@/modules/blog-automation/freshness-review.service").FreshnessCandidate[];
            meta: object;
        }>;
        runFreshnessReview: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                blogPostId: string;
                idempotencyKey: string;
            };
            output: import("@/modules/blog-automation/freshness-review.service").RunFreshnessReviewResult;
            meta: object;
        }>;
        createRevisionRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                blogPostId: string;
                reason: string;
                priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
                idempotencyKey: string;
                freshnessReviewId?: string | undefined;
                recommendedChanges?: Record<string, unknown> | undefined;
                evidence?: Record<string, unknown> | undefined;
            };
            output: import("@/modules/blog-automation/revision-request.service").CreateRevisionRequestResult;
            meta: object;
        }>;
        listEditorialMonitors: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                jurisdictions?: string | undefined;
                limit?: number | undefined;
            } | undefined;
            output: {
                monitors: {
                    id: string;
                    name: string;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    authorityType: import(".prisma/client").$Enums.BlogAuthorityType;
                    baseUrl: string;
                    sourceType: import(".prisma/client").$Enums.BlogSourceType;
                    lastCheckedAt: Date | null;
                    monitoringMethod: import(".prisma/client").$Enums.BlogMonitoringMethod;
                    feedUrl: string | null;
                }[];
            };
            meta: object;
        }>;
        runEditorialDiscovery: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                monitorId: string;
            };
            output: {
                status: string;
                message: string;
                itemsFound?: undefined;
                itemsCreated?: undefined;
                duplicateCount?: undefined;
                failureCount?: undefined;
                errorMessage?: undefined;
            } | {
                status: "FAILED" | "SUCCESS" | "PARTIAL_SUCCESS";
                itemsFound: number;
                itemsCreated: number;
                duplicateCount: number;
                failureCount: number;
                errorMessage: string | null;
                message?: undefined;
            };
            meta: object;
        }>;
        createBlogSuggestion: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceItemId: string;
                minScore?: number | undefined;
            };
            output: {
                createdSuggestion: boolean;
                scoringResult: import("../../modules/blog-automation/relevance-scoring.service").ScoringResult;
                suggestion: null;
                reason?: undefined;
            } | {
                createdSuggestion: boolean;
                scoringResult: import("../../modules/blog-automation/relevance-scoring.service").ScoringResult;
                suggestion: null;
                reason: string;
            } | {
                createdSuggestion: boolean;
                scoringResult: import("../../modules/blog-automation/relevance-scoring.service").ScoringResult;
                suggestion: {
                    id: string;
                    title: string;
                    status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    targetAudience: string[];
                    summary: string | null;
                    category: string;
                    jurisdictions: import(".prisma/client").$Enums.BlogJurisdiction[];
                    priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    reason: string | null;
                    approvedAt: Date | null;
                    relevanceScore: number;
                    blogPostId: string | null;
                    dismissedReason: string | null;
                    suggestedSlug: string | null;
                    articleType: import(".prisma/client").$Enums.BlogArticleType;
                    sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                    recommendedTags: string[];
                    suggestedNextAction: string | null;
                    requiresOfficialSource: boolean;
                    requiresHumanReview: boolean;
                    needsMoreSources: boolean;
                    dismissedAt: Date | null;
                    dismissedById: string | null;
                    approvedById: string | null;
                };
                reason?: undefined;
            };
            meta: object;
        }>;
        listBlogSuggestions: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                status?: "PENDING_REVIEW" | "DUPLICATE" | "DISMISSED" | "APPROVED_FOR_DRAFT" | "DRAFT_CREATED" | "NEEDS_MORE_SOURCES" | undefined;
                jurisdictions?: string | undefined;
                limit?: number | undefined;
            } | undefined;
            output: {
                suggestions: {
                    id: string;
                    title: string;
                    status: import(".prisma/client").$Enums.BlogSuggestionStatus;
                    createdAt: Date;
                    category: string;
                    priority: import(".prisma/client").$Enums.BlogSuggestionPriority;
                    jurisdiction: import(".prisma/client").$Enums.BlogJurisdiction;
                    relevanceScore: number;
                    blogPostId: string | null;
                    suggestedSlug: string | null;
                    articleType: import(".prisma/client").$Enums.BlogArticleType;
                    sourceQuality: import(".prisma/client").$Enums.BlogSourceQuality;
                    requiresHumanReview: boolean;
                }[];
            };
            meta: object;
        }>;
        generateEditorialDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                suggestionId: string;
                idempotencyKey: string;
            };
            output: import("@/modules/agents/automation/blog-draft.service").GenerateDraftFromSuggestionResult;
            meta: object;
        }>;
        listRegulatorySources: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                jurisdictions?: string | undefined;
                limit?: number | undefined;
            } | undefined;
            output: {
                sources: import("@/modules/agents/automation/regulatory-automation.service").RegulatorySourceOperationalItem[];
            };
            meta: object;
        }>;
        fetchRegulatorySource: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceId?: string | undefined;
                sourceKey?: string | undefined;
                executionMetadata?: Record<string, unknown> | undefined;
            };
            output: import("@/modules/regulatory-intelligence/domain/types").RegulatoryFetchResult;
            meta: object;
        }>;
        ingestRegulatorySnapshot: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceId: string;
                sourceUrl: string;
                rawPayload?: string | undefined;
                rawText?: string | undefined;
                rawStorageKey?: string | undefined;
                title?: string | undefined;
                httpStatus?: number | undefined;
                contentType?: string | undefined;
                etag?: string | undefined;
                lastModified?: string | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: import("@/modules/regulatory-intelligence/domain/types").SnapshotIngestResult;
            meta: object;
        }>;
        createRegulatorySourceItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                dedupeKey: string;
                sourceId: string;
                regulator: string;
                title: string;
                summary: string;
                primarySnapshotId?: string | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                officialTitle?: string | undefined;
                informationType?: "OTHER" | "CONSULTATION" | "DRAFT_REGULATION" | "CIRCULAR" | "NOTICE" | "GAZETTE_NOTICE" | "GUIDANCE" | "DIRECTIVE" | "LEGISLATIVE_UPDATE" | "POLICY_UPDATE" | "ENFORCEMENT" | "LICENSING_UPDATE" | "OFFICIAL_ANNOUNCEMENT" | "MARKET_DEVELOPMENT" | undefined;
                regulatoryStage?: "DRAFT" | "SUPERSEDED" | "CONSULTATION" | "PROPOSED" | "ANNOUNCED" | "ISSUED" | "GAZETTED" | "EFFECTIVE" | "DEVELOPING" | "WITHDRAWN" | undefined;
                verificationState?: "UNVERIFIED" | "SOURCE_VERIFIED" | "FACT_VERIFIED" | "REQUIRES_REVIEW" | "DISPUTED" | undefined;
                materiality?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                relevanceScore?: number | undefined;
                publicationDate?: string | undefined;
                effectiveDate?: string | undefined;
                consultationDeadline?: string | undefined;
                complianceDeadline?: string | undefined;
                affectedSectors?: string[] | undefined;
                affectedEntityTypes?: string[] | undefined;
                topics?: string[] | undefined;
                metadata?: Record<string, unknown> | undefined;
            };
            output: {
                id: string;
                dedupeKey: string;
                jurisdictionCode: string;
                regulator: string;
                title: string;
                informationType: import(".prisma/client").$Enums.RegulatoryInformationType;
                regulatoryStage: import(".prisma/client").$Enums.RegulatoryStage;
                materiality: import(".prisma/client").$Enums.RegulatoryMateriality;
                createdAt: string;
            };
            meta: object;
        }>;
        getRegulatorySourceItem: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                itemId: string;
            };
            output: {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                effectiveDate: Date | null;
                summary: string;
                jurisdictionCode: string;
                regulator: string;
                publicationDate: Date | null;
                supersededById: string | null;
                sourceId: string;
                dedupeKey: string;
                primarySnapshotId: string | null;
                officialTitle: string | null;
                informationType: import(".prisma/client").$Enums.RegulatoryInformationType;
                regulatoryStage: import(".prisma/client").$Enums.RegulatoryStage;
                verificationState: import(".prisma/client").$Enums.RegulatoryVerificationState;
                materiality: import(".prisma/client").$Enums.RegulatoryMateriality;
                relevanceScore: number | null;
                consultationDeadline: Date | null;
                complianceDeadline: Date | null;
                affectedSectors: import("@prisma/client/runtime/client").JsonValue;
                affectedEntityTypes: import("@prisma/client/runtime/client").JsonValue;
                topics: import("@prisma/client/runtime/client").JsonValue;
                firstDetectedAt: Date;
                lastObservedAt: Date;
            };
            meta: object;
        }>;
        listRegulatorySourceItems: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceId?: string | undefined;
                jurisdictionCode?: "KE" | "MW" | "RW" | "NG" | undefined;
                regulator?: string | undefined;
                informationType?: "OTHER" | "CONSULTATION" | "DRAFT_REGULATION" | "CIRCULAR" | "NOTICE" | "GAZETTE_NOTICE" | "GUIDANCE" | "DIRECTIVE" | "LEGISLATIVE_UPDATE" | "POLICY_UPDATE" | "ENFORCEMENT" | "LICENSING_UPDATE" | "OFFICIAL_ANNOUNCEMENT" | "MARKET_DEVELOPMENT" | undefined;
                regulatoryStage?: "DRAFT" | "SUPERSEDED" | "CONSULTATION" | "PROPOSED" | "ANNOUNCED" | "ISSUED" | "GAZETTED" | "EFFECTIVE" | "DEVELOPING" | "WITHDRAWN" | undefined;
                verificationState?: "UNVERIFIED" | "SOURCE_VERIFIED" | "FACT_VERIFIED" | "REQUIRES_REVIEW" | "DISPUTED" | undefined;
                materiality?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                limit?: number | undefined;
                offset?: number | undefined;
            };
            output: {
                items: import(".prisma/client").RegulatorySourceItem[];
                total: number;
            };
            meta: object;
        }>;
        createRegulatoryAlertDraft: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                sourceItemId: string;
                automationDraftKey: string;
                title?: string | undefined;
                summary?: string | undefined;
                body?: string | undefined;
                category?: string | undefined;
                severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
                effectiveDate?: string | undefined;
                expiresAt?: string | undefined;
                sourceUrl?: string | undefined;
            };
            output: {
                alertId: string;
                title: string;
                summary: string;
                jurisdictionCode: string;
                regulatoryBody: string;
                category: string;
                severity: string;
                isActive: boolean;
                automationDraftKey: string | null;
                primaryRegulatorySourceItemId: string | null;
                isNew: boolean;
            };
            meta: object;
        }>;
        getRegulatorySnapshot: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                snapshotId: string;
            };
            output: {
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                id: string;
                title: string | null;
                createdAt: Date;
                contentType: string | null;
                retrievedAt: Date;
                contentHash: string;
                sourceId: string;
                sourceUrl: string;
                canonicalUrl: string;
                hashVersion: number;
                normalizationVersion: number;
                contentLength: number;
                httpStatus: number | null;
                etag: string | null;
                lastModified: string | null;
                rawText: string | null;
                rawPayload: string | null;
                rawStorageKey: string | null;
            };
            meta: object;
        }>;
        processRegulatorySnapshot: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                snapshotId: string;
                correlationId?: string | undefined;
            };
            output: import("@/modules/regulatory-intelligence/domain/types").ProcessRegulatorySnapshotResult;
            meta: object;
        }>;
        listPendingRegulatorySnapshots: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                limit?: number | undefined;
            } | undefined;
            output: {
                snapshots: Array<{
                    id: string;
                    sourceId: string;
                    sourceKey: string;
                    jurisdictionCode: string;
                    regulatoryBody: string;
                    canonicalUrl: string;
                    retrievedAt: Date;
                }>;
                total: number;
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