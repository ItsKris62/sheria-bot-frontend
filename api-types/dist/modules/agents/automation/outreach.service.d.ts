import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type EmailOptions, type EmailResult } from '@/lib/email/client';
import { type AutomationApprovalService } from './approval.service';
type SendEmailFn = (options: EmailOptions) => Promise<EmailResult>;
type OutreachPrisma = Pick<typeof defaultPrisma, 'organization' | 'salesOutreachDraft'>;
export interface AutomationOutreachServiceDependencies {
    prisma?: OutreachPrisma;
    approvalService?: AutomationApprovalService;
    sendEmail?: SendEmailFn;
}
export interface QueueOutreachInput {
    approvalId: string;
    orgId: string;
    content: string;
}
export declare class AutomationOutreachService {
    private readonly prisma;
    private readonly approvalService;
    private readonly sendEmail;
    constructor(dependencies?: AutomationOutreachServiceDependencies);
    /**
     * Hard gate: approval must be 'approved' before anything sends - this is
     * customer-facing (per the brief, "treat the approval check as a hard
     * gate, not advisory"). approval.metadata must carry { draftId } pointing
     * at the SalesOutreachDraft this approval is for - queueOutreach's own
     * input has no subject field, and the draft is the only place a subject
     * line exists, so the link has to travel through metadata (same pattern as
     * publishContent's blogPostId). Reuses the existing sendEmail() primitive,
     * which already checks SuppressionList before sending - not a bespoke send
     * path that would bypass it.
     */
    queueOutreach(input: QueueOutreachInput): Promise<{
        orgId: string;
        sent: boolean;
        messageId?: string;
    }>;
}
export declare const automationOutreachService: AutomationOutreachService;
export {};
//# sourceMappingURL=outreach.service.d.ts.map