/**
 * AI configuration for Anthropic Claude
 * Settings for policy generation and compliance queries
 */
export declare const aiConfig: {
    /**
     * Anthropic API configuration
     */
    readonly api: {
        readonly key: string;
        readonly baseUrl: "https://api.anthropic.com/v1";
        readonly version: "2023-06-01";
    };
    /**
     * Model configuration
     * Different models for different use cases
     */
    readonly models: {
        readonly default: string;
        readonly policyGeneration: "claude-sonnet-4-6";
        readonly checklistGeneration: "claude-sonnet-4-6";
        readonly complianceQuery: "claude-haiku-4-5-20251001";
        readonly citationVerification: "claude-haiku-4-5-20251001";
        readonly complexAnalysis: "claude-opus-4-6";
        readonly embedding: "claude-haiku-4-5-20251001";
    };
    /**
     * Generation parameters
     */
    readonly parameters: {
        readonly policyTemperature: 0.3;
        readonly queryTemperature: 0.5;
        readonly policyMaxTokens: 4000;
        readonly checklistMaxTokens: 8192;
        readonly queryMaxTokens: 2000;
        readonly verificationMaxTokens: 500;
        readonly topP: 1;
        readonly topK: 0;
    };
    /**
     * Timeout configuration (milliseconds)
     */
    readonly timeout: {
        readonly default: 60000;
        readonly policyGeneration: 120000;
        readonly checklistGeneration: 200000;
        readonly checklistTier1: 240000;
        readonly checklistTier2: 200000;
        readonly checklistTier3: 150000;
        readonly complianceQuery: 45000;
        readonly streamingChunk: 10000;
    };
    /**
     * Retry configuration for API failures
     */
    readonly retry: {
        readonly maxAttempts: 3;
        readonly initialDelay: 1000;
        readonly maxDelay: 10000;
        readonly backoffMultiplier: 2;
        readonly retryableStatuses: readonly [408, 429, 500, 502, 503, 504, 529];
        readonly retryableErrors: readonly ["timeout", "network", "overloaded"];
    };
    /**
     * Rate limiting to stay within Anthropic limits
     */
    readonly rateLimit: {
        readonly requestsPerMinute: 50;
        readonly tokensPerMinute: 100000;
        readonly maxConcurrent: 5;
    };
    /**
     * Cost tracking configuration
     */
    readonly costs: {
        readonly enabled: true;
        readonly warningThreshold: 100;
        readonly dailyLimit: 500;
    };
    /**
     * Caching configuration
     * Cache responses to reduce API calls and costs
     */
    readonly caching: {
        readonly enabled: true;
        readonly ttl: {
            readonly policyGeneration: 3600;
            readonly complianceQuery: 86400;
            readonly citationVerification: 604800;
        };
        readonly keyPrefix: "claude:cache:";
    };
    /**
     * Streaming configuration
     */
    readonly streaming: {
        readonly enabled: true;
        readonly bufferSize: 1024;
        readonly progressInterval: 100;
    };
    /**
     * System prompts configuration
     */
    readonly systemPrompts: {
        readonly kenyanContext: "You are an expert on Kenyan regulatory law and compliance. Always cite specific Kenyan legislation with section numbers.";
        readonly jsonOutput: "Always respond with valid JSON. Do not include any text before or after the JSON object.";
        readonly citationRequirement: "Every regulatory statement must include a citation to the specific Kenyan law, section, and subsection.";
    };
    /**
     * Safety and content filtering
     */
    readonly safety: {
        readonly filterLevel: "moderate";
        readonly blockHarmful: true;
        readonly logFlagged: true;
    };
    /**
     * Logging configuration
     */
    readonly logging: {
        readonly logCalls: boolean;
        readonly logTokens: true;
        readonly logContent: boolean;
        readonly logErrorsOnly: boolean;
    };
};
/**
 * Get model for specific use case
 * @param useCase The use case for model selection
 * @returns Model ID string
 */
export declare function getModelForUseCase(useCase: 'policy' | 'checklist' | 'query' | 'verification' | 'analysis' | 'default'): string;
/**
 * Calculate retry delay with exponential backoff
 * @param attemptNumber Current attempt number (1-indexed)
 * @returns Delay in milliseconds
 */
export declare function getRetryDelay(attemptNumber: number): number;
/**
 * Check if error is retryable
 * @param error Error object or status code
 * @returns true if should retry
 */
export declare function isRetryableError(error: any): boolean;
/**
 * Export type
 */
export type AIConfig = typeof aiConfig;
//# sourceMappingURL=ai.config.d.ts.map