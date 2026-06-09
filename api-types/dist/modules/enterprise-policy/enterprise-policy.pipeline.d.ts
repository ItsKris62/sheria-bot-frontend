import { Prisma } from '@prisma/client';
type JobLike = {
    id: string;
    targetEntityId: string;
    userId: string | null;
    organizationId: string | null;
    payload: Prisma.JsonValue;
};
type ProgressFn = (progress: number, message: string, metadata?: Prisma.InputJsonValue) => Promise<void>;
export declare function runEnterprisePolicyJob(job: JobLike, progress: ProgressFn): Promise<void>;
export {};
//# sourceMappingURL=enterprise-policy.pipeline.d.ts.map