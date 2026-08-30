/**
 * Compliance Query Retention & Archival Worker
 *
 * Purpose Justification:
 *   - Under the Kenya Data Protection Act, 2019 (s.25(e) & s.39), personal data and confidential
 *     customer prompts must not be retained indefinitely once the immediate operational purpose expires.
 *   - Active Dashboard Access (180 Days): Users require access to recent query history for ongoing
 *     compliance monitoring, reporting, and regulatory audit trail reviews.
 *   - Operational Telemetry (12 Months): Statistical metadata, confidence scores, and statutory
 *     citations are preserved for billing reconciliation, verifier model tuning, and accuracy auditing.
 *   - Free-Text Pruning: Customer-entered free text ('query' and 'response') may contain confidential
 *     business details or personal data; after the active window (180 days), free-text is scrubbed to
 *     [REDACTED_PURSUANT_TO_RETENTION_POLICY], preserving non-personal statutory citations and regulatory areas.
 *   - Deep Purge (>365 Days): Historical compliance queries older than 365 days are completely erased.
 *
 * Execution Safety Guarantees:
 *   1. Dry-run mode (--dry-run or DRY_RUN=true)
 *   2. Batch-safe processing (BATCH_SIZE configurable)
 *   3. Non-PII structured JSON logging
 *   4. Legal hold exemption check
 *   5. Idempotent and retry-safe execution
 *   6. Schema-compatible relational deletion (handles child feedbacks, saves, and claims)
 *
 * Usage:
 *   pnpm tsx src/scripts/archive-expired-queries.ts
 *   pnpm tsx src/scripts/archive-expired-queries.ts --dry-run
 *   COMPLIANCE_QUERY_RETENTION_DAYS=180 pnpm tsx src/scripts/archive-expired-queries.ts
 */
import 'dotenv/config';
export interface QueryRetentionOptions {
    retentionDays?: number;
    deepPurgeDays?: number;
    batchSize?: number;
    dryRun?: boolean;
    now?: Date;
}
export interface QueryRetentionResult {
    scanned: number;
    anonymized: number;
    purged: number;
    skippedLegalHold: number;
    failed: number;
    dryRun: boolean;
    retentionDays: number;
}
export declare const REDACTED_TEXT = "[REDACTED_PURSUANT_TO_RETENTION_POLICY]";
export declare function archiveExpiredQueries(options?: QueryRetentionOptions): Promise<QueryRetentionResult>;
//# sourceMappingURL=archive-expired-queries.d.ts.map