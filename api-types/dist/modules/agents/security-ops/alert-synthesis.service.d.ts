import type { LLMCompletionRequest, LLMCompletionResult } from '@/lib/ai/gateway/types';
import type { GroundedOpsSnapshot, OpsNarrative } from './types';
interface GatewayLike {
    complete(req: LLMCompletionRequest): Promise<LLMCompletionResult>;
}
export interface AlertSynthesisDependencies {
    llmGateway?: GatewayLike;
}
export declare class SecurityOpsAlertSynthesisService {
    private readonly llmGateway;
    constructor(dependencies?: AlertSynthesisDependencies);
    synthesize(snapshot: GroundedOpsSnapshot): Promise<OpsNarrative>;
}
export declare const securityOpsAlertSynthesisService: SecurityOpsAlertSynthesisService;
export {};
//# sourceMappingURL=alert-synthesis.service.d.ts.map