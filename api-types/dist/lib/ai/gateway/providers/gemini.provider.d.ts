import { ILLMProvider, LLMCompletionRequest, LLMCompletionResult, LLMStreamOptions } from '../types';
export declare class GeminiProvider implements ILLMProvider {
    readonly name = "gemini";
    private client;
    private currentApiKey;
    private getClient;
    isConfigured(): boolean;
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
    stream(opts: LLMStreamOptions): Promise<LLMCompletionResult>;
}
//# sourceMappingURL=gemini.provider.d.ts.map