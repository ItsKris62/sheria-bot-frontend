/**
 * Verification Service
 *
 * Handles:
 * - Free email domain blocking (Zod utility)
 * - Regulator domain whitelist checking
 * - Invitation token lookup
 * - Tiered access level resolution
 * - Notification preference auto-creation
 */
/**
 * Domains that are blocked for organizational accounts.
 * Maintained as a static list  -  changes rarely and requires a deployment.
 */
export declare const FREE_EMAIL_DOMAINS: Set<string>;
export declare function isFreeEmailDomain(email: string): boolean;
export declare const FREE_EMAIL_ERROR_MESSAGE = "Please use your business email address. Free email providers are not accepted for organizational accounts.";
/**
 * Check if an email belongs to a known regulator domain.
 * Looks up the EmailDomainWhitelist table in the database.
 */
export declare function isRegulatorDomain(email: string): Promise<{
    isRegulator: boolean;
    orgName?: string;
    domain?: string;
}>;
export interface ValidatedInvitation {
    id: string;
    email: string;
    role: string;
    organizationId?: string | null;
    invitedBy: string;
}
/**
 * Find and validate an invitation token.
 * Returns null if the token is missing, expired, or already used.
 */
export declare function findValidInvitation(email: string): Promise<ValidatedInvitation | null>;
/**
 * Mark an invitation as used.
 */
export declare function consumeInvitation(invitationId: string): Promise<void>;
export type AccessLevel = 'none' | 'basic' | 'full';
/**
 * Resolve the user's access level based on email verification and org status.
 *
 * - none  : email not verified OR account not active
 * - basic : email verified + account active (no org verification required)
 * - full  : email verified + active + organization verified
 */
export declare function resolveAccessLevel(userId: string): Promise<AccessLevel>;
/**
 * Create a NotificationPreference record for a new user (all defaults to true).
 * Safe to call multiple times  -  uses upsert to avoid duplicates.
 */
export declare function initializeNotificationPreferences(userId: string): Promise<void>;
//# sourceMappingURL=verification.service.d.ts.map