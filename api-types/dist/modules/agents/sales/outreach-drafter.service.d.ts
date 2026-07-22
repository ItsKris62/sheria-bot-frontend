import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
import type { EngagementContext, GroundedSalesProspect, OutreachDraftContent } from './types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface OutreachDrafterDependencies {
    llmGateway?: GatewayLike;
}
export declare class SalesOutreachDrafterService {
    private readonly llmGateway;
    constructor(dependencies?: OutreachDrafterDependencies);
    draftOutreach(prospect: GroundedSalesProspect, engagement: EngagementContext): Promise<OutreachDraftContent>;
}
export declare const salesOutreachDrafterService: SalesOutreachDrafterService;
export {};
//# sourceMappingURL=outreach-drafter.service.d.ts.map