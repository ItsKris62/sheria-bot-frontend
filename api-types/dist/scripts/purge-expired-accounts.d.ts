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
 *   5. Archive-then-delete across all R2 buckets (sheria-bot-public, sheria-bot-saas, sheriabot-storage -> sheria-bot-backups)
 *   6. Comprehensive artifact cleanup: avatars, legal documents, policy exports, checklist exports, gap analysis exports, compliance query exports, and vault documents
 *   7. Statutory retention preservation (Payment & tax invoices preserved under TPA/ITA)
 *   8. Structured JSON logging with zero PII
 *   9. Transactional integrity with safe partial-failure behavior
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
    archived: number;
    deleted: number;
    dryRun: boolean;
    details: Array<{
        userId: string;
        success: boolean;
        error?: string;
    }>;
}
export declare function purgeExpiredAccounts(options?: PurgeOptions): Promise<PurgeResult>;
//# sourceMappingURL=purge-expired-accounts.d.ts.map