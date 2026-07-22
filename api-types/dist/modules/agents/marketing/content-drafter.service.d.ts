import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
import type { DraftContent, GroundedMarketingSignal } from './types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface ContentDrafterDependencies {
    llmGateway?: GatewayLike;
}
export declare class MarketingContentDrafterService {
    private readonly llmGateway;
    constructor(dependencies?: ContentDrafterDependencies);
    draftNewsletterItem(signal: GroundedMarketingSignal): Promise<DraftContent>;
    draftLinkedInPost(signal: GroundedMarketingSignal): Promise<DraftContent>;
    private draft;
}
export declare const marketingContentDrafterService: MarketingContentDrafterService;
export {};
//# sourceMappingURL=content-drafter.service.d.ts.map