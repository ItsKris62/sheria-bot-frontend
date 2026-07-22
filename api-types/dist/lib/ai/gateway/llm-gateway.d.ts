import { ILLMProvider, LLMCompletionRequest, LLMCompletionResult, LLMStreamOptions, LLMProviderName } from './types';
export declare class LLMGateway {
    private providers;
    constructor();
    private registerProvider;
    getProvider(name: LLMProviderName): ILLMProvider;
    getTodayAICost(): Promise<number>;
    resetDailyCost(): Promise<void>;
    getAIStats(): Promise<{
        todayCost: number;
        dailyLimit: number;
        remainingBudget: number;
        percentUsed: number;
    }>;
    trackCost(cost: number): Promise<void>;
    checkCostLimit(estimatedCost: number): Promise<void>;
    generateCacheKey(provider: LLMProviderName, model: string, prompt: string, systemPrompt?: string): string;
    getCachedCompletion(cacheKey: string): Promise<LLMCompletionResult | null>;
    cacheCompletion(cacheKey: string, result: LLMCompletionResult, ttl: number): Promise<void>;
    private resolveProviderAndModel;
    complete(req: LLMCompletionRequest, cacheTTL?: number): Promise<LLMCompletionResult>;
    stream(opts: LLMStreamOptions): Promise<LLMCompletionResult>;
}
export declare const llmGateway: LLMGateway;
//# sourceMappingURL=llm-gateway.d.ts.map