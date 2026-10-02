export interface AsyncTaskJob<T = unknown> {
    id: string;
    name: string;
    payload: T;
    execute: (payload: T) => Promise<void>;
    maxRetries?: number;
}
declare class DurableTaskRunner {
    private pendingPromises;
    /**
     * Enqueue a compliance or telemetry background task.
     * Dispatches asynchronously without stalling the calling request thread,
     * while ensuring durability through automated retries and unhandled rejection protection.
     */
    enqueue<T>(name: string, payload: T, execute: (payload: T) => Promise<void>, maxRetries?: number): void;
    private executeWithRetry;
    /**
     * Helper for non-blocking compliance audit logging
     */
    enqueueAuditLog(data: {
        userId?: string | null;
        action: string;
        entityType?: string;
        entityId?: string;
        metadata?: Record<string, unknown> | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): void;
    /**
     * Helper for non-blocking user login telemetry update
     */
    enqueueLastLoginUpdate(userId: string, ipAddress: string | null): void;
    /**
     * Await all currently in-flight background tasks (useful during graceful server shutdown)
     */
    drain(): Promise<void>;
}
export declare const durableTaskRunner: DurableTaskRunner;
export {};
//# sourceMappingURL=durable-background-tasks.d.ts.map