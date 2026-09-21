export declare const PASSKEY_RATE_LIMITS: {
    readonly registrationOptions: {
        readonly max: 10;
        readonly windowSec: 3600;
    };
    readonly registrationVerify: {
        readonly max: 10;
        readonly windowSec: 3600;
    };
    readonly authOptions: {
        readonly max: 30;
        readonly windowSec: 900;
    };
    readonly authVerify: {
        readonly max: 5;
        readonly windowSec: 300;
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
}
/**
 * Atomic sliding-counter rate limiter using Redis INCR + EXPIRE.
 */
export declare function checkRateLimit(params: CheckRateLimitParams): Promise<CheckRateLimitResult>;
//# sourceMappingURL=webauthn-rate-limit.d.ts.map