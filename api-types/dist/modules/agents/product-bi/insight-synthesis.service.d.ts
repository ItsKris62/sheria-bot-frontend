import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
import type { GroundedMetricsSnapshot, InsightNarrative } from './types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface InsightSynthesisDependencies {
    llmGateway?: GatewayLike;
}
export declare class ProductBiInsightSynthesisService {
    private readonly llmGateway;
    constructor(dependencies?: InsightSynthesisDependencies);
    synthesize(snapshot: GroundedMetricsSnapshot): Promise<InsightNarrative>;
}
export declare const productBiInsightSynthesisService: ProductBiInsightSynthesisService;
export {};
//# sourceMappingURL=insight-synthesis.service.d.ts.map