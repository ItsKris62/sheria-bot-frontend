import type { AgentTokens } from './types';
import type { SearchResult } from '@/lib/rag/rag.service';
import { type JurisdictionContext } from '@/types/jurisdiction';
export interface GraderAgentResult {
    accepted: SearchResult[];
    rejected: SearchResult[];
    tokens: AgentTokens;
    gradeFailed: boolean;
}
export declare function runGraderAgent(question: string, chunks: SearchResult[], jurisdictionContextOrMaxGradeChunks: JurisdictionContext | number, maxGradeChunksMaybe?: number): Promise<GraderAgentResult>;
//# sourceMappingURL=grader.agent.d.ts.map