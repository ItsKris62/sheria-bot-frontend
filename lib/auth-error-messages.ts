/**
 * Frontend Auth Error Messages
 *
 * Single source of truth for all user-facing auth error messages on the frontend.
 * Mirrors the backend's auth-error-messages.ts — kept separate because the
 * frontend and backend are in separate packages with no shared module resolution.
 *
 * IMPORTANT: These messages are designed to be security-conscious:
 * - Login/signup errors never confirm whether an email is registered.
 * - Password reset always returns the same message regardless of email existence.
 * - Password requirements are NOT shown on login (would help attackers).
 */

import { TRPCClientError } from '@trpc/client';

// ── Error codes (mirrors backend AUTH_ERROR_CODES) ───────────────────────────

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_PENDING_APPROVAL: 'ACCOUNT_PENDING_APPROVAL',
  ACCOUNT_NOT_ACTIVE: 'ACCOUNT_NOT_ACTIVE',
  EMAIL_UNAVAILABLE: 'EMAIL_UNAVAILABLE',
  FREE_EMAIL_NOT_ALLOWED: 'FREE_EMAIL_NOT_ALLOWED',
  REGULATOR_EMAIL_REQUIRED: 'REGULATOR_EMAIL_REQUIRED',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  COMMON_PASSWORD: 'COMMON_PASSWORD',
  PASSWORD_CONTAINS_EMAIL: 'PASSWORD_CONTAINS_EMAIL',
  PASSWORD_HAS_SEQUENCES: 'PASSWORD_HAS_SEQUENCES',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
  INVALID_RESET_TOKEN: 'INVALID_RESET_TOKEN',
  RESET_PASSWORD_FAILED: 'RESET_PASSWORD_FAILED',
  INVALID_VERIFICATION_TOKEN: 'INVALID_VERIFICATION_TOKEN',
  RATE_LIMITED_LOGIN: 'RATE_LIMITED_LOGIN',
  RATE_LIMITED_REGISTER: 'RATE_LIMITED_REGISTER',
  RATE_LIMITED_RESET: 'RATE_LIMITED_RESET',
  RATE_LIMITED_RESEND: 'RATE_LIMITED_RESEND',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

// ── User-facing message map ───────────────────────────────────────────────────

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  INVALID_CREDENTIALS:
    'Invalid email or password. Please check your credentials and try again.',
  SESSION_EXPIRED:
    'Your session has expired. Please sign in again to continue.',
  ACCOUNT_DEACTIVATED:
    'Invalid email or password. Please check your credentials and try again.',
  EMAIL_NOT_VERIFIED:
    "Your email hasn't been verified yet. Check your inbox for the verification link, or click below to resend it.",
  ACCOUNT_PENDING_APPROVAL:
    'Your account is pending admin approval. You will be notified by email once approved.',
  ACCOUNT_NOT_ACTIVE:
    'Your account is not active. Please contact support@sheriabot.com for assistance.',
  EMAIL_UNAVAILABLE:
    "If this email is available, you'll receive a verification link shortly. Check your inbox (and spam folder).",
  FREE_EMAIL_NOT_ALLOWED:
    'Please use your business email address. Free email providers (e.g., Gmail, Yahoo) are not accepted for organizational accounts.',
  REGULATOR_EMAIL_REQUIRED:
    'Regulator accounts require a verified government email address (e.g., @cbk.go.ke, @cma.or.ke).',
  REGISTRATION_FAILED:
    'Registration failed. Please try again. If the problem continues, contact support@sheriabot.com.',
  WEAK_PASSWORD:
    'Password does not meet the required complexity. Please review the requirements below.',
  COMMON_PASSWORD:
    'This password is too commonly used and could be easily guessed. Try combining unrelated words or a passphrase.',
  PASSWORD_CONTAINS_EMAIL:
    'Password must not contain your email address or username.',
  PASSWORD_HAS_SEQUENCES:
    'Avoid keyboard patterns or sequential characters (e.g., "abcd", "1234", "qwer").',
  PASSWORD_MISMATCH:
    "Passwords don't match. Please re-enter to confirm.",
  INVALID_RESET_TOKEN:
    'This password reset link is invalid or has expired. Please request a new one.',
  RESET_PASSWORD_FAILED:
    'Failed to reset your password. Please try again.',
  INVALID_VERIFICATION_TOKEN:
    'This verification link is invalid or has expired. Please request a new verification email.',
  RATE_LIMITED_LOGIN:
    'Too many sign-in attempts. Please wait 15 minutes before trying again, or reset your password.',
  RATE_LIMITED_REGISTER:
    'Too many registration attempts from this address. Please try again in an hour.',
  RATE_LIMITED_RESET:
    'Too many reset requests. Please wait an hour before requesting another link.',
  RATE_LIMITED_RESEND:
    'Too many verification email requests. Please try again in an hour.',
  INVALID_EMAIL_FORMAT:
    'Please enter a valid email address (e.g., name@company.com).',
  NETWORK_ERROR:
    "We couldn't reach our servers. Please check your internet connection and try again.",
  SERVER_ERROR:
    'Something unexpected happened on our end. Please try again. If this continues, contact support@sheriabot.com.',
};

