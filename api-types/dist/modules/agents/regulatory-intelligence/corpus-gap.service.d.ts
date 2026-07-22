import type { ClassifiedSignalCore, CorpusGapResult } from './types';
interface QueryResultLike {
    id: string;
    score: number;
    metadata: {
        documentTitle?: string;
        framework?: string;
        frameworkSlug?: string;
        source?: string;
        jurisdiction?: string;
    };
}
type QueryVectors = (queryText: string, topK?: number, namespace?: string, filter?: Record<string, unknown>) => Promise<QueryResultLike[]>;
export interface CorpusGapDependencies {
    queryVectors?: QueryVectors;
}
export declare class CorpusGapService {
    private readonly queryVectors;
    constructor(dependencies?: CorpusGapDependencies);
    checkSignal(agentRunId: string, signal: ClassifiedSignalCore): Promise<CorpusGapResult>;
}
export declare const corpusGapService: CorpusGapService;
export {};
//# sourceMappingURL=corpus-gap.service.d.ts.map