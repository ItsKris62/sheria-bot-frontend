import type { AgentTokens } from './types';
import type { SearchResult } from '@/lib/rag/rag.service';
import { type JurisdictionContext } from '@/types/jurisdiction';
export type GraderFailureClassification = 'NONE' | 'EXTERNAL_PROVIDER_BILLING_BLOCKER' | 'GRADER_MODEL_ERROR' | 'GRADER_PARSE_ERROR' | 'GRADER_INCOMPLETE_OUTPUT' | 'GRADER_ZERO_RELEVANT' | 'GRADER_JURISDICTION_MISMATCH';
export interface GraderDiagnostics {
    questionHash: string;
    jurisdiction?: string;
    inputChunkCount: number;
    gradedChunkCount: number;
    acceptedCount: number;
    rejectedCount: number;
    rawResponseLength: number;
    parsedGradeCount: number;
    model?: string;
    provider?: string;
    stopReason?: string | null;
    maxTokens: number;
    gradeFailed: boolean;
    failureClassification: GraderFailureClassification;
    chunks: Array<{
        index: number;
        vectorId?: string;
        chunkId?: string;
        documentId?: string;
        documentTitle?: string;
        jurisdictionCode?: string;
        score?: number;
    }>;
    rawResponse?: string;
}
export interface GraderAgentResult {
    accepted: SearchResult[];
    rejected: SearchResult[];
    tokens: AgentTokens;
    gradeFailed: boolean;
    diagnostics?: GraderDiagnostics;
}
export declare function runGraderAgent(question: string, chunks: SearchResult[], jurisdictionContextOrMaxGradeChunks: JurisdictionContext | number, maxGradeChunksMaybe?: number): Promise<GraderAgentResult>;
//# sourceMappingURL=grader.agent.d.ts.map