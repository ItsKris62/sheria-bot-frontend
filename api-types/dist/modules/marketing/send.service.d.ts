/**
 * Send Service — Per-Recipient Marketing Email Pipeline
 *
 * Executes a 10-step pipeline for each contact in a campaign:
 *   1.  Redis idempotency lock (NX, 24h TTL)
 *   2.  Suppression check
 *   3.  Consent verification
 *   4.  Generate unsubscribe token + URL (+ optional UTM)
 *   5.  Render template via registry
 *   6.  Build Resend payload
 *   7.  Call reactMailer.sendMarketingEmail()
 *   8.  Persist CampaignSend row
 *   9.  Write audit log
 *   10. Update Contact.lastEmailedAt
 *
 * NEVER throws from sendToContact() — all errors produce a typed result.
 * One failed contact must not abort the rest of the campaign.
 */
import { CampaignSendStatus, MarketingTemplateKey } from '@prisma/client';
import type { ContactWithCompany } from './list.service';
export interface SendCampaignToContactInput {
    campaignId: string;
    contact: ContactWithCompany;
    templateKey: MarketingTemplateKey;
    templateVariables: Record<string, unknown>;
    campaignName: string;
    subject: string;
}
export interface SendCampaignToContactResult {
    status: CampaignSendStatus;
    messageId?: string;
    errorMessage?: string;
}
export declare class SendService {
    /**
     * Execute the 10-step per-recipient send pipeline.
     * NEVER throws — all errors produce a typed SendCampaignToContactResult.
     */
    sendToContact(input: SendCampaignToContactInput): Promise<SendCampaignToContactResult>;
}
export declare const sendService: SendService;
//# sourceMappingURL=send.service.d.ts.map