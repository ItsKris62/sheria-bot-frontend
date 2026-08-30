/**
 * Suppression Service
 *
 * Single source of truth for marketing suppression state. Manages three layers:
 *   1. SuppressionList table  — durable record with reason + audit trail
 *   2. Contact row            — suppressedAt / suppressedReason fields for quick DB joins
 *   3. Redis cache            — O(1) per-email check used by isSuppressed()
 *   4. Section 34 Restriction — checks User.preferences.section34Restriction for DIRECT_MARKETING
 *
 * All functions normalize email via trim().toLowerCase() before every DB or cache
 * operation to prevent casing mismatches bypassing suppression checks.
 *
 * Redis key: sheriabot:marketing:suppression:{emailLower}
 *   presence = suppressed   |   absence = unknown (query DB)
 *
 * API:
 *   suppress(email, reason, addedById?, metadata?) — idempotent upsert
 *   unsuppress(email)                              — idempotent delete (no-op if missing)
 *   isSuppressed(email)                            — single-email check, Redis-first + Section 34 check
 *   filterSuppressed(emails)                       — batch check, returns Set<string> + Section 34 check
 */
import { SuppressionReason } from '@prisma/client';
/**
 * Add an email to the suppression list.
 * Idempotent — calling twice for the same email is safe; the original reason is preserved.
 * Also sets suppressedAt / suppressedReason on the matching Contact row (if any).
 */
export declare function suppress(email: string, reason: SuppressionReason, addedById?: string, metadata?: Record<string, unknown>): Promise<void>;
/**
 * Remove an email from the suppression list.
 * Idempotent — no error if the email was not suppressed.
 * Clears suppressedAt / suppressedReason on matching Contact rows and evicts Redis cache.
 */
export declare function unsuppress(email: string): Promise<void>;
/**
 * Check whether a single email is suppressed.
 * Redis-first: on a cache hit returns immediately.
 * On a cache miss queries the DB and back-fills the cache if suppressed.
 * Also enforces active Section 34 DPA restrictions for DIRECT_MARKETING.
 */
export declare function isSuppressed(email: string): Promise<boolean>;
/**
 * Given a list of emails, return the subset that are suppressed as a Set<string>
 * (lowercased, normalized) for O(1) lookup by the send pipeline.
 *
 * Checks both SuppressionList table and active Section 34 DIRECT_MARKETING restrictions.
 */
export declare function filterSuppressed(emails: string[]): Promise<Set<string>>;
//# sourceMappingURL=suppression.service.d.ts.map