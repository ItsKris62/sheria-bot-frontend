import { LLMProviderName } from './types';
export declare const MODEL_PRICING: Record<string, {
    input: number;
    output: number;
}>;
/**
 * Get pricing for a specific provider and model.
 * If exact pricing isn't found, returns the most conservative (highest)
 * rate across all known models to fail-safe cost limits.
 */
export declare function getModelPricing(provider: LLMProviderName, model: string): {
    input: number;
    output: number;
    isMissing: boolean;
};
export declare function calculateCost(provider: LLMProviderName, model: string, inputTokens: number, outputTokens: number): {
    cost: number;
    isMissing: boolean;
};
//# sourceMappingURL=pricing.d.ts.map