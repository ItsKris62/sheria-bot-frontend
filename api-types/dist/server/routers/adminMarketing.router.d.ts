/**
 * Admin Marketing Router — Phase B3
 *
 * All procedures require ADMIN role (via adminProcedure).
 *
 * Sub-routers:
 *   campaigns   — 12 procedures (10 from B2 + getJobStatus + duplicate)
 *   contacts    — 8 procedures
 *   lists       — 8 procedures
 *   suppression — 4 procedures
 *
 * Schema facts (from prisma/schema.prisma):
 *   - Contact: consentStatus = ContactConsentStatus, no jobTitle (use role), consentRecords relation
 *   - ContactList: isDynamic: Boolean (no type enum), no deletedAt (use soft-delete via updatedAt)
 *   - ContactListMembership: @@id([listId, contactId]), requires addedById
 *   - SuppressionList: addedAt (not createdAt)
 *   - EmailEvent: no contactId — linked via sendId → CampaignSend
 *   - ConsentRecord: action = ConsentAction enum
 *   - suppress() / recordConsent() are standalone functions (not class methods)
 */
import { MarketingCampaignStatus, type Prisma } from '@prisma/client';
export declare const adminMarketingRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    campaigns: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                status?: "CANCELLED" | "DRAFT" | "FAILED" | "SCHEDULED" | "SENDING" | "SENT" | "PARTIALLY_SENT" | undefined;
                createdById?: string | undefined;
                search?: string | undefined;
                take?: number | undefined;
                skip?: number | undefined;
            };
            output: {
                items: import(".prisma/client").MarketingCampaign[];
                total: number;
            };
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                errorMessage: string | null;
                subject: string;
                createdById: string;
                sentAt: Date | null;
                listId: string | null;
                templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                templateVariables: Prisma.JsonValue;
                scheduledFor: Date | null;
                segmentFilter: Prisma.JsonValue | null;
                totalRecipients: number;
                totalSent: number;
                totalDelivered: number;
                totalOpened: number;
                totalClicked: number;
                totalBounced: number;
                totalUnsubscribed: number;
                totalComplained: number;
                totalSuppressedSkip: number;
                totalNoConsentSkip: number;
                totalFailed: number;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                subject: string;
                templateKey: "PILOT_INVITATION" | "REGULATOR_ACCESS_PROGRAM" | "PRODUCT_LAUNCH" | "COMPLIANCE_UPDATE" | "WEBINAR_INVITE" | "RESOURCE_DOWNLOAD" | "GENERIC_MARKETING" | "KENYAN_COMPLIANCE_BRIEF";
                templateVariables: Record<string, unknown>;
                listId: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                errorMessage: string | null;
                subject: string;
                createdById: string;
                sentAt: Date | null;
                listId: string | null;
                templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                templateVariables: Prisma.JsonValue;
                scheduledFor: Date | null;
                segmentFilter: Prisma.JsonValue | null;
                totalRecipients: number;
                totalSent: number;
                totalDelivered: number;
                totalOpened: number;
                totalClicked: number;
                totalBounced: number;
                totalUnsubscribed: number;
                totalComplained: number;
                totalSuppressedSkip: number;
                totalNoConsentSkip: number;
                totalFailed: number;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                subject?: string | undefined;
                templateVariables?: Record<string, unknown> | undefined;
                listId?: string | undefined;
                scheduledFor?: string | null | undefined;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                errorMessage: string | null;
                subject: string;
                createdById: string;
                sentAt: Date | null;
                listId: string | null;
                templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                templateVariables: Prisma.JsonValue;
                scheduledFor: Date | null;
                segmentFilter: Prisma.JsonValue | null;
                totalRecipients: number;
                totalSent: number;
                totalDelivered: number;
                totalOpened: number;
                totalClicked: number;
                totalBounced: number;
                totalUnsubscribed: number;
                totalComplained: number;
                totalSuppressedSkip: number;
                totalNoConsentSkip: number;
                totalFailed: number;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        requestSendConfirmation: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                campaignId: string;
            };
            output: {
                confirmationToken: string;
                recipientCount: number;
                estimatedDurationSeconds: number;
                expiresAt: Date;
                isAsync: boolean;
            };
            meta: object;
        }>;
        executeSend: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                campaignId: string;
                confirmationToken: string;
                confirmedRecipientCount: number;
            };
            output: {
                campaignId: string;
                finalStatus: MarketingCampaignStatus;
                sent: number;
                skipped: number;
                failed: number;
            };
            meta: object;
        }>;
        cancel: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                campaignId: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getStats: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                campaignId: string;
            };
            output: import("@/modules/marketing/campaign.service").CampaignStats;
            meta: object;
        }>;
        getRecentSends: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                campaignId: string;
                take?: number | undefined;
            };
            output: {
                id: string;
                contact: {
                    email: string;
                    firstName: string | null;
                    lastName: string | null;
                };
                status: import(".prisma/client").$Enums.CampaignSendStatus;
                errorMessage: string | null;
                sentAt: Date | null;
                contactId: string;
                messageId: string | null;
                suppressionReason: import(".prisma/client").$Enums.SuppressionReason | null;
            }[];
            meta: object;
        }>;
        /** B3: Get the latest CampaignSendJob for a campaign (for async progress UI). */
        getJobStatus: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                campaignId: string;
            };
            output: {
                remaining: number;
                id: string;
                failed: number;
                status: import(".prisma/client").$Enums.CampaignSendJobStatus;
                createdAt: Date;
                updatedAt: Date;
                errorMessage: string | null;
                completedAt: Date | null;
                startedAt: Date | null;
                campaignId: string;
                totalContacts: number;
                processed: number;
                succeeded: number;
                skipped: number;
            } | null;
            meta: object;
        }>;
        /** Duplicate a campaign as a new DRAFT. */
        duplicate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                campaignId: string;
            };
            output: {
                id: string;
                status: import(".prisma/client").$Enums.MarketingCampaignStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                errorMessage: string | null;
                subject: string;
                createdById: string;
                sentAt: Date | null;
                listId: string | null;
                templateKey: import(".prisma/client").$Enums.MarketingTemplateKey;
                templateVariables: Prisma.JsonValue;
                scheduledFor: Date | null;
                segmentFilter: Prisma.JsonValue | null;
                totalRecipients: number;
                totalSent: number;
                totalDelivered: number;
                totalOpened: number;
                totalClicked: number;
                totalBounced: number;
                totalUnsubscribed: number;
                totalComplained: number;
                totalSuppressedSkip: number;
                totalNoConsentSkip: number;
                totalFailed: number;
            };
            meta: object;
        }>;
    }>>;
    contacts: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                search?: string | undefined;
                consentStatus?: "REVOKED" | "PENDING" | "GRANTED" | undefined;
                suppressed?: boolean | undefined;
                companyId?: string | undefined;
                take?: number | undefined;
                skip?: number | undefined;
            };
            output: {
                items: ({
                    company: {
                        id: string;
                        name: string;
                    } | null;
                } & {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    tags: string[];
                    notes: string | null;
                    createdById: string;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
                    linkedinUrl: string | null;
                    lastContactedAt: Date | null;
                    nextFollowUpAt: Date | null;
                    consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                    consentSource: string | null;
                    consentTimestamp: Date | null;
                    suppressedAt: Date | null;
                    suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                    lastEmailedAt: Date | null;
                    lastEmailOpenedAt: Date | null;
                })[];
                total: number;
            };
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                company: {
                    id: string;
                    name: string;
                } | null;
                consentRecords: {
                    metadata: Prisma.JsonValue | null;
                    id: string;
                    ipAddress: string | null;
                    userAgent: string | null;
                    action: import(".prisma/client").$Enums.ConsentAction;
                    source: string;
                    contactId: string;
                    occurredAt: Date;
                }[];
            } & {
                id: string;
                email: string;
                phone: string | null;
                role: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                tags: string[];
                notes: string | null;
                createdById: string;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                companyId: string | null;
                firstName: string | null;
                lastName: string | null;
                primaryRegulator: string | null;
                linkedinUrl: string | null;
                lastContactedAt: Date | null;
                nextFollowUpAt: Date | null;
                consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                consentSource: string | null;
                consentTimestamp: Date | null;
                suppressedAt: Date | null;
                suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                lastEmailedAt: Date | null;
                lastEmailOpenedAt: Date | null;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                firstName?: string | undefined;
                lastName?: string | undefined;
                phone?: string | undefined;
                role?: string | undefined;
                companyId?: string | undefined;
                grantConsent?: boolean | undefined;
            };
            output: {
                id: string;
                email: string;
                phone: string | null;
                role: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                tags: string[];
                notes: string | null;
                createdById: string;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                companyId: string | null;
                firstName: string | null;
                lastName: string | null;
                primaryRegulator: string | null;
                linkedinUrl: string | null;
                lastContactedAt: Date | null;
                nextFollowUpAt: Date | null;
                consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                consentSource: string | null;
                consentTimestamp: Date | null;
                suppressedAt: Date | null;
                suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                lastEmailedAt: Date | null;
                lastEmailOpenedAt: Date | null;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                firstName?: string | null | undefined;
                lastName?: string | null | undefined;
                phone?: string | null | undefined;
                role?: string | null | undefined;
                companyId?: string | null | undefined;
            };
            output: {
                id: string;
                email: string;
                phone: string | null;
                role: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                tags: string[];
                notes: string | null;
                createdById: string;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                companyId: string | null;
                firstName: string | null;
                lastName: string | null;
                primaryRegulator: string | null;
                linkedinUrl: string | null;
                lastContactedAt: Date | null;
                nextFollowUpAt: Date | null;
                consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                consentSource: string | null;
                consentTimestamp: Date | null;
                suppressedAt: Date | null;
                suppressedReason: import(".prisma/client").$Enums.SuppressionReason | null;
                lastEmailedAt: Date | null;
                lastEmailOpenedAt: Date | null;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        bulkImport: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contacts: {
                    email: string;
                    firstName?: string | undefined;
                    lastName?: string | undefined;
                    phone?: string | undefined;
                    role?: string | undefined;
                    companyName?: string | undefined;
                }[];
                grantConsent?: boolean | undefined;
            };
            output: {
                created: number;
                updated: number;
                skipped: number;
                errors: {
                    email: string;
                    error: string;
                }[];
            };
            meta: object;
        }>;
        recordConsent: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                contactId: string;
                action: "REVOKED" | "GRANTED" | "UPDATED" | "IMPORTED_LEGITIMATE_INTEREST";
                source: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        getEmailHistory: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                contactId: string;
                take?: number | undefined;
                skip?: number | undefined;
            };
            output: {
                items: ({
                    send: {
                        status: import(".prisma/client").$Enums.CampaignSendStatus;
                        sentAt: Date | null;
                        campaignId: string;
                    } | null;
                } & {
                    id: string;
                    eventType: import(".prisma/client").$Enums.EmailEventType;
                    messageId: string | null;
                    sendId: string | null;
                    eventData: Prisma.JsonValue;
                    occurredAt: Date;
                })[];
                total: number;
            };
            meta: object;
        }>;
    }>>;
    lists: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                take?: number | undefined;
                skip?: number | undefined;
            };
            output: {
                items: ({
                    _count: {
                        memberships: number;
                    };
                } & {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    createdById: string;
                    isDynamic: boolean;
                    filterCriteria: Prisma.JsonValue | null;
                })[];
                total: number;
            };
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                _count: {
                    memberships: number;
                };
                memberships: ({
                    contact: {
                        id: string;
                        email: string;
                        firstName: string | null;
                        lastName: string | null;
                    };
                } & {
                    listId: string;
                    contactId: string;
                    addedAt: Date;
                    addedById: string;
                })[];
            } & {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                createdById: string;
                isDynamic: boolean;
                filterCriteria: Prisma.JsonValue | null;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                description?: string | undefined;
                isDynamic?: boolean | undefined;
                filterCriteria?: Record<string, unknown> | undefined;
            };
            output: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                createdById: string;
                isDynamic: boolean;
                filterCriteria: Prisma.JsonValue | null;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                description?: string | null | undefined;
                filterCriteria?: Record<string, unknown> | undefined;
            };
            output: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                createdById: string;
                isDynamic: boolean;
                filterCriteria: Prisma.JsonValue | null;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        addMembers: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                listId: string;
                contactIds: string[];
            };
            output: {
                added: number;
                skipped: number;
            };
            meta: object;
        }>;
        removeMembers: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                listId: string;
                contactIds: string[];
            };
            output: {
                removed: number;
            };
            meta: object;
        }>;
        /**
         * Preview a dynamic list's recipient count/sample using the exact same filter
         * logic resolveContacts applies at send time (via buildDynamicContactWhere),
         * so a previewed count can never drift from what executeSend would actually resolve.
         */
        previewDynamic: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                filterCriteria: Record<string, unknown>;
            };
            output: {
                count: number;
                sample: {
                    id: string;
                    email: string;
                    firstName: string | null;
                    lastName: string | null;
                }[];
            };
            meta: object;
        }>;
        getMembers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                listId: string;
                take?: number | undefined;
                skip?: number | undefined;
            };
            output: {
                items: ({
                    contact: {
                        id: string;
                        email: string;
                        firstName: string | null;
                        lastName: string | null;
                        consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                        suppressedAt: Date | null;
                    };
                } & {
                    listId: string;
                    contactId: string;
                    addedAt: Date;
                    addedById: string;
                })[];
                total: number;
            };
            meta: object;
        }>;
    }>>;
    suppression: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                reason?: "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL" | undefined;
                take?: number | undefined;
                skip?: number | undefined;
            };
            output: {
                items: {
                    metadata: Prisma.JsonValue | null;
                    id: string;
                    email: string;
                    reason: import(".prisma/client").$Enums.SuppressionReason;
                    addedAt: Date;
                    addedById: string | null;
                }[];
                total: number;
            };
            meta: object;
        }>;
        add: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                reason: "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "MANUAL";
                note?: string | undefined;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        remove: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        check: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                email: string;
            };
            output: {
                isSuppressed: boolean;
                reason: import(".prisma/client").$Enums.SuppressionReason | null;
                addedAt: Date | null;
            };
            meta: object;
        }>;
    }>>;
    companies: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                query?: string | undefined;
                leadStatus?: "CONVERTED" | "APPROVED" | "UNASSESSED" | "DISCOVERED" | "QUALIFIED" | "PENDING_REVIEW" | "REJECTED" | "NURTURE" | "DO_NOT_CONTACT" | undefined;
                icpTier?: "UNASSESSED" | "TIER_1_CORE_FINTECH" | "TIER_2_HIGH_EXPOSURE" | "TIER_3_ADJACENT" | "NON_ICP" | undefined;
                salesStage?: "PROSPECT" | "LEAD_QUALIFIED" | "OUTREACH_PENDING" | "CONTACTED" | "ENGAGED" | "MEETING_SCHEDULED" | "DEMO_COMPLETED" | "TRIAL_ACTIVE" | "PILOT_ACTIVE" | "OPPORTUNITY" | "CLOSED_WON" | "CLOSED_LOST" | "DISQUALIFIED" | "UNRESPONSIVE" | undefined;
                origin?: "MANUAL_CRM" | "AI_DISCOVERY" | "PILOT_APPLICATION" | "CONTACT_IMPORT" | "INBOUND_LEAD" | undefined;
                country?: string | undefined;
                minScore?: number | undefined;
                maxScore?: number | undefined;
                take?: number | undefined;
                skip?: number | undefined;
                orderBy?: "createdAt" | "updatedAt" | "name" | "leadScore" | undefined;
                orderDir?: "asc" | "desc" | undefined;
            } | undefined;
            output: {
                items: ({
                    _count: {
                        evidence: number;
                        contacts: number;
                    };
                    reviewedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    owner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                } & {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                })[];
                total: number;
            };
            meta: object;
        }>;
        getById: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                _count: {
                    evidence: number;
                    contacts: number;
                };
                reviewedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                owner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                evidence: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    confidence: number;
                    retrievedAt: Date;
                    sourceUrl: string;
                    verificationState: import(".prisma/client").$Enums.EvidenceVerificationState;
                    companyId: string;
                    discoveryRunId: string | null;
                    field: string;
                    extractedValue: string;
                    normalizedValue: string | null;
                    sourceAuthority: string | null;
                    sourceRecordId: string | null;
                    evidenceSnippet: string | null;
                    evidenceHash: string;
                    extractionMethod: string | null;
                    modelProvider: string | null;
                    modelName: string | null;
                    extractorVersion: string | null;
                }[];
                contacts: {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    firstName: string | null;
                    lastName: string | null;
                    linkedinUrl: string | null;
                    consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                }[];
                discoveryRuns: ({
                    discoveryRun: {
                        id: string;
                        startedAt: Date;
                        sourceAuthority: string;
                        workflowName: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    action: string;
                    reason: string | null;
                    companyId: string;
                    discoveryRunId: string;
                    scoreAtRun: number | null;
                    icpTierAtRun: import(".prisma/client").$Enums.IcpTier | null;
                    leadStatusAtRun: import(".prisma/client").$Enums.LeadStatus | null;
                })[];
            } & {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                domain?: string | null | undefined;
                industry?: string | null | undefined;
                country?: string | undefined;
                regulatorMix?: string[] | undefined;
                regulatoryBody?: string | null | undefined;
                licenceType?: string | null | undefined;
                licenceNumber?: string | null | undefined;
                licenceStatus?: string | null | undefined;
                notes?: string | null | undefined;
                ownerId?: string | null | undefined;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                name?: string | undefined;
                domain?: string | null | undefined;
                industry?: string | null | undefined;
                country?: string | undefined;
                regulatorMix?: string[] | undefined;
                regulatoryBody?: string | null | undefined;
                licenceType?: string | null | undefined;
                licenceNumber?: string | null | undefined;
                licenceStatus?: string | null | undefined;
                notes?: string | null | undefined;
                leadStatus?: "CONVERTED" | "APPROVED" | "UNASSESSED" | "DISCOVERED" | "QUALIFIED" | "PENDING_REVIEW" | "REJECTED" | "NURTURE" | "DO_NOT_CONTACT" | undefined;
                salesStage?: "PROSPECT" | "LEAD_QUALIFIED" | "OUTREACH_PENDING" | "CONTACTED" | "ENGAGED" | "MEETING_SCHEDULED" | "DEMO_COMPLETED" | "TRIAL_ACTIVE" | "PILOT_ACTIVE" | "OPPORTUNITY" | "CLOSED_WON" | "CLOSED_LOST" | "DISQUALIFIED" | "UNRESPONSIVE" | undefined;
                icpTier?: "UNASSESSED" | "TIER_1_CORE_FINTECH" | "TIER_2_HIGH_EXPOSURE" | "TIER_3_ADJACENT" | "NON_ICP" | undefined;
                leadScore?: number | null | undefined;
                sizeClass?: "ENTERPRISE" | "MEDIUM" | "UNKNOWN" | "MICRO" | "SMALL" | "LARGE" | undefined;
                ownerId?: string | null | undefined;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
            meta: object;
        }>;
        merge: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                primaryCompanyId: string;
                secondaryCompanyId: string;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
    }>>;
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
        listReviewQueue: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                leadStatus?: "CONVERTED" | "APPROVED" | "UNASSESSED" | "DISCOVERED" | "QUALIFIED" | "PENDING_REVIEW" | "REJECTED" | "NURTURE" | "DO_NOT_CONTACT" | undefined;
                icpTier?: "UNASSESSED" | "TIER_1_CORE_FINTECH" | "TIER_2_HIGH_EXPOSURE" | "TIER_3_ADJACENT" | "NON_ICP" | undefined;
                country?: string | undefined;
                take?: number | undefined;
                skip?: number | undefined;
            } | undefined;
            output: {
                items: ({
                    _count: {
                        evidence: number;
                        contacts: number;
                    };
                    reviewedBy: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                    owner: {
                        id: string;
                        email: string;
                        fullName: string;
                    } | null;
                } & {
                    origin: import(".prisma/client").$Enums.CompanyOrigin;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    industry: string | null;
                    confidence: number | null;
                    regulatoryBody: string | null;
                    notes: string | null;
                    domain: string | null;
                    reviewedAt: Date | null;
                    createdById: string;
                    regulatorMix: string[];
                    leadStatus: import(".prisma/client").$Enums.LeadStatus;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    icpTier: import(".prisma/client").$Enums.IcpTier;
                    leadScore: number | null;
                    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                    country: string;
                    licenceType: string | null;
                    licenceNumber: string | null;
                    licenceStatus: string | null;
                    primarySourceUrl: string | null;
                    primarySourceAuthority: string | null;
                    discoveredAt: Date | null;
                    lastVerifiedAt: Date | null;
                    reviewReason: string | null;
                    rejectionReason: string | null;
                    ownerId: string | null;
                    reviewedById: string | null;
                })[];
                total: number;
            };
            meta: object;
        }>;
        getReviewDetail: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                companyId: string;
            };
            output: {
                _count: {
                    evidence: number;
                    contacts: number;
                };
                reviewedBy: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                owner: {
                    id: string;
                    email: string;
                    fullName: string;
                } | null;
                evidence: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    confidence: number;
                    retrievedAt: Date;
                    sourceUrl: string;
                    verificationState: import(".prisma/client").$Enums.EvidenceVerificationState;
                    companyId: string;
                    discoveryRunId: string | null;
                    field: string;
                    extractedValue: string;
                    normalizedValue: string | null;
                    sourceAuthority: string | null;
                    sourceRecordId: string | null;
                    evidenceSnippet: string | null;
                    evidenceHash: string;
                    extractionMethod: string | null;
                    modelProvider: string | null;
                    modelName: string | null;
                    extractorVersion: string | null;
                }[];
                contacts: {
                    id: string;
                    email: string;
                    phone: string | null;
                    role: string | null;
                    createdAt: Date;
                    salesStage: import(".prisma/client").$Enums.SalesStage;
                    firstName: string | null;
                    lastName: string | null;
                    linkedinUrl: string | null;
                    consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
                }[];
                discoveryRuns: ({
                    discoveryRun: {
                        id: string;
                        startedAt: Date;
                        sourceAuthority: string;
                        workflowName: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    action: string;
                    reason: string | null;
                    companyId: string;
                    discoveryRunId: string;
                    scoreAtRun: number | null;
                    icpTierAtRun: import(".prisma/client").$Enums.IcpTier | null;
                    leadStatusAtRun: import(".prisma/client").$Enums.LeadStatus | null;
                })[];
            } & {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        approveLead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                companyId: string;
                reviewReason?: string | undefined;
                addToListId?: string | undefined;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        rejectLead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                companyId: string;
                rejectionReason: string;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        nurtureLead: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                companyId: string;
                reason?: string | undefined;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        requestResearch: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                companyId: string;
                researchNotes: string;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
        doNotContact: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                companyId: string;
                reason?: string | undefined;
            };
            output: {
                origin: import(".prisma/client").$Enums.CompanyOrigin;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                industry: string | null;
                confidence: number | null;
                regulatoryBody: string | null;
                notes: string | null;
                domain: string | null;
                reviewedAt: Date | null;
                createdById: string;
                regulatorMix: string[];
                leadStatus: import(".prisma/client").$Enums.LeadStatus;
                salesStage: import(".prisma/client").$Enums.SalesStage;
                icpTier: import(".prisma/client").$Enums.IcpTier;
                leadScore: number | null;
                sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
                country: string;
                licenceType: string | null;
                licenceNumber: string | null;
                licenceStatus: string | null;
                primarySourceUrl: string | null;
                primarySourceAuthority: string | null;
                discoveredAt: Date | null;
                lastVerifiedAt: Date | null;
                reviewReason: string | null;
                rejectionReason: string | null;
                ownerId: string | null;
                reviewedById: string | null;
            };
            meta: object;
        }>;
    }>>;
}>>;
//# sourceMappingURL=adminMarketing.router.d.ts.map