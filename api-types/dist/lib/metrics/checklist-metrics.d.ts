/**
 * Checklist Generation Metrics
 *
 * Tracks success/failure rates for the three-tier generation pipeline
 * using Upstash Redis hash counters.
 *
 * Keys:
 *   sheriabot:checklist:metrics:alltime        -  persistent global hash (no TTL)
 *   sheriabot:checklist:metrics:daily:{date}   -  daily hash (TTL 35 days)
 *
 * Hash fields:
 *   attempts             -  total runGeneration() calls (fresh + retries)
 *   success:full         -  Tier 1 successes
 *   success:simplified   -  Tier 2 successes
 *   success:minimal      -  Tier 3 successes
 *   success:partial      -  partial-recovery successes (any tier)
 *   failure              -  all-tiers-failed outcomes
 *   retry_attempts       -  retryChecklist() initiations
 *
 * All counter calls are fire-and-forget with a silent .catch()  -  metrics
 * must NEVER block or throw in the generation hot path.
 */
type SuccessTier = 'full' | 'simplified' | 'minimal' | 'partial';
/**
 * Call at the start of runGeneration()  -  counts every attempt including retries.
 */
export declare function recordAttempt(): void;
/**
 * Call when a tier succeeds inside runGenerationWithFallback().
 * generationTier is 'full' | 'simplified' | 'minimal' | 'partial'.
 */
export declare function recordSuccess(tier: SuccessTier): void;
/**
 * Call in the all-tiers-failed block of runGenerationWithFallback().
 */
export declare function recordFailure(): void;
/**
 * Call when retryChecklist() successfully initiates a new generation.
 */
export declare function recordRetryAttempt(): void;
export interface ChecklistMetricsStats {
    /** Window: 'alltime' or an ISO date string for the daily snapshot. */
    window: string;
    attempts: number;
    successFull: number;
    successSimplified: number;
    successMinimal: number;
    successPartial: number;
    totalSuccess: number;
    failure: number;
    retryAttempts: number;
    /** null when attempts === 0. */
    successRatePct: number | null;
    /** Breakdown of successes by tier (only non-zero tiers included). */
    tierBreakdown: Record<string, string>;
}
/**
 * Read the all-time or daily stats from Redis.
 * @param window 'alltime' (default) | 'today' | ISO date string 'YYYY-MM-DD'
 */
export declare function getStats(window?: 'alltime' | 'today' | string): Promise<ChecklistMetricsStats>;
export {};
//# sourceMappingURL=checklist-metrics.d.ts.map