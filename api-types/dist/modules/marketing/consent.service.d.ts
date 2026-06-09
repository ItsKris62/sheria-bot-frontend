/**
 * Consent Service
 *
 * DPA 2019-compliant consent tracking for the marketing module.
 *
 * Key invariants:
 *   - ConsentRecord + Contact update always happen in a single $transaction.
 *     If either fails, both roll back — no orphaned audit records.
 *
 *   - IMPORTED_LEGITIMATE_INTEREST → ContactConsentStatus.PENDING
 *     (NOT GRANTED). Under the legitimate-interest lawful basis, contact is
 *     sent one email with a clear opt-out option. Only if they do not opt out
 *     is consent considered valid. Marking as GRANTED at import time would be
 *     a DPA 2019 violation.
 *
 *   - REVOKED → ContactConsentStatus.REVOKED + SuppressionList entry.
 *     An explicit revocation is operationally equivalent to an unsubscribe —
 *     the contact must not receive future sends.
 *
 *   - UPDATED → records audit trail + updates consentTimestamp, but does NOT
 *     change consentStatus (the action represents a preference update, not a
 *     consent status transition).
 */
import { ConsentAction } from '@prisma/client';
export interface RecordConsentParams {
    contactId: string;
    action: ConsentAction;
    /** Human-readable source label, e.g. 'csv_import', 'web_form', 'api', 'email_unsubscribe' */
    source: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Record a consent action for a contact.
 *
 * Atomically:
 *   1. Updates Contact.consentStatus (if the action maps to a status transition)
 *      and Contact.consentTimestamp + Contact.consentSource.
 *   2. Creates a ConsentRecord for the audit trail.
 *
 * Post-transaction (non-atomic, intentional):
 *   - If action === REVOKED, calls suppress() which writes to SuppressionList
 *     and sets the Redis suppression cache. Redis cannot participate in a Prisma
 *     transaction, so this step runs after the DB transaction commits.
 *
 * @throws If the contact does not exist (Prisma P2025 from contact.update).
 */
export declare function recordConsent(params: RecordConsentParams): Promise<void>;
//# sourceMappingURL=consent.service.d.ts.map