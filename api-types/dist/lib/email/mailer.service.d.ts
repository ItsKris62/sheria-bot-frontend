import { WelcomeEmailParams } from './templates/welcome';
import { PasswordResetEmailParams } from './templates/password-reset';
import { PolicyReadyEmailParams } from './templates/policy-ready';
import { ComplianceAlertEmailParams } from './templates/compliance-alert';
/**
 * High-level mailer service
 * Integrates email templates with sending logic
 */
export declare class MailerService {
    /**
     * Send welcome email with verification link
     * @param params Welcome email parameters
     * @param immediate Send immediately or queue (default: immediate)
     */
    sendWelcomeEmail(params: WelcomeEmailParams, immediate?: boolean): Promise<void>;
    /**
     * Send password reset email
     * @param params Password reset email parameters
     */
    sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void>;
    /**
     * Send policy ready notification email
     * @param params Policy ready email parameters
     * @param immediate Send immediately or queue (default: queue)
     */
    sendPolicyReadyEmail(params: PolicyReadyEmailParams, immediate?: boolean): Promise<void>;
    /**
     * Send compliance alert email
     * @param params Compliance alert email parameters
     */
    sendComplianceAlertEmail(params: ComplianceAlertEmailParams): Promise<void>;
    /**
     * Send generic notification email
     * @param to Recipient email
     * @param subject Email subject
     * @param message Email message (plain text)
     * @param htmlMessage Optional HTML message
     */
    sendNotificationEmail(to: string, subject: string, message: string, htmlMessage?: string): Promise<void>;
    /**
     * Send email to multiple recipients
     * @param recipients Array of email addresses
     * @param subject Email subject
     * @param html HTML content
     * @param text Plain text content
     */
    sendBulkEmail(recipients: string[], subject: string, html: string, text?: string): Promise<void>;
    /**
     * Wrap plain text in simple HTML template
     * @param message Plain text message
     * @returns HTML wrapped message
     */
    private wrapInTemplate;
    /**
     * Resolve the intended recipient without falling back to placeholder addresses.
     */
    private resolveRecipientEmail;
}
/**
 * Export singleton mailer service instance
 */
export declare const mailer: MailerService;
/**
 * Email service helper functions
 */
/**
 * Send test email (development only)
 * @param to Recipient email
 */
export declare function sendTestEmail(to: string): Promise<void>;
/**
 * Send verification email
 * Convenience wrapper for welcome email
 */
export declare function sendVerificationEmail(email: string, name: string, verificationToken: string, role: string): Promise<void>;
/**
 * Send password reset
 * Convenience wrapper for password reset email
 */
export declare function sendPasswordReset(email: string, name: string, resetToken: string, expiresIn?: string): Promise<void>;
//# sourceMappingURL=mailer.service.d.ts.map