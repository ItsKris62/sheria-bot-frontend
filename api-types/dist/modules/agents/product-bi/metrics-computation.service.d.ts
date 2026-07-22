import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type PostHogQueryClient } from '@/lib/posthog/query-client';
import type { GroundedMetricsSnapshot } from './types';
type MetricsPrisma = Pick<typeof defaultPrisma, 'organization' | 'agentRun' | 'usagePeriod' | 'user'>;
export interface MetricsComputationDependencies {
    prisma?: MetricsPrisma;
    postHogQueryClient?: PostHogQueryClient;
    now?: () => Date;
}
export interface ComputeSnapshotInput {
    windowDays: number;
}
export declare class ProductBiMetricsComputationService {
    private readonly prisma;
    private readonly postHogQueryClient;
    private readonly now;
    constructor(dependencies?: MetricsComputationDependencies);
    computeSnapshot(input: ComputeSnapshotInput): Promise<GroundedMetricsSnapshot>;
    private computeOrganizationCountsByPlan;
    private computeWorkforceCosts;
    private computeUpgradeMomentCandidates;
    private computeChurnRiskOrgs;
    private computePilotCohorts;
    private computeEngagement;
}
export declare const productBiMetricsComputationService: ProductBiMetricsComputationService;
export {};
//# sourceMappingURL=metrics-computation.service.d.ts.map