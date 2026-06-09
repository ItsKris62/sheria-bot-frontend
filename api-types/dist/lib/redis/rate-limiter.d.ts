/**
 * Rate limit result
 */
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
    retryAfter?: number;
    /** Set when the limiter itself could not be reached; used to distinguish
     *  a capacity denial from a service-unavailability denial. */
    reason?: 'rate_limit_exceeded' | 'rate_limit_service_unavailable';
}
/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
    max: number;
    window: number;
    identifier: string;
    action: string;
}
/**
 * Rate limiter service using sliding window algorithm
 * More accurate than fixed window, prevents bursts at window boundaries
 */
export declare class RateLimiter {
    /**
     * Check if request is allowed under rate limit
     * Uses sliding window algorithm with sorted sets
     *
     * @param identifier User ID, IP address, or other identifier
     * @param action Action being rate limited (e.g., 'login', 'api')
     * @param max Maximum requests allowed
     * @param windowSeconds Time window in seconds
     * @returns Rate limit result
     */
    check(identifier: string, action: string, max: number, windowSeconds: number, options?: {
        failClosed?: boolean;
    }): Promise<RateLimitResult>;
    /**
     * Check and throw error if rate limit exceeded
     * Convenience method for middleware
     */
    checkOrThrow(identifier: string, action: string, max: number, windowSeconds: number): Promise<void>;
    /**
     * Get remaining requests for identifier
     */
    getRemaining(identifier: string, action: string, max: number, windowSeconds: number): Promise<number>;
    /**
     * Reset rate limit for identifier
     * Useful for testing or after manual review
     */
    reset(identifier: string, action: string): Promise<void>;
    /**
     * Block identifier temporarily
     * Used for security incidents or abuse
     */
    block(identifier: string, action: string, durationSeconds: number): Promise<void>;
    /**
     * Check if identifier is blocked
     */
    isBlocked(identifier: string, action: string): Promise<boolean>;
    /**
     * Unblock identifier
     */
    unblock(identifier: string, action: string): Promise<void>;
}
/**
 * Export singleton rate limiter instance
 */
export declare const rateLimiter: RateLimiter;
/**
 * Predefined rate limiters for common actions
 */
/**
 * Authentication rate limiting
 */
export declare const authRateLimiter: {
    /**
     * Login attempts
     * 5 attempts per 15 minutes per IP/email
     */
    login: (identifier: string) => Promise<RateLimitResult>;
    /**
     * Registration attempts
     * 3 attempts per hour per IP
     */
    register: (identifier: string) => Promise<RateLimitResult>;
    /**
     * Password reset attempts
     * 3 attempts per hour per email
     */
    resetPassword: (identifier: string) => Promise<RateLimitResult>;
    /**
     * Resend verification email attempts
     * 3 attempts per hour per email address.
     *
     * Uses the sliding-window RateLimiter (atomic pipeline) rather than the
     * old INCR+EXPIRE two-step which had a race condition: if the process died
     * between the two commands the counter key would never expire, permanently
     * locking the user out until a manual Redis DEL.
     */
    resendVerification: (identifier: string) => Promise<RateLimitResult>;
};
/**
 * API rate limiting
 */
export declare const apiRateLimiter: {
    /**
     * Default API rate limit
     * 100 requests per 15 minutes per user
     */
    default: (userId: string) => Promise<RateLimitResult>;
    /**
     * Policy generation rate limit
     * 10 generations per hour per user (expensive operation)
     */
    policyGeneration: (userId: string) => Promise<RateLimitResult>;
    /**
     * Compliance query rate limit
     * 50 queries per hour per user
     */
    complianceQuery: (userId: string) => Promise<RateLimitResult>;
    /**
     * Document upload rate limit
     * 20 uploads per hour per user
     */
    upload: (userId: string) => Promise<RateLimitResult>;
};
/**
 * Global rate limiting (across all users)
 */
export declare const globalRateLimiter: {
    /**
     * Global API rate limit
     * 1000 requests per minute across all users
     */
    check: () => Promise<RateLimitResult>;
};
/**
 * Rate limit middleware helper
 * Returns rate limit headers for HTTP responses
 */
export declare function getRateLimitHeaders(result: RateLimitResult): Record<string, string>;
/**
 * Sliding window counter implementation (alternative simpler approach)
 * Uses simple counter with expiration
 */
export declare class SimpleRateLimiter {
    check(identifier: string, action: string, max: number, windowSeconds: number): Promise<RateLimitResult>;
}
export declare const simpleRateLimiter: SimpleRateLimiter;
//# sourceMappingURL=rate-limiter.d.ts.map