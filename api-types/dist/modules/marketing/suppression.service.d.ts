/**
 * Suppression Service
 *
 * Single source of truth for marketing suppression state. Manages three layers:
 *   1. SuppressionList table  — durable record with reason + audit trail
 *   2. Contact row            — suppressedAt / suppressedReason fields for quick DB joins
 *   3. Redis cache            — O(1) per-email check used by isSuppressed()
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
 *   isSuppressed(email)                            — single-email check, Redis-first
 *   filterSuppressed(emails)                       — batch check, returns Set<string>
 */
import { SuppressionReason } from '@prisma/client';
/**
 * Add an email to the suppression list.
 * Idempotent — calling twice for the same email is safe; the original reason is preserved.
 * Also sets suppressedAt / suppressedReason on the matching Contact row (if any).
 */
export declare function suppress(email: string, reason: SuppressionReason, addedById?: string, metadata?: Record<string, unknown>): Promise<void>;
/**
 * Remove an email from the suppression list and clear all suppression fields.
 * Idempotent — calling on an email that was never suppressed is a no-op, not an error.
 */
export declare function unsuppress(email: string): Promise<void>;
/**
 * Check whether a single email is suppressed.
 * Redis-first: on a cache hit returns immediately.
 * On a cache miss queries the DB and back-fills the cache if suppressed.
 * Fails open on Redis error (falls through to DB).
 */
export declare function isSuppressed(email: string): Promise<boolean>;
/**
 * Given a list of emails, return the subset that are suppressed as a Set<string>
 * (lowercased, normalized) for O(1) lookup by the send pipeline.
 *
 * Always goes directly to the DB with a single IN query — more efficient than
 * N individual Redis lookups for large recipient lists.
 * Back-fills Redis cache for every suppressed email found.
 */
export declare function filterSuppressed(emails: string[]): Promise<Set<string>>;
//# sourceMappingURL=suppression.service.d.ts.map