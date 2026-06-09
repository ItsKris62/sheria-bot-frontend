import { z } from 'zod';
/**
 * Auth Schemas
 *
 * Zod validation schemas for authentication operations.
 * Reuses validation schemas from Phase 1 utilities.
 */
/**
 * Register new user
 *
 * @example
 * {
 *   email: "user@example.com",
 *   password: "SecurePass123!",
 *   name: "John Doe",
 *   role: "STARTUP",
 *   organizationId: "org_123" // optional
 * }
 */
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        ENTERPRISE: "ENTERPRISE";
    }>;
    companyName: z.ZodOptional<z.ZodString>;
    organizationId: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
/**
 * Login with email and password
 *
 * @example
 * {
 *   email: "user@example.com",
 *   password: "SecurePass123!"
 * }
 */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
/**
 * Request password reset
 *
 * @example
 * {
 *   email: "user@example.com"
 * }
 */
export declare const resetPasswordRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
/**
 * Reset password with token
 *
 * @example
 * {
 *   token: "reset_token_123",
 *   newPassword: "NewSecurePass123!"
 * }
 */
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
/**
 * Change password (authenticated)
 *
 * confirmPassword is validated both client-side and server-side.
 * The backend enforces the match so that a direct API call cannot bypass it.
 *
 * @example
 * {
 *   currentPassword: "OldPass123!",
 *   newPassword: "NewSecurePass123!",
 *   confirmPassword: "NewSecurePass123!"
 * }
 */
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
/**
 * Verify email with token
 *
 * @example
 * {
 *   token: "verify_token_123"
 * }
 */
export declare const verifyEmailSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
/**
 * Refresh access token
 *
 * @example
 * {
 *   refreshToken: "refresh_token_123"
 * }
 */
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
//# sourceMappingURL=auth.schema.d.ts.map