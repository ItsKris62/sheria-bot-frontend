/**
 * In-process rate limiter for Anthropic API calls.
 *
 * Enforces two independent constraints:
 *   1. Requests per minute   -  sliding window over the last 60 s
 *   2. Max concurrent        -  active in-flight requests at any instant
 *
 * acquire() blocks until a slot is available, then returns.
 * release() must be called in a finally block after every acquire().
 */
export declare class AIRateLimiter {
    private activeRequests;
    private requestTimestamps;
    private readonly queue;
    private readonly maxPerMinute;
    private readonly maxConcurrent;
    constructor(maxPerMinute: number, maxConcurrent: number);
    acquire(): Promise<void>;
    release(): void;
    /** Reject all queued waiters (e.g., on server shutdown). */
    drainQueue(reason?: string): void;
    stats(): {
        activeRequests: number;
        queueLength: number;
        windowCount: number;
    };
    private sleep;
}
export declare const aiRateLimiter: AIRateLimiter;
//# sourceMappingURL=rate-limiter.d.ts.map