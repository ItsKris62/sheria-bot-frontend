/**
 * Email configuration for Resend
 * Handles email sending, templates, and rate limiting
 */
export declare const emailConfig: {
    /**
     * Resend API configuration
     */
    readonly api: {
        readonly key: string;
        readonly baseUrl: "https://api.resend.com";
    };
    /**
     * Email sender configuration
     */
    readonly from: {
        readonly email: string;
        readonly name: "SheriaBot";
    };
    /**
     * Email templates directory
     * All email templates stored here
     */
    readonly templates: {
        readonly dir: "src/lib/email/templates";
        readonly welcome: "welcome";
        readonly passwordReset: "password-reset";
        readonly emailVerification: "email-verification";
        readonly policyReady: "policy-ready";
        readonly complianceAlert: "compliance-alert";
        readonly organizationInvite: "organization-invite";
    };
    /**
     * Rate limiting for email sending
     * Prevents abuse and stays within Resend limits
     */
    readonly rateLimit: {
        readonly maxPerMinute: 5;
        readonly maxPerHour: 20;
        readonly maxPerDay: 100;
        readonly globalMaxPerMinute: 100;
        readonly globalMaxPerHour: 1000;
    };
    /**
     * Email queue configuration
     * Use Redis for queuing failed/delayed emails
     */
    readonly queue: {
        readonly enabled: true;
        readonly queueName: "email-queue";
        readonly retry: {
            readonly maxAttempts: 3;
            readonly backoff: {
                readonly type: "exponential";
                readonly delay: 5000;
            };
        };
        readonly failedRetention: 7;
    };
    /**
     * Email categories for tracking and filtering
     */
    readonly categories: {
        readonly TRANSACTIONAL: "transactional";
        readonly NOTIFICATION: "notification";
        readonly MARKETING: "marketing";
        readonly SYSTEM: "system";
    };
    /**
     * Email options and defaults
     */
    readonly defaults: {
        readonly replyTo: string;
        readonly tracking: boolean;
        readonly format: "html";
        readonly includePlainText: true;
        readonly timeout: 10000;
    };
    /**
     * Branding configuration for emails
     */
    readonly branding: {
        readonly logo: `${string}/assets/logo.png`;
        readonly primaryColor: "#10B981";
        readonly companyName: "SheriaBot";
        readonly companyAddress: "Nairobi, Kenya";
        readonly supportEmail: string;
        readonly websiteUrl: string;
    };
    /**
     * Email content configuration
     */
    readonly content: {
        readonly footer: "© 2024 SheriaBot. AI-Powered Regulatory Compliance for Kenya.";
        readonly unsubscribeText: "If you no longer wish to receive these emails, you can unsubscribe here.";
        readonly privacyPolicyUrl: `${string}/privacy`;
        readonly termsUrl: `${string}/terms`;
    };
    /**
     * Logging configuration
     */
    readonly logging: {
        readonly logSent: boolean;
        readonly logFailed: true;
        readonly logMetadataOnly: boolean;
    };
};
/**
 * Get full sender address in "Name <email>" format
 */
export declare function getSenderAddress(): string;
/**
 * Check if email rate limit exceeded
 * @param sentCount Number of emails sent in the time window
 * @param timeWindow 'minute' | 'hour' | 'day'
 * @returns true if limit exceeded
 */
export declare function isRateLimitExceeded(sentCount: number, timeWindow: 'minute' | 'hour' | 'day'): boolean;
/**
 * Get email template path
 * @param templateName Name of the template
 * @returns Full path to template file
 */
export declare function getTemplatePath(templateName: string): string;
/**
 * Export type
 */
export type EmailConfig = typeof emailConfig;
//# sourceMappingURL=email.config.d.ts.map