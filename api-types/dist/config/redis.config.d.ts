/**
 * Redis configuration for caching and session management
 * Optimized for Upstash Redis (HTTP/REST-based)
 */
export declare const redisConfig: {
    /**
     * Upstash Redis connection configuration (HTTP-based, no persistent TCP pool)
     */
    readonly connection: {
        readonly restUrl: string;
        readonly restToken: string;
        readonly retry: {
            readonly maxAttempts: 5;
            readonly initialDelay: 500;
            readonly maxDelay: 5000;
            readonly multiplier: 2;
        };
    };
    /**
     * TTL (Time To Live) defaults for different cache types
     * All values in seconds
     */
    readonly ttl: {
        readonly session: number;
        readonly user: number;
        readonly policy: number;
        readonly complianceQuery: number;
        readonly ragResults: number;
        readonly emailToken: number;
        readonly resetToken: number;
        readonly rateLimit: number;
        readonly apiResponse: number;
        readonly uploadMetadata: number;
        readonly notification: number;
        readonly analytics: number;
        readonly default: number;
    };
    /**
     * Cache key prefixes for organization
     * Helps prevent key collisions and enables bulk deletion
     */
    readonly keyPrefixes: {
        readonly session: "session:";
        readonly user: "user:";
        readonly policy: "policy:";
        readonly compliance: "compliance:";
        readonly rag: "rag:";
        readonly token: "token:";
        readonly rateLimit: "ratelimit:";
        readonly cache: "cache:";
        readonly queue: "queue:";
        readonly lock: "lock:";
        readonly notification: "notification:";
        readonly analytics: "analytics:";
        readonly pubsub: "pubsub:";
    };
    /**
     * Pub/Sub channel names
     * Used for real-time notifications and SSE
     */
    readonly channels: {
        readonly notifications: "notifications:";
        readonly policyProgress: "policy:progress:";
        readonly checklistProgress: "checklist:progress:";
        readonly systemEvents: "system:events";
        readonly userEvents: "user:events:";
        readonly alertUser: "alerts:user:";
    };
    /**
     * Queue configuration for background jobs
     */
    readonly queues: {
        readonly email: {
            readonly name: "email-queue";
            readonly concurrency: 5;
            readonly maxAttempts: 3;
        };
        readonly documentProcessing: {
            readonly name: "document-processing-queue";
            readonly concurrency: 2;
            readonly maxAttempts: 3;
        };
        readonly policyGeneration: {
            readonly name: "policy-generation-queue";
            readonly concurrency: 3;
            readonly maxAttempts: 2;
        };
        readonly indexing: {
            readonly name: "indexing-queue";
            readonly concurrency: 2;
            readonly maxAttempts: 3;
        };
    };
    /**
     * Rate limiting configuration
     */
    readonly rateLimiting: {
        readonly defaultWindow: 60;
        readonly slidingWindow: true;
        readonly blockDuration: 900;
        readonly tiers: {
            readonly auth: {
                readonly login: {
                    readonly max: 5;
                    readonly window: 900;
                };
                readonly register: {
                    readonly max: 3;
                    readonly window: 3600;
                };
                readonly resetPassword: {
                    readonly max: 3;
                    readonly window: 3600;
                };
            };
            readonly api: {
                readonly default: {
                    readonly max: 100;
                    readonly window: 900;
                };
                readonly policyGeneration: {
                    readonly max: 10;
                    readonly window: 3600;
                };
                readonly complianceQuery: {
                    readonly max: 50;
                    readonly window: 3600;
                };
                readonly upload: {
                    readonly max: 20;
                    readonly window: 3600;
                };
            };
            readonly global: {
                readonly max: 1000;
                readonly window: 60;
            };
        };
    };
    /**
     * Distributed lock configuration
     * For preventing race conditions in distributed system
     */
    readonly locks: {
        readonly defaultTTL: 30;
        readonly retry: {
            readonly maxAttempts: 3;
            readonly delay: 100;
        };
        readonly types: {
            readonly documentProcessing: {
                readonly ttl: 300;
            };
            readonly policyGeneration: {
                readonly ttl: 300;
            };
            readonly userUpdate: {
                readonly ttl: 10;
            };
        };
    };
    /**
     * Memory management
     */
    readonly memory: {
        readonly maxMemory: 100;
        readonly evictionPolicy: "allkeys-lru";
        readonly warningThreshold: 80;
    };
    /**
     * Persistence configuration
     */
    readonly persistence: {
        readonly enabled: boolean;
        readonly snapshot: {
            readonly enabled: boolean;
            readonly interval: 3600;
        };
        readonly aof: {
            readonly enabled: boolean;
            readonly fsync: "everysec";
        };
    };
    /**
     * Logging configuration
     */
    readonly logging: {
        readonly logCommands: boolean;
        readonly logConnections: true;
        readonly logErrors: true;
        readonly logSlowCommands: true;
        readonly slowCommandThreshold: 100;
    };
};
/**
 * Build full cache key with prefix
 * @param prefix Key prefix
 * @param identifier Unique identifier
 * @returns Full cache key
 */
export declare function buildCacheKey(prefix: string, identifier: string | number): string;
/**
 * Build session key for user
 * @param sessionId Session ID
 * @returns Session cache key
 */
export declare function getSessionKey(sessionId: string): string;
/**
 * Build user cache key
 * @param userId User ID
 * @returns User cache key
 */
export declare function getUserKey(userId: string): string;
/**
 * Build policy cache key
 * @param policyId Policy ID or query hash
 * @returns Policy cache key
 */
export declare function getPolicyKey(policyId: string): string;
/**
 * Build rate limit key
 * @param identifier User ID, IP, or other identifier
 * @param action Action being rate limited
 * @returns Rate limit key
 */
export declare function getRateLimitKey(identifier: string, action: string): string;
/**
 * Build notification channel for user
 * @param userId User ID
 * @returns Pub/Sub channel name
 */
export declare function getNotificationChannel(userId: string): string;
/**
 * Build policy progress channel
 * @param policyId Policy ID
 * @returns Pub/Sub channel name
 */
export declare function getPolicyProgressChannel(policyId: string): string;
/**
 * Build checklist progress channel
 * @param checklistId Checklist ID
 * @returns Pub/Sub channel name
 */
export declare function getChecklistProgressChannel(checklistId: string): string;
/**
 * Build alert SSE channel for a user
 * @param userId User ID
 * @returns Pub/Sub channel name
 */
export declare function getAlertChannel(userId: string): string;
/**
 * Get TTL for cache type
 * @param cacheType Type of cached data
 * @returns TTL in seconds
 */
export declare function getTTL(cacheType: keyof typeof redisConfig.ttl): number;
/**
 * Calculate retry delay for Redis connection
 * @param attemptNumber Current attempt number (1-indexed)
 * @returns Delay in milliseconds
 */
export declare function getRetryDelay(attemptNumber: number): number;
/**
 * Export type
 */
export type RedisConfig = typeof redisConfig;
//# sourceMappingURL=redis.config.d.ts.map