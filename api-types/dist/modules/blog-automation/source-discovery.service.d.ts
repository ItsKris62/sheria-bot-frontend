export declare function runSourceDiscoveryForMonitor({ monitorId, triggeredBy, triggeredByUserId, }: {
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
//# sourceMappingURL=source-discovery.service.d.ts.map