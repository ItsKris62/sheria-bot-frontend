import { ILLMProvider, LLMCompletionRequest, LLMCompletionResult, LLMStreamOptions } from '../types';
export declare class OpenAIProvider implements ILLMProvider {
    readonly name = "openai";
    private client;
    private currentApiKey;
    private getClient;
    isConfigured(): boolean;
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
    stream(opts: LLMStreamOptions): Promise<LLMCompletionResult>;
}
//# sourceMappingURL=openai.provider.d.ts.map