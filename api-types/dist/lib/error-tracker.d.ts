/**
 * Lightweight error tracking for production.
 * Tracks error rates and logs critical alerts when thresholds are breached.
 * No external dependency  -  uses structured logging for Railway log drain.
 */
interface ErrorEntry {
    message: string;
    code: string;
    count: number;
    firstSeen: number;
    lastSeen: number;
}
declare class ErrorTracker {
    private errors;
    private windowMs;
    private alertThreshold;
    private cleanupInterval;
    constructor(windowMs?: number, alertThreshold?: number);
    /**
     * Start the periodic cleanup of stale entries.
     * Call once at application startup.
     */
    start(): void;
    /**
     * Stop the tracker (call on graceful shutdown).
     */
    stop(): void;
    /**
     * Strip internal paths and stack traces from error messages before storage.
     * Prevents Prisma invocation paths, Render file paths, and node_modules from
     * accumulating in memory and appearing in health endpoint responses.
     */
    private sanitize;
    /**
     * Record an error occurrence.
     */
    track(error: Error | string, code?: string): void;
    /**
     * Get a summary of recent errors (for /health/detailed or admin dashboards).
     */
    getSummary(): {
        totalUniqueErrors: number;
        topErrors: ErrorEntry[];
    };
    /**
     * Remove entries older than the window.
     */
    private cleanup;
}
/** Singleton error tracker  -  5 min window, alert at 10 occurrences */
export declare const errorTracker: ErrorTracker;
export { ErrorTracker };
//# sourceMappingURL=error-tracker.d.ts.map