import { Resend } from 'resend';
/**
 * Email send options
 */
export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
    }>;
    tags?: Array<{
        name: string;
        value: string;
    }>;
    /** Override the default From address. Used for marketing sends. */
    from?: string;
    /** Custom email headers (e.g., List-Unsubscribe for RFC 8058 compliance). */
    headers?: Record<string, string>;
}
/**
 * Email send result
 */
export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
/**
 * Initialize Resend client
 */
declare const resend: Resend;
/**
 * Send email using Resend
 * @param options Email options
 * @returns Email result
 *
 * @example
 * const result = await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome to SheriaBot',
 *   html: '<h1>Welcome!</h1>',
 *   text: 'Welcome!',
 * });
 */
export declare function sendEmail(options: EmailOptions): Promise<EmailResult>;
/**
 * Send email and throw error if fails
 * Useful for critical emails that must be sent
 * @param options Email options
 */
export declare function sendEmailOrThrow(options: EmailOptions): Promise<string>;
/**
 * Queue email for later sending
 * Useful for non-critical emails or when rate limited
 * @param options Email options
 * @param priority Higher priority emails sent first (default: 0)
 */
export declare function queueEmail(options: EmailOptions, priority?: number): Promise<void>;
/**
 * Process email queue
 * Should be called periodically by a job processor
 * @param batchSize Number of emails to process (default: 10)
 */
export declare function processEmailQueue(batchSize?: number): Promise<number>;
/**
 * Get email queue statistics
 */
export declare function getEmailQueueStats(): Promise<{
    pending: number;
    failed: number;
    recentSent: number;
}>;
/**
 * Get recent email logs
 * @param limit Number of logs to retrieve (default: 10)
 */
export declare function getRecentEmailLogs(limit?: number): Promise<unknown[]>;
/**
 * Clear failed email queue
 * Use with caution!
 */
export declare function clearFailedEmails(): Promise<void>;
export { resend };
//# sourceMappingURL=client.d.ts.map