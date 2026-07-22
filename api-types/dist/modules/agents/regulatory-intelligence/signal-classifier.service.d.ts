import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
import type { ClassifiedSignalCore, ProviderUsage, RawRegulatorySourceItem, ScannedSignalCandidate } from './types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface SignalClassifierDependencies {
    llmGateway?: GatewayLike;
}
export declare class SignalClassifierService {
    private readonly llmGateway;
    constructor(dependencies?: SignalClassifierDependencies);
    scanItems(agentRunId: string, items: RawRegulatorySourceItem[]): Promise<{
        candidates: ScannedSignalCandidate[];
        usage: ProviderUsage | null;
    }>;
    deepAnalyze(agentRunId: string, candidates: ScannedSignalCandidate[], scanningUsage: ProviderUsage | null): Promise<{
        signals: ClassifiedSignalCore[];
        usage: ProviderUsage[];
    }>;
}
export declare const signalClassifierService: SignalClassifierService;
export {};
//# sourceMappingURL=signal-classifier.service.d.ts.map