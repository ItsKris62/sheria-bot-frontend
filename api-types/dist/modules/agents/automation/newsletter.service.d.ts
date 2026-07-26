import { MarketingCampaignStatus } from '@prisma/client';
import { campaignService as defaultCampaignService } from '@/modules/marketing/campaign.service';
import { type AutomationApprovalService } from './approval.service';
export interface SendNewsletterInput {
    approvalId: string;
}
export interface SendNewsletterResult {
    campaignId: string;
    finalStatus: MarketingCampaignStatus;
    sent: number;
    skipped: number;
    failed: number;
}
type ApprovalServiceLike = Pick<AutomationApprovalService, 'getApproval' | 'requireMetadataField' | 'requireMetadataObjectField'>;
type CampaignServiceLike = Pick<typeof defaultCampaignService, 'create' | 'requestSendConfirmation' | 'executeSend' | 'getById'>;
type RedisLike = {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, opts?: {
        ex?: number;
        nx?: boolean;
    }): Promise<unknown>;
    del(key: string): Promise<unknown>;
};
export interface AutomationNewsletterServiceDependencies {
    approvalService?: ApprovalServiceLike;
    campaignService?: CampaignServiceLike;
    redis?: RedisLike;
}
/**
 * Wires the approval gate to a real send via the existing templated
 * MarketingCampaign pipeline (Phase B decision: templated merge, not raw
 * HTML - see KenyanComplianceBriefEmail / template-registry.ts).
 *
 * Confirmation-equivalence bridge: campaign.service.ts's requestSendConfirmation
 * -> executeSend two-step flow only checks that the same identity string
 * confirms and executes (campaign.service.ts's "same admin" check) within the
 * token TTL - neither is session-derived, so calling both back-to-back here
 * with the approving human's own decidedBy user id satisfies that check
 * trivially and keeps a real person (not a system principal) as the audit
 * trail for a compliance-relevant send.
 */
export declare class AutomationNewsletterService {
    private readonly approvalService;
    private readonly campaignService;
    private readonly redis;
    constructor(dependencies?: AutomationNewsletterServiceDependencies);
    sendNewsletter(input: SendNewsletterInput): Promise<SendNewsletterResult>;
    private replayResult;
}
export declare const automationNewsletterService: AutomationNewsletterService;
export {};
//# sourceMappingURL=newsletter.service.d.ts.map