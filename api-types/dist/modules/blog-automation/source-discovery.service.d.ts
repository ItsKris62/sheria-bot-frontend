import type { prisma as appPrisma } from '@/lib/prisma/client';
type BlogAutomationPrisma = typeof appPrisma;
export declare function runSourceDiscoveryForMonitor({ prisma, monitorId, triggeredBy, triggeredByUserId, }: {
    prisma: BlogAutomationPrisma;
    monitorId: string;
    triggeredBy: 'ADMIN' | 'CRON' | 'SYSTEM';
    triggeredByUserId?: string;
}): Promise<{
    status: string;
    message: string;
    itemsFound?: undefined;
    itemsCreated?: undefined;
    duplicateCount?: undefined;
    failureCount?: undefined;
    errorMessage?: undefined;
} | {
    status: "FAILED" | "SUCCESS" | "PARTIAL_SUCCESS";
    itemsFound: number;
    itemsCreated: number;
    duplicateCount: number;
    failureCount: number;
    errorMessage: string | null;
    message?: undefined;
}>;
export {};
//# sourceMappingURL=source-discovery.service.d.ts.map