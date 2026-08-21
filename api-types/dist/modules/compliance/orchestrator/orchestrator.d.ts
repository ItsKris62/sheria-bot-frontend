import type { SearchResult } from '@/lib/rag/rag.service';
import type { CorpusVersionSnapshot } from '@/lib/rag/corpus-version';
import { type JurisdictionContext } from '@/types/jurisdiction';
export interface OrchestratorInput {
    complianceQueryId: string;
    question: string;
    answer: string;
    ragResults: SearchResult[];
    jurisdictionContext?: JurisdictionContext;
    corpusVersionSnapshot?: CorpusVersionSnapshot;
    retrievalVersion?: string;
    agenticComplexityLevel: 'simple' | 'complex';
    shadow: boolean;
}
export declare function runOrchestrator(input: OrchestratorInput): Promise<void>;
//# sourceMappingURL=orchestrator.d.ts.map