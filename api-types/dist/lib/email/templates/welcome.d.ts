/**
 * Welcome email template parameters
 */
export interface WelcomeEmailParams {
    name: string;
    email: string;
    verificationUrl: string;
    role: string;
    organizationName?: string;
}
/**
 * Generate complete welcome email
 */
export declare function generateWelcomeEmail(params: WelcomeEmailParams): {
    html: string;
    text: string;
    subject: string;
};
//# sourceMappingURL=welcome.d.ts.map