/**
 * Billing Module
 *
 * Owns usage metering for plan entitlements:
 *  - Fast-path increments/reads via Upstash Redis (sheriabot:usage:{scope}:{metric}:{YYYY-MM})
 *  - Periodic sync of Redis counters to the Postgres UsageRecord table for
 *    auditing, analytics, and durability across Redis evictions.
 *
 * The sync method is designed to be called by a scheduled job (e.g. nightly cron
 * or a Fastify plugin using node-cron / @fastify/schedule). It is idempotent and
 * safe to call multiple times per period.
 *
 * Key naming convention:
 *   sheriabot:usage:{scopeId}:{BillingMetric}:{YYYY-MM}
 *   where scopeId = organizationId ?? userId
 */
import { BillingMetric } from '@prisma/client';
declare class BillingModule {
    /**
     * Atomically increments the Redis usage counter for a given scope + metric.
     *
     * This is the hot-path call; it does NOT write to Postgres.
     * The sync() method writes to Postgres on a schedule.
     *
     * @param scopeId  organizationId ?? userId
     * @param metric   BillingMetric enum value
     * @param amount   Default 1
     * @returns        New counter value after increment
     */
    increment(scopeId: string, metric: BillingMetric, amount?: number): Promise<number>;
    /**
     * Returns the current-month usage count from Redis for a given scope + metric.
     * Falls back to 0 on Redis error.
     */
    getCurrentUsage(scopeId: string, metric: BillingMetric): Promise<number>;
    /**
     * Returns usage counts for all BillingMetrics for a given scope in the
     * current period, fetched in parallel.
     */
    getAllCurrentUsage(scopeId: string): Promise<Record<BillingMetric, number>>;
    /**
     * Returns the stored UsageRecord for an organization + metric + period.
     * Returns null if no record exists (i.e. the period hasn't been synced yet).
     *
     * @param period  Optional 'YYYY-MM' string; defaults to current period.
     */
    getStoredUsage(organizationId: string, metric: BillingMetric, period?: string): Promise<{
        id: string;
        count: number;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        metric: import(".prisma/client").$Enums.BillingMetric;
        periodStart: Date;
        periodEnd: Date;
    } | null>;
    /**
     * Scans all `sheriabot:usage:*` Redis keys and upserts their current counts
     * into the Postgres UsageRecord table.
     *
     * This method is idempotent and safe to call multiple times per period.
     * It should be invoked by a scheduled job (e.g. nightly at 01:00 UTC).
     *
     * Key format: sheriabot:usage:{scopeId}:{BillingMetric}:{YYYY-MM}
     *
     * IMPORTANT: This method only syncs keys belonging to organizations (it
     * filters by checking whether the scopeId is a valid organizationId in
     * Postgres). Usage keys scoped to individual users (no org) are not
     * persisted  -  they are ephemeral and only enforced via Redis.
     *
     * @returns Number of UsageRecord rows upserted.
     */
    syncToDatabase(): Promise<number>;
    /**
     * Deletes the Redis usage key for a given scope + metric + period.
     * Only for use in tests or admin reset flows  -  does NOT touch Postgres.
     */
    resetRedisCounter(scopeId: string, metric: BillingMetric, period?: string): Promise<void>;
}
export declare const billingModule: BillingModule;
export { BillingModule };
//# sourceMappingURL=billing.module.d.ts.map