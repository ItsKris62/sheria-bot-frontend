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
import { MarketingCampaignStatus } from '@prisma/client';
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
                templateVariables: import("@prisma/client/runtime/client").JsonValue;
                scheduledFor: Date | null;
                segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
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
                templateKey: "PILOT_INVITATION" | "REGULATOR_ACCESS_PROGRAM" | "PRODUCT_LAUNCH" | "COMPLIANCE_UPDATE" | "WEBINAR_INVITE" | "RESOURCE_DOWNLOAD" | "GENERIC_MARKETING";
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
                templateVariables: import("@prisma/client/runtime/client").JsonValue;
                scheduledFor: Date | null;
                segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
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
                templateVariables: import("@prisma/client/runtime/client").JsonValue;
                scheduledFor: Date | null;
                segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
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
                templateVariables: import("@prisma/client/runtime/client").JsonValue;
                scheduledFor: Date | null;
                segmentFilter: import("@prisma/client/runtime/client").JsonValue | null;
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
                    companyId: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    primaryRegulator: string | null;
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
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
                companyId: string | null;
                firstName: string | null;
                lastName: string | null;
                primaryRegulator: string | null;
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
                companyId: string | null;
                firstName: string | null;
                lastName: string | null;
                primaryRegulator: string | null;
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
                companyId: string | null;
                firstName: string | null;
                lastName: string | null;
                primaryRegulator: string | null;
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
                    eventData: import("@prisma/client/runtime/client").JsonValue;
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
                    filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
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
                filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
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
                filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
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
                filterCriteria: import("@prisma/client/runtime/client").JsonValue | null;
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
                    metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
}>>;
//# sourceMappingURL=adminMarketing.router.d.ts.map