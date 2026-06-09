/**
 * Auth Module Utilities
 * Helper functions for authentication operations
 */
import { z } from 'zod';
import type { SafeUser, SessionData } from './auth.types';
/**
 * Hash a password using scrypt
 * Returns format: salt:hash
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verify a password against a stored hash
 */
export declare function verifyPassword(password: string, storedHash: string): Promise<boolean>;
/**
 * Check if password was recently used
 */
export declare function isPasswordRecentlyUsed(password: string, passwordHistory: string[]): Promise<boolean>;
/**
 * Generate a random token (for reset tokens, verification tokens, etc.)
 */
export declare function generateToken(length?: number): string;
/**
 * Generate a session ID
 */
export declare function generateSessionId(): string;
/**
 * Generate a refresh token ID
 */
export declare function generateRefreshTokenId(): string;
/**
 * Email validation schema
 */
export declare const emailSchema: z.ZodString;
/**
 * Password validation schema with strength requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export declare const passwordSchema: z.ZodString;
/**
 * Validate password strength
 */
export declare function validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
};
/**
 * Create session data object
 */
export declare function createSessionData(user: SafeUser, options?: {
    userAgent?: string;
    ipAddress?: string;
}): SessionData;
/**
 * Check if session is expired
 */
export declare function isSessionExpired(session: SessionData): boolean;
/**
 * Strip sensitive fields from user object
 */
export declare function toSafeUser(user: {
    id: string;
    email: string;
    fullName?: string;
    name?: string;
    role: string;
    organizationId: string | null;
    emailVerified: boolean;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    password?: string | null;
    [key: string]: any;
}): SafeUser;
/**
 * Calculate remaining lockout time in seconds
 */
export declare function calculateLockoutRemaining(lockedUntil: string): number;
/**
 * Format lockout message
 */
export declare function formatLockoutMessage(remainingSeconds: number): string;
/**
 * Generate password reset email content
 */
export declare function generatePasswordResetEmail(name: string, resetUrl: string, expiresIn?: string): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate welcome email content
 */
export declare function generateWelcomeEmail(name: string, verificationUrl: string): {
    subject: string;
    text: string;
    html: string;
};
//# sourceMappingURL=auth.utils.d.ts.map