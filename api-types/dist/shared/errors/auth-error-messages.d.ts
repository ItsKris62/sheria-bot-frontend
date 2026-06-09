/**
 * Centralized Auth Error Messages
 *
 * Single source of truth for all auth-related error codes and their
 * corresponding user-facing messages.
 *
 * SECURITY RULES enforced here:
 * - Login/signup errors never reveal whether a specific email exists.
 * - Password reset always returns the same message regardless of email existence.
 * - Rate-limit messages include retry guidance without exposing attempt counts.
 * - Server errors never expose stack traces or internal details.
 */
export declare const AUTH_ERROR_CODES: {
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly SESSION_EXPIRED: "SESSION_EXPIRED";
    readonly ACCOUNT_DEACTIVATED: "ACCOUNT_DEACTIVATED";
    readonly EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    readonly ACCOUNT_PENDING_APPROVAL: "ACCOUNT_PENDING_APPROVAL";
    readonly ACCOUNT_NOT_ACTIVE: "ACCOUNT_NOT_ACTIVE";
    readonly EMAIL_UNAVAILABLE: "EMAIL_UNAVAILABLE";
    readonly FREE_EMAIL_NOT_ALLOWED: "FREE_EMAIL_NOT_ALLOWED";
    readonly REGULATOR_EMAIL_REQUIRED: "REGULATOR_EMAIL_REQUIRED";
    readonly REGISTRATION_FAILED: "REGISTRATION_FAILED";
    readonly WEAK_PASSWORD: "WEAK_PASSWORD";
    readonly COMMON_PASSWORD: "COMMON_PASSWORD";
    readonly PASSWORD_CONTAINS_EMAIL: "PASSWORD_CONTAINS_EMAIL";
    readonly PASSWORD_HAS_SEQUENCES: "PASSWORD_HAS_SEQUENCES";
    readonly PASSWORD_MISMATCH: "PASSWORD_MISMATCH";
    readonly INVALID_RESET_TOKEN: "INVALID_RESET_TOKEN";
    readonly RESET_PASSWORD_FAILED: "RESET_PASSWORD_FAILED";
    readonly INVALID_VERIFICATION_TOKEN: "INVALID_VERIFICATION_TOKEN";
    readonly RATE_LIMITED_LOGIN: "RATE_LIMITED_LOGIN";
    readonly RATE_LIMITED_REGISTER: "RATE_LIMITED_REGISTER";
    readonly RATE_LIMITED_RESET: "RATE_LIMITED_RESET";
    readonly RATE_LIMITED_RESEND: "RATE_LIMITED_RESEND";
    readonly INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly SERVER_ERROR: "SERVER_ERROR";
};
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
export declare const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string>;
/**
 * Returns the user-facing message for a given auth error code.
 * Falls back to a generic server error message for unknown codes.
 */
export declare function getAuthErrorMessage(code: AuthErrorCode | string): string;
//# sourceMappingURL=auth-error-messages.d.ts.map