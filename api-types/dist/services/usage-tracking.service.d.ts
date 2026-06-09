/**
 * UsageTrackingService
 *
 * Handles all usage tracking business logic:
 *   - Period management (get/create current EAT calendar-month UsagePeriod)
 *   - Lazy sync of Redis counters -> UsagePeriod DB record
 *   - Dashboard summary (current usage with period context)
 *   - Usage history (last N completed months from DB)
 *   - Usage comparison (current vs a past period)
 *   - Document storage increment (float-safe Redis INCRBYFLOAT)
 *   - Plan limit snapshotting on plan change
 *
 * Design principles:
 *   - Redis is the real-time enforcement source of truth (read by checkUsageLimit middleware).
 *   - UsagePeriod DB records are the durable history store, synced lazily on reads.
 *   - Period boundaries use EAT (UTC+3) calendar months, stored as UTC equivalents.
 *   - Redis key format matches checkUsageLimit middleware exactly (UTC YYYY-MM month key).
 */
import { type UsagePeriod } from '@prisma/client';
export interface CategorySummary {
    /** Field name on UsagePeriod (e.g. "complianceQueries") */
    key: string;
    label: string;
    /** Current usage count this period */
    current: number;
    /**
     * Monthly cap from the plan snapshot.
     * -1 = unlimited,  0 = feature not available on this plan,  n = cap
     */
    limit: number;
    /** false when limit === 0 (feature not in plan) */
    available: boolean;
    /** 0-100; 0 when unlimited or unavailable */
    percentUsed: number;
}
export interface UsageSummary {
    period: {
        start: Date;
        end: Date;
        daysRemaining: number;
        daysTotal: number;
    };
    planTier: string;
    categories: CategorySummary[];
}
export interface UsagePeriodSummary {
    periodId: string;
    periodStart: Date;
    periodEnd: Date;
    planTier: string;
    categories: CategorySummary[];
}
export interface UsageChangeItem {
    key: string;
    label: string;
    currentCount: number;
    previousCount: number;
    /** Positive = increase, negative = decrease */
    changePercent: number;
    direction: 'up' | 'down' | 'same';
}
export interface UsageComparison {
    current: UsagePeriodSummary;
    previous: UsagePeriodSummary;
    changes: UsageChangeItem[];
}
declare class UsageTrackingService {
    /**
     * Get or create the UsagePeriod record for the current EAT calendar month.
     *
     * On first access for this org + month:
     *   - Fetches the org's plan from DB
     *   - Creates the UsagePeriod with zeroed counters and snapshotted limits
     *
     * On subsequent calls: returns the existing record without modification.
     */
    getCurrentPeriod(organizationId: string): Promise<UsagePeriod>;
    /**
     * Re-snapshot the current plan's limits into the active UsagePeriod record.
     *
     * Call this after an org's plan changes (upgrade/downgrade) so the current
     * period reflects the correct limits. Historical periods are not modified.
     */
    snapshotPlanLimits(organizationId: string): Promise<void>;
    /**
     * Read all six usage counters from Redis for the current UTC month.
     * Key format matches checkUsageLimit middleware exactly.
     * Any missing or unreadable key falls back to 0.
     */
    private readRedisCounters;
    /**
     * Write the current Redis counter values into the UsagePeriod DB record.
     *
     * Called as a non-blocking side effect on each dashboard read.
     * This ensures the DB always has a recent snapshot before the 35-day
     * Redis key expiry deletes the live data.
     */
    private syncRedisToDb;
    /**
     * Atomically add to the document storage usage counter for an org.
     *
     * Uses Redis INCRBYFLOAT to accumulate fractional MB values.
     * `fileSizeBytes` is the raw byte count from VaultDocument.fileSize (Int).
     *
     * Non-fatal: errors are logged and swallowed so upload flow is never blocked.
     */
    incrementDocumentStorage(organizationId: string, fileSizeBytes: number): Promise<void>;
    /**
     * Return the current period's usage summary for the dashboard card.
     *
     * Flow:
     *   1. Parallel: get/create UsagePeriod + read Redis counters
     *   2. Fire non-blocking DB sync (preserves data before Redis expiry)
     *   3. Return formatted summary with period dates and category breakdown
     */
    getCurrentUsageSummary(organizationId: string): Promise<UsageSummary>;
    /**
     * Return summaries for the last N completed billing periods.
     *
     * "Completed" means any UsagePeriod with a periodStart before the current
     * EAT month. The current period is always excluded.
     *
     * Results are ordered newest -> oldest.
     * Reads entirely from DB  -  no Redis access.
     */
    getUsageHistory(organizationId: string, months?: number): Promise<UsagePeriodSummary[]>;
    /**
     * Compare current period usage against a specific past period.
     *
     * `comparePeriodStart` must match the exact `periodStart` Date stored in a
     * UsagePeriod record (as returned by `getUsageHistory`).
     *
     * Throws a descriptive error if the comparison period is not found.
     */
    compareUsage(organizationId: string, comparePeriodStart: Date): Promise<UsageComparison>;
}
export declare const usageTrackingService: UsageTrackingService;
export { UsageTrackingService };
//# sourceMappingURL=usage-tracking.service.d.ts.map