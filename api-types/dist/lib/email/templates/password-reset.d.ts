/**
 * Password reset email template parameters
 */
export interface PasswordResetEmailParams {
    name: string;
    email: string;
    resetUrl: string;
    expiresIn: string;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Generate complete password reset email
 */
export declare function generatePasswordResetEmail(params: PasswordResetEmailParams): {
    html: string;
    text: string;
    subject: string;
};
//# sourceMappingURL=password-reset.d.ts.map