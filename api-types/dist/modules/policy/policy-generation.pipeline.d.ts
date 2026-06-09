import { Prisma } from '@prisma/client';
type JobLike = {
    id: string;
    targetEntityId: string;
    userId: string | null;
    payload: Prisma.JsonValue;
};
type ProgressFn = (progress: number, message: string, metadata?: Prisma.InputJsonValue) => Promise<void>;
export declare function runPolicyGenerationJob(job: JobLike, progress: ProgressFn): Promise<void>;
export {};
//# sourceMappingURL=policy-generation.pipeline.d.ts.map