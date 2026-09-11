import { ILLMProvider, LLMCompletionRequest, LLMCompletionResult, LLMStreamOptions, LLMProviderName } from './types';
export interface MonthlyBudgetStatus {
    period: string;
    budgetUsd: number;
    spentUsd: number;
    reservedUsd: number;
    remainingUsd: number;
    percentUsed: number;
    providers: Record<LLMProviderName, number>;
}
export declare function getCurrentBudgetPeriod(date?: Date): string;
export declare class LLMGateway {
    private providers;
    constructor();
    private registerProvider;
    getProvider(name: LLMProviderName): ILLMProvider;
    getMonthlyBudgetLimit(): Promise<number>;
    getMonthlyGlobalSpend(period?: string): Promise<number>;
    getMonthlyGlobalReserved(period?: string): Promise<number>;
    getMonthlyProviderSpend(provider: LLMProviderName, period?: string): Promise<number>;
    getMonthlyBudgetStatus(period?: string): Promise<MonthlyBudgetStatus>;
    /**
     * Concurrency-safe atomic reservation of estimated cost before initiating AI call.
     */
    reserveBudget(estimatedCost: number, period?: string): Promise<{
        period: string;
        reservedAmount: number;
    }>;
    /**
     * Reconciles atomic reservation against actual provider token usage.
     */
    reconcileReservation(period: string, reservedAmount: number, actualCost: number, providerName: LLMProviderName): Promise<void>;
    trackCost(cost: number, providerName?: LLMProviderName): Promise<void>;
    checkCostLimit(estimatedCost: number, _provider?: LLMProviderName): Promise<void>;
    getTodayAICost(): Promise<number>;
    getTodayProviderAICost(provider: LLMProviderName): Promise<number>;
    resetDailyCost(): Promise<void>;
    getAIStats(): Promise<{
        todayCost: number;
        dailyLimit: number;
        remainingBudget: number;
        percentUsed: number;
    }>;
    generateCacheKey(provider: LLMProviderName, model: string, prompt: string, systemPrompt?: string): string;
    getCachedCompletion(cacheKey: string): Promise<LLMCompletionResult | null>;
    cacheCompletion(cacheKey: string, result: LLMCompletionResult, ttl: number): Promise<void>;
    private resolveProviderAndModel;
    complete(req: LLMCompletionRequest, cacheTTL?: number): Promise<LLMCompletionResult>;
    stream(opts: LLMStreamOptions): Promise<LLMCompletionResult>;
}
export declare const llmGateway: LLMGateway;
//# sourceMappingURL=llm-gateway.d.ts.map