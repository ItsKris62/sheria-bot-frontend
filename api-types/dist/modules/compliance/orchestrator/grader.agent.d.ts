import type { AgentTokens } from './types';
import type { SearchResult } from '@/lib/rag/rag.service';
export interface GraderAgentResult {
    accepted: SearchResult[];
    rejected: SearchResult[];
    tokens: AgentTokens;
    gradeFailed: boolean;
}
export declare function runGraderAgent(question: string, chunks: SearchResult[], maxGradeChunks: number): Promise<GraderAgentResult>;
//# sourceMappingURL=grader.agent.d.ts.map