/**
 * Account Hard-Purge Worker
 *
 * Permanently erases user accounts whose scheduled deletion grace period has expired.
 *
 * Selection criteria:
 *   - User.status === 'SUSPENDED'
 *   - User.deletionScheduledAt !== null && User.deletionScheduledAt <= now
 *
 * Execution Safety & Data Protection Guarantees:
 *   1. Dry-run mode support (--dry-run or DRY_RUN=true)
 *   2. Idempotent & batch-safe (processes up to BATCH_SIZE users per execution)
 *   3. Supabase Auth identity hard-purge via Supabase Admin API
 *   4. Redis session & cache key invalidation
 *   5. Scoped R2 private artifact deletion (preserves shared organizational documents)
 *   6. Statutory retention preservation (Payment & tax invoices preserved under TPA/ITA)
 *   7. Structured JSON logging with zero PII
 *   8. Transactional integrity with safe partial-failure behavior
 *
 * Usage:
 *   pnpm tsx src/scripts/purge-expired-accounts.ts
 *   pnpm tsx src/scripts/purge-expired-accounts.ts --dry-run
 */
import 'dotenv/config';
export interface PurgeOptions {
    dryRun?: boolean;
    batchSize?: number;
    now?: Date;
}
export interface PurgeResult {
    scanned: number;
    purged: number;
    skipped: number;
    failed: number;
    dryRun: boolean;
    details: Array<{
        userId: string;
        success: boolean;
        error?: string;
    }>;
}
export declare function purgeExpiredAccounts(options?: PurgeOptions): Promise<PurgeResult>;
//# sourceMappingURL=purge-expired-accounts.d.ts.map