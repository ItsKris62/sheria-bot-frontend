import type { EmailOptions, EmailResult } from '@/lib/email/client';
type SendEmail = (options: EmailOptions) => Promise<EmailResult>;
export interface ContentOpsAlertDependencies {
    sendEmail?: SendEmail;
}
export interface ContentOpsAlertInput {
    subject: string;
    summary: string;
    details?: string[];
    link?: string;
}
/**
 * Fixed-address email alert for automation-originated content events
 * (suggestion HIGH/URGENT priority, draft ready for verification) that have
 * no real logged-in session to notify via the in-app notificationModule.
 * Deliberately decoupled from any per-monitor/per-caller "who created this"
 * attribution: same shape and same recipient config as
 * security-ops/ops-alert.service.ts's SecurityOpsAlertService.sendAlert
 * (appConfig.marketing.adminNotificationEmail) - one fixed, always-live
 * inbox, not derived per-entity, so it keeps working if a source-monitor
 * creator's account is ever deactivated or a monitor is reassigned.
 */
export declare class ContentOpsAlertService {
    private readonly sendEmail;
    constructor(dependencies?: ContentOpsAlertDependencies);
    sendAlert(input: ContentOpsAlertInput): Promise<void>;
}
export declare const contentOpsAlertService: ContentOpsAlertService;
export {};
//# sourceMappingURL=content-ops-alert.service.d.ts.map