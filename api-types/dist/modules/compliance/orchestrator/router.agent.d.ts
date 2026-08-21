import type { AgentTokens, OrchestratorRoute } from './types';
import { type JurisdictionContext } from '@/types/jurisdiction';
export interface RouterAgentResult {
    route: OrchestratorRoute;
    confidence: number;
    subQuestions: string[];
    tokens: AgentTokens;
    parseFailed: boolean;
}
export declare function runRouterAgent(question: string, jurisdictionContext: JurisdictionContext): Promise<RouterAgentResult>;
//# sourceMappingURL=router.agent.d.ts.map