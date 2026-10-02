export declare function getAuthOptionsRateLimits(): {
    max: number;
    windowSec: number;
};
export declare const PASSKEY_RATE_LIMITS: {
    registrationOptions: {
        max: number;
        windowSec: number;
    };
    registrationVerify: {
        max: number;
        windowSec: number;
    };
    readonly authOptions: {
        max: number;
        windowSec: number;
    };
    authVerify: {
        max: number;
        windowSec: number;
    };
};
export declare const PASSKEY_REDIS_KEYS: {
    readonly regOptionsRateLimit: (userId: string) => string;
    readonly regVerifyRateLimit: (userId: string) => string;
    readonly authOptionsRateLimit: (ip: string) => string;
    readonly authVerifyRateLimit: (challengeId: string) => string;
    readonly regChallenge: (userId: string) => string;
    readonly authChallenge: (challengeId: string) => string;
};
export interface CheckRateLimitParams {
    key: string;
    max: number;
    windowSec: number;
}
export interface CheckRateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}
/**
 * Builds a rate limit key for passkey authentication options.
 * - If IP is valid: returns 'sheriabot:passkey:rl:auth_opts:<ip>'
 * - If sessionIdentifier is provided: appends truncated SHA-256 hash to reduce NAT collateral
 * - If IP is null or invalid: returns null (fail closed)
 */
export declare function buildAuthOptionsRateLimitKey(params: {
    ip: string | null | undefined;
    sessionIdentifier?: string | null;
}): string | null;
/**
 * Atomic sliding-counter rate limiter using Redis INCR + EXPIRE.
 */
export declare function checkRateLimit(params: CheckRateLimitParams): Promise<CheckRateLimitResult>;
/**
 * Rate limiter specifically for passkey authentication options with safe IP/session keying.
 */
export declare function checkAuthOptionsRateLimit(params: {
    ip: string | null | undefined;
    sessionIdentifier?: string | null;
}): Promise<CheckRateLimitResult>;
//# sourceMappingURL=webauthn-rate-limit.d.ts.map