export type LLMProviderName = 'anthropic' | 'openai' | 'gemini';
export interface LLMCompletionRequest {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    metadata?: Record<string, any>;
    overrideTimeoutMs?: number;
    provider?: LLMProviderName;
    useCase?: 'policy' | 'checklist' | 'query' | 'verification' | 'analysis' | 'default';
    allowFallback?: boolean;
    signal?: AbortSignal;
}
export interface LLMCompletionResult {
    content: string;
    provider: LLMProviderName;
    model: string;
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
    stopReason: string | null;
    cached?: boolean;
}
export interface LLMStreamOptions extends LLMCompletionRequest {
    onChunk?: (chunk: string) => void;
    onComplete?: (result: LLMCompletionResult) => void;
    onError?: (error: Error) => void;
    externalAbortSignal?: AbortSignal;
}
export interface ILLMProvider {
    readonly name: LLMProviderName;
    isConfigured(): boolean;
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
    stream(opts: LLMStreamOptions): Promise<LLMCompletionResult>;
}
export declare class LLMError extends Error {
    constructor(message: string);
}
export declare class LLMProviderError extends LLMError {
    provider: string;
    status?: number;
    retryable: boolean;
    constructor(provider: string, message: string, status?: number, retryable?: boolean);
}
export declare class LLMProviderNotConfiguredError extends LLMError {
    constructor(provider: string);
}
export declare class LLMCostLimitError extends LLMError {
    constructor(message: string);
}
//# sourceMappingURL=types.d.ts.map