/**
 * Auth Module Types
 * Type definitions for authentication operations
 */
type UserRole = string;
/**
 * Input for user registration
 */
export interface RegisterUserInput {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    organizationId?: string;
    phone?: string;
}
/**
 * Input for user login
 */
export interface LoginInput {
    email: string;
    password: string;
    rememberMe?: boolean;
}
/**
 * Input for password reset
 */
export interface ResetPasswordInput {
    token: string;
    newPassword: string;
}
/**
 * Input for password change
 */
export interface ChangePasswordInput {
    userId: string;
    oldPassword: string;
    newPassword: string;
}
/**
 * Authentication result returned after successful login/register
 */
export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: SafeUser;
    expiresIn: number;
    tokenType: 'Bearer';
}
/**
 * User data without sensitive fields
 */
export interface SafeUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    organizationId: string | null;
    emailVerified: boolean;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Token refresh result
 */
export interface TokenRefreshResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
/**
 * Password reset request result
 */
export interface PasswordResetRequestResult {
    success: boolean;
    message: string;
    expiresAt?: Date;
}
/**
 * Email verification result
 */
export interface EmailVerificationResult {
    success: boolean;
    message: string;
    user?: SafeUser;
}
/**
 * Session revocation result
 */
export interface SessionRevocationResult {
    success: boolean;
    sessionsRevoked: number;
    message: string;
}
/**
 * Session data stored in Redis
 */
export interface SessionData {
    userId: string;
    email: string;
    role: UserRole;
    organizationId: string | null;
    createdAt: string;
    expiresAt: string;
    userAgent?: string;
    ipAddress?: string;
}
/**
 * JWT payload structure
 */
export interface JWTPayload {
    sub: string;
    email: string;
    role: UserRole;
    organizationId: string | null;
    sessionId: string;
    iat: number;
    exp: number;
}
/**
 * Refresh token data stored in Redis
 */
export interface RefreshTokenData {
    userId: string;
    sessionId: string;
    createdAt: string;
    expiresAt: string;
    rotationCount: number;
}
/**
 * Login attempt tracking
 */
export interface LoginAttempt {
    email: string;
    attempts: number;
    lastAttempt: string;
    lockedUntil?: string;
}
/**
 * Password reset token data
 */
export interface PasswordResetToken {
    userId: string;
    email: string;
    createdAt: string;
    expiresAt: string;
}
/**
 * Email verification token data
 */
export interface EmailVerificationToken {
    userId: string;
    email: string;
    createdAt: string;
    expiresAt: string;
}
/**
 * Password history entry for preventing reuse
 */
export interface PasswordHistoryEntry {
    hash: string;
    createdAt: string;
}
export declare const AUTH_CONSTANTS: {
    readonly ACCESS_TOKEN_EXPIRY: number;
    readonly REFRESH_TOKEN_EXPIRY: number;
    readonly PASSWORD_RESET_EXPIRY: number;
    readonly EMAIL_VERIFICATION_EXPIRY: number;
    readonly MAX_LOGIN_ATTEMPTS: 5;
    readonly LOGIN_LOCKOUT_DURATION: number;
    readonly MAX_PASSWORD_RESET_REQUESTS: 3;
    readonly PASSWORD_RESET_WINDOW: number;
    readonly PASSWORD_HISTORY_COUNT: 3;
    readonly SESSION_EXPIRY: number;
    readonly REDIS_KEYS: {
        readonly SESSION: "session:";
        readonly REFRESH_TOKEN: "refresh_token:";
        readonly LOGIN_ATTEMPTS: "login_attempts:";
        readonly PASSWORD_RESET: "password_reset:";
        readonly EMAIL_VERIFICATION: "email_verification:";
        readonly PASSWORD_HISTORY: "password_history:";
    };
};
export declare class AuthError extends Error {
    code: AuthErrorCode;
    statusCode: number;
    constructor(message: string, code: AuthErrorCode, statusCode?: number);
}
export type AuthErrorCode = 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'EMAIL_ALREADY_EXISTS' | 'INVALID_TOKEN' | 'TOKEN_EXPIRED' | 'ACCOUNT_LOCKED' | 'EMAIL_NOT_VERIFIED' | 'PASSWORD_TOO_WEAK' | 'PASSWORD_RECENTLY_USED' | 'RATE_LIMIT_EXCEEDED' | 'SESSION_EXPIRED' | 'INVALID_REFRESH_TOKEN' | 'UNAUTHORIZED';
export {};
//# sourceMappingURL=auth.types.d.ts.map