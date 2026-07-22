import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
import type { SourceReportExtract, WeeklyBrief } from './types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface BriefSynthesisDependencies {
    llmGateway?: GatewayLike;
}
export declare class ChiefOfStaffBriefSynthesisService {
    private readonly llmGateway;
    constructor(dependencies?: BriefSynthesisDependencies);
    synthesize(sources: SourceReportExtract[]): Promise<WeeklyBrief>;
}
export declare const chiefOfStaffBriefSynthesisService: ChiefOfStaffBriefSynthesisService;
export {};
//# sourceMappingURL=brief-synthesis.service.d.ts.map