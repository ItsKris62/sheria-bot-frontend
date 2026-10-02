import { LLMProviderName } from './types';
export interface ModelPricingRates {
    input: number;
    output: number;
    cacheRead?: number;
    cacheWrite?: number;
}
export declare const MODEL_PRICING: Record<string, ModelPricingRates>;
/**
 * Get pricing for a specific provider and model.
 * If exact pricing isn't found, returns the most conservative (highest)
 * rate across all known models to fail-safe cost limits.
 */
export declare function getModelPricing(provider: LLMProviderName, model: string): {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    isMissing: boolean;
};
export interface CacheTokenOptions {
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
}
export declare function calculateCost(provider: LLMProviderName, model: string, inputTokens: number, outputTokens: number, cacheOptions?: CacheTokenOptions): {
    cost: number;
    isMissing: boolean;
};
export declare const CURRENT_PRICING_VERSION = "2026.09.v1";
export interface CostWithFxResult {
    cost: number;
    costUsd: number;
    costKes: number;
    fxRateUsdToKes: number;
    fxRateCapturedAt: Date;
    pricingVersion: string;
    isMissing: boolean;
}
/**
 * Calculates both USD and Kenyan Shillings (KES) costs for an AI request.
 */
export declare function calculateCostWithFx(provider: LLMProviderName, model: string, inputTokens: number, outputTokens: number, cacheOptions?: CacheTokenOptions): Promise<CostWithFxResult>;
//# sourceMappingURL=pricing.d.ts.map