import type { Redis } from '@upstash/redis';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type ErrorTracker } from '@/lib/error-tracker';
import type { GroundedOpsSnapshot } from './types';
type SnapshotPrisma = Pick<typeof defaultPrisma, 'agentRun'> & {
    $queryRaw<T>(query: TemplateStringsArray | unknown, ...values: unknown[]): Promise<T>;
};
type SnapshotRedis = Pick<Redis, 'ping'>;
export interface OpsHealthSnapshotDependencies {
    prisma?: SnapshotPrisma;
    redis?: SnapshotRedis;
    errorTracker?: ErrorTracker;
    now?: () => Date;
}
export interface ComputeOpsSnapshotInput {
    windowDays: number;
}
export declare class OpsHealthSnapshotService {
    private readonly prisma;
    private readonly redis;
    private readonly errorTracker;
    private readonly now;
    constructor(dependencies?: OpsHealthSnapshotDependencies);
    computeSnapshot(input: ComputeOpsSnapshotInput): Promise<GroundedOpsSnapshot>;
    private computeWorkforceCosts;
    private computeServiceHealth;
    private computeErrorSummary;
}
export declare const opsHealthSnapshotService: OpsHealthSnapshotService;
export {};
//# sourceMappingURL=ops-health-snapshot.service.d.ts.map