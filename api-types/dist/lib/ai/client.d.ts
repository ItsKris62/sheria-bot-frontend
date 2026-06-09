import Anthropic from '@anthropic-ai/sdk';
/**
 * AI completion options
 */
export interface AICompletionOptions {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    metadata?: Record<string, any>;
    /**
     * Override the overall request timeout (ms).
     * When set, takes precedence over the useCase-derived timeout in stream() and complete().
     * Use this for tier-specific timeouts in the three-tier checklist generation pipeline.
     */
    overrideTimeoutMs?: number;
}
/**
 * AI completion result
 */
export interface AICompletionResult {
    content: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    cached?: boolean;
    /** Anthropic stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | null */
    stopReason?: string | null;
}
/**
 * AI streaming options
 */
export interface AIStreamOptions extends AICompletionOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (result: AICompletionResult) => void;
    onError?: (error: Error) => void;
    /** External abort signal. When fired (e.g. client disconnect), aborts the Anthropic stream. */
    externalAbortSignal?: AbortSignal;
}
/**
 * Get today's AI cost
 */
export declare function getTodayAICost(): Promise<number>;
/**
 * Complete AI request with retries
 * @param options Completion options
 * @param useCase Use case for model selection (optional)
 * @param cacheTTL Cache TTL in seconds (0 = no cache)
 */
export declare function complete(options: AICompletionOptions, useCase?: 'policy' | 'checklist' | 'query' | 'verification', cacheTTL?: number): Promise<AICompletionResult>;
/**
 * Stream AI completion
 * @param options Streaming options
 * @param useCase Use case for model selection
 */
export declare function stream(options: AIStreamOptions, useCase?: 'policy' | 'checklist' | 'query' | 'verification'): Promise<AICompletionResult>;
/**
 * Get AI usage statistics
 */
export declare function getAIStats(): Promise<{
    todayCost: number;
    dailyLimit: number;
    remainingBudget: number;
    percentUsed: number;
}>;
/**
 * Reset daily cost (admin only - use with caution)
 */
export declare function resetDailyCost(): Promise<void>;
export { Anthropic };
//# sourceMappingURL=client.d.ts.map