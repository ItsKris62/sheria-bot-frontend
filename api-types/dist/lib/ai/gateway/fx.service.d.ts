/**
 * FX Rate Service for USD to KES (Kenyan Shillings) conversions.
 *
 * Implements non-blocking cached FX rates with fallback:
 * 1. Config override (env / aiConfig.costs.fx.usdToKesOverride)
 * 2. Redis cached rate in key `sheriabot:fx:usd:kes` (default TTL: 6 hours)
 * 3. Asynchronous refresh with circuit breaker & timeout
 * 4. Conservative hardcoded fallback default (130.00 KES/USD)
 */
export interface FxRateResult {
    rate: number;
    source: 'config_override' | 'redis_cache' | 'external_api' | 'fallback_default';
    capturedAt: Date;
}
export declare const FX_REDIS_KEY = "sheriabot:fx:usd:kes";
export declare const FX_REDIS_TIMESTAMP_KEY = "sheriabot:fx:usd:kes:timestamp";
export declare const DEFAULT_USD_TO_KES_RATE = 130;
export declare const FX_CACHE_TTL_SECONDS = 21600;
/**
 * Fetch the current USD to KES exchange rate.
 * Guaranteed to be non-blocking and safe on the request hot path.
 */
export declare function getUsdToKesFxRate(): Promise<FxRateResult>;
/**
 * Stores a verified FX rate in Redis with TTL.
 */
export declare function cacheFxRate(rate: number, ttlSeconds?: number): Promise<void>;
/**
 * Asynchronously refreshes the FX rate from external sources without blocking requests.
 */
export declare function triggerAsyncFxRefresh(): void;
/**
 * Reset memory rate cache for testing purposes.
 */
export declare function _resetMemoryRateForTesting(): void;
//# sourceMappingURL=fx.service.d.ts.map