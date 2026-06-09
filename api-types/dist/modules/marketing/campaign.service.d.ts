/**
 * Campaign Service — Marketing Campaign Lifecycle + 2-Step Send Confirmation
 *
 * Manages the full lifecycle of a MarketingCampaign:
 *   - CRUD (create, getById, list, update, delete)
 *   - 2-step send confirmation (requestSendConfirmation → executeSend)
 *   - Campaign cancellation
 *   - Stats query for the admin detail page
 *
 * 2-step send flow:
 *   1. requestSendConfirmation — resolves recipients, enforces 25-cap,
 *      stores a short-lived Redis token, returns preview data to the UI.
 *   2. executeSend — validates the token, re-resolves recipients, iterates
 *      sequentially (NOT Promise.all), aggregates results, transitions status.
 *
 * The 25-recipient cap is enforced at BOTH steps (defense in depth).
 *
 * Audit actions:
 *   MARKETING_CAMPAIGN_CREATED | MARKETING_CAMPAIGN_UPDATED |
 *   MARKETING_CAMPAIGN_DELETED | MARKETING_CAMPAIGN_SENT |
 *   MARKETING_CAMPAIGN_CANCELLED
 */
import { MarketingCampaign, MarketingCampaignStatus, MarketingTemplateKey } from '@prisma/client';
import { BadRequestError } from '@/utils/error';
export declare class RecipientLimitError extends BadRequestError {
    readonly recipientCount: number;
    readonly limit: number;
    constructor(recipientCount: number, limit: number);
}
export interface CreateCampaignInput {
    name: string;
    subject: string;
    templateKey: MarketingTemplateKey;
    templateVariables: Record<string, unknown>;
    listId: string;
    createdById: string;
}
export interface UpdateCampaignInput {
    name?: string;
    subject?: string;
    templateVariables?: Record<string, unknown>;
    listId?: string;
    scheduledFor?: Date | null;
}
export interface CampaignListFilter {
    status?: MarketingCampaignStatus;
    createdById?: string;
    take?: number;
    skip?: number;
}
export interface CampaignStats {
    campaignId: string;
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
    sendsByStatus: Record<string, number>;
}
export declare class CampaignService {
    create(input: CreateCampaignInput): Promise<MarketingCampaign>;
    getById(id: string): Promise<MarketingCampaign | null>;
    list(filter: CampaignListFilter): Promise<{
        items: MarketingCampaign[];
        total: number;
    }>;
    update(id: string, input: UpdateCampaignInput, updatedById: string): Promise<MarketingCampaign>;
    delete(id: string, deletedById: string): Promise<void>;
    requestSendConfirmation(input: {
        campaignId: string;
        requestedById: string;
    }): Promise<{
        confirmationToken: string;
        recipientCount: number;
        estimatedDurationSeconds: number;
        expiresAt: Date;
        isAsync: boolean;
    }>;
    executeSend(input: {
        campaignId: string;
        confirmationToken: string;
        confirmedRecipientCount: number;
        executedById: string;
    }): Promise<{
        campaignId: string;
        finalStatus: MarketingCampaignStatus;
        sent: number;
        skipped: number;
        failed: number;
    }>;
    cancel(campaignId: string, cancelledById: string): Promise<void>;
    getStats(campaignId: string): Promise<CampaignStats>;
    getRecentSends(campaignId: string, take?: number): Promise<{
        id: string;
        contact: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        status: import("@prisma/client").$Enums.CampaignSendStatus;
        errorMessage: string | null;
        sentAt: Date | null;
        contactId: string;
        messageId: string | null;
        suppressionReason: import("@prisma/client").$Enums.SuppressionReason | null;
    }[]>;
    private requireCampaign;
}
export declare const campaignService: CampaignService;
//# sourceMappingURL=campaign.service.d.ts.map