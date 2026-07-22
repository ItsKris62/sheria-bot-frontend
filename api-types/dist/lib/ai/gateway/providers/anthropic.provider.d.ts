import { ILLMProvider, LLMCompletionRequest, LLMCompletionResult, LLMStreamOptions } from '../types';
export declare class AnthropicProvider implements ILLMProvider {
    readonly name = "anthropic";
    private client;
    private currentApiKey;
    private getClient;
    isConfigured(): boolean;
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
    stream(opts: LLMStreamOptions): Promise<LLMCompletionResult>;
}
//# sourceMappingURL=anthropic.provider.d.ts.map