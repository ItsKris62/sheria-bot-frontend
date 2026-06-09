/**
 * React Email Mailer Service
 *
 * Extends the existing email client with typed send methods for all
 * React Email templates. Each method:
 *   1. Checks notification preferences (for toggleable emails)
 *   2. Renders the React Email template to HTML
 *   3. Sends via Resend (using the existing sendEmail client)
 *   4. Logs the attempt
 *   5. Handles errors gracefully  -  email failures never crash the app
 */
import * as React from 'react';
import type { EmailResult } from './client';
import type { NewTicketAdminEmailProps, TicketConfirmationEmailProps, TicketStatusUpdateEmailProps, TicketResponseEmailProps, VerificationEmailProps, PasswordResetEmailProps, PasswordChangedEmailProps, WelcomeEmailProps, PaymentReceiptEmailProps, PaymentDueEmailProps, PaymentFailedEmailProps, PlanActivatedEmailProps, TrialEndingReminderEmailProps, SubscriptionCancelledEmailProps, PlanDowngradedEmailProps, ComplianceQueryReadyEmailProps, PolicyDocumentReadyEmailProps, DocumentIngestionCompleteEmailProps, RegulatoryAlertEmailProps, InvitationEmailProps, AccountApprovedEmailProps, AccountRejectedEmailProps, RoleChangeEmailProps, OrgVerifiedEmailProps, EnterpriseInquiryEmailProps, FreeTrialActivatedEmailProps, FreeTrialExpiringEmailProps, FreeTrialExpiredEmailProps, PilotWelcomeEmailProps, PilotDay3NudgeEmailProps, PilotDay7CheckinEmailProps, PilotDay10FeaturesEmailProps, PilotDay13WarningEmailProps, PilotExpiredEmailProps } from '@/emails';
declare class ReactMailerService {
    sendVerificationEmail(to: string, props: VerificationEmailProps): Promise<void>;
    sendPasswordResetEmail(to: string, props: PasswordResetEmailProps): Promise<void>;
    sendPasswordChangedEmail(to: string, props: PasswordChangedEmailProps): Promise<void>;
    sendWelcomeEmail(to: string, props: WelcomeEmailProps): Promise<void>;
    /** Mandatory  -  always sent */
    sendPaymentReceiptEmail(to: string, props: PaymentReceiptEmailProps): Promise<void>;
    /** Toggleable */
    sendPaymentDueEmail(to: string, userId: string, props: PaymentDueEmailProps): Promise<void>;
    /** Mandatory */
    sendPaymentFailedEmail(to: string, props: PaymentFailedEmailProps): Promise<void>;
    /** Mandatory  -  sent on checkout completion (trial start or direct subscription) */
    sendPlanActivatedEmail(to: string, props: PlanActivatedEmailProps): Promise<void>;
    /** Mandatory  -  sent when Stripe fires customer.subscription.trial_will_end */
    sendTrialEndingReminderEmail(to: string, props: TrialEndingReminderEmailProps): Promise<void>;
    /** Mandatory  -  sent on subscription cancellation (grace period begins) */
    sendSubscriptionCancelledEmail(to: string, props: SubscriptionCancelledEmailProps): Promise<void>;
    /** Mandatory  -  sent when grace period expires and plan is downgraded to free */
    sendPlanDowngradedEmail(to: string, props: PlanDowngradedEmailProps): Promise<void>;
    sendComplianceQueryReadyEmail(to: string, userId: string, props: ComplianceQueryReadyEmailProps): Promise<void>;
    sendPolicyDocumentReadyEmail(to: string, userId: string, props: PolicyDocumentReadyEmailProps): Promise<void>;
    sendRegulatoryAlertEmail(to: string, props: RegulatoryAlertEmailProps): Promise<void>;
    sendDocumentIngestionCompleteEmail(to: string, userId: string, props: DocumentIngestionCompleteEmailProps): Promise<void>;
    sendInvitationEmail(to: string, props: InvitationEmailProps): Promise<void>;
    sendAccountApprovedEmail(to: string, props: AccountApprovedEmailProps): Promise<void>;
    sendAccountRejectedEmail(to: string, props: AccountRejectedEmailProps): Promise<void>;
    sendRoleChangeEmail(to: string, props: RoleChangeEmailProps): Promise<void>;
    sendOrgVerifiedEmail(to: string, props: OrgVerifiedEmailProps): Promise<void>;
    sendNewTicketAdminEmail(to: string, props: NewTicketAdminEmailProps): Promise<void>;
    sendTicketConfirmationEmail(to: string, props: TicketConfirmationEmailProps): Promise<void>;
    sendTicketStatusUpdateEmail(to: string, props: TicketStatusUpdateEmailProps): Promise<void>;
    sendTicketResponseEmail(to: string, props: TicketResponseEmailProps): Promise<void>;
    /** Sent to the SheriaBot admin inbox when an org submits an Enterprise inquiry. */
    sendEnterpriseInquiryEmail(to: string, props: EnterpriseInquiryEmailProps): Promise<void>;
    /** Sent immediately when a user activates their 7-day free trial. */
    sendFreeTrialActivatedEmail(to: string, props: FreeTrialActivatedEmailProps): Promise<void>;
    /** Sent lazily when ≤ 2 days remain in the free trial (idempotent via Redis sentinel). */
    sendFreeTrialExpiringEmail(to: string, props: FreeTrialExpiringEmailProps): Promise<void>;
    /** Sent lazily after the free trial expires (idempotent via Redis sentinel). */
    sendFreeTrialExpiredEmail(to: string, props: FreeTrialExpiredEmailProps): Promise<void>;
    /** Sent immediately on pilot account creation via the provisioning script / cron. */
    sendPilotWelcomeEmail(to: string, props: PilotWelcomeEmailProps): Promise<void>;
    /** Sent on day 3 when the pilot user has not yet logged in (re-engagement nudge). */
    sendPilotDay3NudgeEmail(to: string, props: PilotDay3NudgeEmailProps): Promise<void>;
    /** Sent on day 7  -  mid-point check-in with optional survey link. */
    sendPilotDay7CheckinEmail(to: string, props: PilotDay7CheckinEmailProps): Promise<void>;
    /** Sent on day 10  -  highlights unused features with 4 days remaining. */
    sendPilotDay10FeaturesEmail(to: string, props: PilotDay10FeaturesEmailProps): Promise<void>;
    /** Sent on day 13  -  1-day expiry warning with conversion CTA. */
    sendPilotDay13WarningEmail(to: string, props: PilotDay13WarningEmailProps): Promise<void>;
    /** Sent after pilot expiry  -  thank you, data assurance, founding member offer, survey link. */
    sendPilotExpiredEmail(to: string, props: PilotExpiredEmailProps): Promise<void>;
    /**
     * Send a marketing email to a single contact.
     *
     * This method is the sole entry point for all bulk/marketing sends.
     * It does NOT throw — all errors are caught and returned as EmailResult.
     * The caller (send pipeline) is responsible for audit logging and status persistence.
     *
     * RFC 8058 compliance:
     *   - List-Unsubscribe header with tokenized URL + mailto variant
     *   - List-Unsubscribe-Post: List-Unsubscribe=One-Click
     *
     * PII policy:
     *   - Recipient email is NEVER logged at info level
     *   - contactId is used as the identifier in all log entries
     */
    sendMarketingEmail(opts: {
        to: string;
        subject: string;
        element: React.ReactElement;
        campaignId: string;
        contactId: string;
        unsubscribeUrl: string;
        unsubscribeMailto?: string;
        additionalTags?: Array<{
            name: string;
            value: string;
        }>;
    }): Promise<EmailResult>;
}
export declare const reactMailer: ReactMailerService;
export { ReactMailerService };
//# sourceMappingURL=react-mailer.service.d.ts.map