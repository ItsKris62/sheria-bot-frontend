import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { type SalesEngagementLookupService } from '@/modules/agents/sales/engagement-lookup.service';
import { type GetMetricsInput, type GetMetricsResult } from './metrics-types';
type MetricsPrisma = Pick<typeof defaultPrisma, 'complianceQuery' | 'agentRun' | 'organization'>;
export interface AutomationMetricsServiceDependencies {
    prisma?: MetricsPrisma;
    salesEngagementLookupService?: SalesEngagementLookupService;
    now?: () => Date;
}
export declare class AutomationMetricsService {
    private readonly prisma;
    private readonly salesEngagementLookupService;
    private readonly now;
    constructor(dependencies?: AutomationMetricsServiceDependencies);
    getMetrics(input: GetMetricsInput): Promise<GetMetricsResult>;
    private getProductMetrics;
    private getSalesMetrics;
    private getSecurityMetrics;
}
export declare const automationMetricsService: AutomationMetricsService;
export {};
//# sourceMappingURL=metrics.service.d.ts.map