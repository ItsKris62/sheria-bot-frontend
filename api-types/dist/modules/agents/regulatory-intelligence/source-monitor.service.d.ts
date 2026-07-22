import { BlogAuthorityType, BlogJurisdiction, BlogMonitoringMethod, BlogSourceType } from '@prisma/client';
import { prisma as defaultPrisma } from '@/lib/prisma/client';
import { AIRateLimiter } from '@/lib/ai/rate-limiter';
import type { SourceMonitorResult, UnverifiedSourceGap } from './types';
interface VerifiedSourceDefinition {
    sourceId: string;
    name: string;
    jurisdiction: BlogJurisdiction;
    countryLabel: string;
    authorityType: BlogAuthorityType;
    sourceType: BlogSourceType;
    monitoringMethod: BlogMonitoringMethod;
    baseUrl: string;
    feedUrl?: string;
    topics: string[];
    keywords: string[];
}
interface BlogSourceMonitorRow {
    id: string;
    name: string;
    baseUrl: string;
    feedUrl: string | null;
    monitoringMethod: BlogMonitoringMethod;
    maxItemsPerRun: number;
    fetchTimeoutMs: number;
}
interface BlogSourceItemRow {
    id: string;
    monitorId: string;
    title: string;
    url: string;
    normalizedUrl: string;
    summary: string | null;
    jurisdiction: string;
    authorityType: string;
    sourceType: string;
    publicationDate: Date | null;
    discoveredAt: Date;
    contentHash: string;
    rawContentHash: string | null;
    monitor: {
        name: string;
    };
}
interface BlogDiscoverySummary {
    status: string;
    itemsFound?: number;
    itemsCreated?: number;
    duplicateCount?: number;
    failureCount?: number;
    errorMessage?: string | null;
}
interface SourceMonitorPrisma {
    blogSourceMonitor: {
        upsert(args: object): Promise<BlogSourceMonitorRow>;
        findMany(args: object): Promise<BlogSourceMonitorRow[]>;
    };
    blogSourceItem: {
        findMany(args: object): Promise<BlogSourceItemRow[]>;
    };
}
export interface SourceMonitorDependencies {
    prisma?: SourceMonitorPrisma;
    discoveryRunner?: (params: {
        prisma: typeof defaultPrisma;
        monitorId: string;
        triggeredBy: 'SYSTEM';
    }) => Promise<BlogDiscoverySummary>;
    fetchRobots?: (url: string, timeoutMs: number) => Promise<string | null>;
    rateLimiterFactory?: (domain: string) => AIRateLimiter;
    now?: () => Date;
}
export declare class SourceMonitorService {
    private readonly prisma;
    private readonly discoveryRunner;
    private readonly fetchRobots;
    private readonly rateLimiters;
    private readonly rateLimiterFactory;
    private readonly now;
    constructor(dependencies?: SourceMonitorDependencies);
    getUnverifiedSourceGaps(): UnverifiedSourceGap[];
    getVerifiedSourceDefinitions(): readonly VerifiedSourceDefinition[];
    ensureVerifiedMonitors(agentRunId: string): Promise<void>;
    scanSources(agentRunId: string): Promise<SourceMonitorResult>;
    private getLimiter;
}
export declare const sourceMonitorService: SourceMonitorService;
export {};
//# sourceMappingURL=source-monitor.service.d.ts.map