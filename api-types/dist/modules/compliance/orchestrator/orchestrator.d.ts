import type { SearchResult } from '@/lib/rag/rag.service';
export interface OrchestratorInput {
    complianceQueryId: string;
    question: string;
    answer: string;
    ragResults: SearchResult[];
    agenticComplexityLevel: 'simple' | 'complex';
    shadow: boolean;
}
export declare function runOrchestrator(input: OrchestratorInput): Promise<void>;
//# sourceMappingURL=orchestrator.d.ts.map