// ── Error surfacing helpers ───────────────────────────────────────────────────

/**
 * Checks whether a backend error message matches a known auth message pattern.
 * Backend sends pre-formatted safe messages; we can display them directly for
 * password-policy violations and actionable status messages, but we sanitize
 * credential/enumeration errors.
 */
const SAFE_PASSTHROUGH_PREFIXES = [
  // Password policy — backend sends granular messages we want to show
  'Password must be at least',
  'Password must be no more',
  'Include at least one uppercase',
  'Include at least one lowercase',
  'Include at least one number',
  'Include at least one special',
  'This password is too commonly',
  'Password must not contain',
  'Avoid sequences of 4',
  'Avoid keyboard patterns',
  // Status messages
  "Your email hasn't been verified",
  'Your account is pending',
  'Your account is not active',
  // Reset
  'This password reset link',
  // Business rules
  'Please use your business email',
  'Regulator accounts require',
  // Rate limiting (backend appends retryAfter info)
  'Too many sign-in attempts',
  'Too many registration attempts',
  'Too many reset requests',
  'Too many verification email',
  'Too many requests',
  // Other actionable
  "If this email is available",
  'If an account exists',
] as const;

function isSafePassthrough(message: string): boolean {
  return SAFE_PASSTHROUGH_PREFIXES.some((prefix) => message.startsWith(prefix));
}

/**
 * Map a tRPC error to a user-facing string.
 *
 * Priority order:
 * 1. Known safe backend messages (pass through directly).
 * 2. Zod field-level errors from input validation (granular password rules).
 * 3. tRPC error code → centralized message map.
 * 4. Generic server error fallback.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof TRPCClientError)) {
    if (error instanceof Error) return AUTH_ERROR_MESSAGES.SERVER_ERROR;
    return AUTH_ERROR_MESSAGES.SERVER_ERROR;
  }

  const code = error.data?.code as string | undefined;
  const message = error.message ?? '';

  // 1. Safe backend messages (password policy, status, rate-limit with retryAfter)
  if (isSafePassthrough(message)) return message;

  // 2. Zod validation field errors — surface the first specific error
  const zodError = error.data?.zodError;
  if (zodError) {
    const fieldErrors = zodError.fieldErrors as Record<string, string[]> | undefined;
    if (fieldErrors) {
      // Prefer password-specific errors first
      const pwError = fieldErrors.password?.[0] ?? fieldErrors.newPassword?.[0];
      if (pwError) return pwError;
      // Fall back to first available field error
      const firstField = Object.values(fieldErrors)[0];
      if (firstField?.[0]) return firstField[0];
    }
    const formErrors = zodError.formErrors as string[] | undefined;
    if (formErrors?.[0]) return formErrors[0];
  }

  // 3. tRPC error code mapping
  switch (code) {
    case 'UNAUTHORIZED':
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    case 'FORBIDDEN':
      // For FORBIDDEN, the backend message is already safe — pass through
      return isSafePassthrough(message) ? message : AUTH_ERROR_MESSAGES.ACCOUNT_NOT_ACTIVE;
    case 'CONFLICT':
      // Signup duplicate — use the safe enumeration-resistant message
      return AUTH_ERROR_MESSAGES.EMAIL_UNAVAILABLE;
    case 'BAD_REQUEST':
      // Backend sends specific, safe BAD_REQUEST messages — pass through
      return message || AUTH_ERROR_MESSAGES.SERVER_ERROR;
    case 'TOO_MANY_REQUESTS':
      // Keep any retryAfter suffix the backend appended
      return message || AUTH_ERROR_MESSAGES.RATE_LIMITED_LOGIN;
    case 'INTERNAL_SERVER_ERROR':
      return AUTH_ERROR_MESSAGES.SERVER_ERROR;
    case 'NOT_FOUND':
      return AUTH_ERROR_MESSAGES.SERVER_ERROR;
    case 'NETWORK_ERROR':
      return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    default:
      // Unknown: check if it looks like a network issue
      if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
        return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      }
      return AUTH_ERROR_MESSAGES.SERVER_ERROR;
  }
}
