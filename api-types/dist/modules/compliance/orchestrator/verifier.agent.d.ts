import type { AgentTokens } from './types';
import type { SearchResult } from '@/lib/rag/rag.service';
export type VerifierVerdict = 'PASS' | 'PARTIAL' | 'FAIL';
export interface VerifierAgentResult {
    verdict: VerifierVerdict;
    unsupportedClaims: string[];
    tokens: AgentTokens;
    parseFailed: boolean;
}
export declare function runVerifierAgent(answer: string, evidence: SearchResult[]): Promise<VerifierAgentResult>;
//# sourceMappingURL=verifier.agent.d.ts.map