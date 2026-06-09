/**
 * Auth Module
 * Handles all authentication-related business logic for SheriaBot
 *
 * Operations:
 * - User registration with email verification
 * - User authentication with rate limiting
 * - Token refresh with rotation
 * - Password reset flow
 * - Email verification
 * - Password change with history tracking
 * - Session management
 */
import { type RegisterUserInput, type AuthResult, type TokenRefreshResult, type PasswordResetRequestResult, type EmailVerificationResult, type SessionRevocationResult, type SessionData } from './auth.types';
/**
 * Authentication Module Class
 * Encapsulates all authentication business logic
 */
declare class AuthModule {
    private readonly appUrl;
    constructor();
    /**
     * Register a new user
     * - Validates email uniqueness
     * - Validates password strength
     * - Creates user in database
     * - Sends verification email
     */
    registerUser(params: RegisterUserInput): Promise<AuthResult>;
    /**
     * Authenticate user with email and password
     * - Rate limits login attempts
     * - Tracks failed attempts
     * - Generates session and tokens
     */
    authenticateUser(email: string, password: string, options?: {
        userAgent?: string;
        ipAddress?: string;
    }): Promise<AuthResult>;
    /**
     * Refresh access token using refresh token
     * - Validates refresh token
     * - Rotates refresh token (security)
     * - Extends session
     */
    refreshToken(refreshTokenString: string): Promise<TokenRefreshResult>;
    /**
     * Request password reset
     * - Rate limited (3 per hour)
     * - Generates reset token
     * - Sends email
     */
    requestPasswordReset(email: string): Promise<PasswordResetRequestResult>;
    /**
     * Reset password with token
     * - Validates token
     * - Validates new password
     * - Checks password history
     * - Updates password
     * - Revokes all sessions
     */
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Verify user email with token
     */
    verifyEmail(token: string): Promise<EmailVerificationResult>;
    /**
     * Resend email verification
     */
    resendEmailVerification(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Change password for authenticated user
     */
    changePassword(userId: string, oldPassword: string, newPassword: string, currentSessionId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Revoke all user sessions (logout from all devices)
     */
    revokeAllSessions(userId: string): Promise<SessionRevocationResult>;
    /**
     * Revoke all sessions except the current one
     */
    revokeAllSessionsExcept(userId: string, currentSessionId: string): Promise<SessionRevocationResult>;
    /**
     * Logout user from current session
     */
    logout(sessionId: string, refreshTokenId?: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get user's active sessions
     */
    getActiveSessions(userId: string): Promise<SessionData[]>;
    private storeSession;
    private getSession;
    private extendSession;
    private storeRefreshToken;
    private getRefreshToken;
    private deleteRefreshToken;
    private getLoginAttempts;
    private recordFailedLoginAttempt;
    private clearLoginAttempts;
    private storePasswordResetToken;
    private getPasswordResetToken;
    private deletePasswordResetToken;
    private storeEmailVerificationToken;
    private getEmailVerificationToken;
    private deleteEmailVerificationToken;
    private getPasswordHistory;
    private addToPasswordHistory;
}
export declare const authModule: AuthModule;
export { AuthModule };
//# sourceMappingURL=auth.module.d.ts.map