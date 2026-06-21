import { type RetrievalEvalResult } from '@/lib/source-grounding/evals';
type Options = {
    datasetPath: string;
    topK: number;
    minScore: number;
    writeJson?: string;
};
type Mode = 'v1' | 'v2' | 'prefer-v2';
type EvalReport = {
    datasetPath: string;
    itemCount: number;
    modes: Record<Mode, {
        expectedSourceHitRate: number;
        forbiddenSourceHitRate: number;
        abstainSatisfiedRate: number;
        averageMetadataCompleteness: number;
        results: RetrievalEvalResult[];
    }>;
};
export declare function runSourceVerificationEvals(options: Options): Promise<EvalReport>;
export {};
//# sourceMappingURL=run-source-verification-evals.d.ts.map