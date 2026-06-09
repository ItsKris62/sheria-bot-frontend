import type { AgentTokens, OrchestratorRoute } from './types';
export interface RouterAgentResult {
    route: OrchestratorRoute;
    confidence: number;
    subQuestions: string[];
    tokens: AgentTokens;
    parseFailed: boolean;
}
export declare function runRouterAgent(question: string): Promise<RouterAgentResult>;
//# sourceMappingURL=router.agent.d.ts.map