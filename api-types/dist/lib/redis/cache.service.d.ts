/**
 * High-level cache service with typed methods
 * Handles JSON serialization and cache-aside pattern
 */
export declare class CacheService {
    /**
     * Get cached value with automatic JSON parsing
     * @param key Cache key
     * @returns Parsed value or null
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set cached value with automatic JSON serialization
     * @param key Cache key
     * @param value Value to cache
     * @param ttl Time to live in seconds (optional)
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Delete cached value
     * @param key Cache key
     */
    delete(key: string): Promise<void>;
    /**
     * Invalidate cache by pattern.
     * WARNING: Uses redis.keys() which is O(N) over the full keyspace.
     * Only safe for test scripts against small key sets  -  do not call in
     * production request paths. Use deleteTrackedSet() from redis/client.ts instead.
     */
    invalidatePattern(pattern: string): Promise<number>;
    /**
     * Check if key exists in cache
     * @param key Cache key
     * @returns true if exists
     */
    exists(key: string): Promise<boolean>;
    /**
     * Get remaining TTL for cached key
     * @param key Cache key
     * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
     */
    getTTL(key: string): Promise<number>;
    /**
     * Extend TTL for existing key
     * @param key Cache key
     * @param seconds Additional seconds
     */
    extendTTL(key: string, seconds: number): Promise<boolean>;
    /**
     * Cache-aside pattern: Get from cache or fetch from source
     * If not in cache, fetches from source, caches it, then returns
     *
     * @param key Cache key
     * @param fetchFn Function to fetch data if not cached
     * @param ttl Time to live in seconds (optional)
     * @returns Cached or fetched value
     *
     * @example
     * const user = await cache.getOrSet(
     *   'user:123',
     *   async () => await prisma.user.findUnique({ where: { id: '123' } }),
     *   3600
     * );
     */
    getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T>;
    /**
     * Get multiple cached values at once
     * @param keys Array of cache keys
     * @returns Map of key to value
     */
    getMany<T>(keys: string[]): Promise<Map<string, T>>;
    /**
     * Set multiple cached values at once
     * @param entries Map of key to value
     * @param ttl Time to live in seconds (applies to all)
     */
    setMany<T>(entries: Map<string, T>, ttl?: number): Promise<void>;
    /**
     * Delete multiple cached values at once
     * @param keys Array of cache keys
     */
    deleteMany(keys: string[]): Promise<number>;
    /**
     * Increment counter in cache
     * @param key Cache key
     * @param amount Amount to increment (default: 1)
     * @returns New value
     */
    increment(key: string, amount?: number): Promise<number>;
    /**
     * Decrement counter in cache
     * @param key Cache key
     * @param amount Amount to decrement (default: 1)
     * @returns New value
     */
    decrement(key: string, amount?: number): Promise<number>;
    /**
     * Wrap a function with caching
     * Returns a cached version of the function that automatically caches results
     *
     * @param fn Function to wrap
     * @param keyGenerator Function to generate cache key from arguments
     * @param ttl Time to live in seconds
     * @returns Wrapped function
     *
     * @example
     * const getCachedUser = cache.wrap(
     *   (userId: string) => prisma.user.findUnique({ where: { id: userId } }),
     *   (userId) => `user:${userId}`,
     *   3600
     * );
     */
    wrap<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>, keyGenerator: (...args: TArgs) => string, ttl?: number): (...args: TArgs) => Promise<TResult>;
    /**
     * Clear all cache (use with caution!)
     * Only works in non-production environments
     */
    clear(): Promise<boolean>;
}
/**
 * Export singleton cache service instance
 */
export declare const cache: CacheService;
/**
 * Specific cache helpers with predefined TTLs
 */
/**
 * Cache user data
 */
export declare const userCache: {
    get: (userId: string) => Promise<unknown>;
    set: (userId: string, user: any) => Promise<void>;
    delete: (userId: string) => Promise<void>;
};
/**
 * Cache policy data
 */
export declare const policyCache: {
    get: (policyId: string) => Promise<unknown>;
    set: (policyId: string, policy: any) => Promise<void>;
    delete: (policyId: string) => Promise<void>;
};
/**
 * Cache compliance query results
 */
export declare const complianceCache: {
    get: (queryId: string) => Promise<unknown>;
    set: (queryId: string, result: any) => Promise<void>;
    delete: (queryId: string) => Promise<void>;
};
/**
 * Cache RAG search results
 */
export declare const ragCache: {
    get: (queryHash: string) => Promise<unknown>;
    set: (queryHash: string, results: any) => Promise<void>;
    delete: (queryHash: string) => Promise<void>;
};
/**
 * Cache session data
 */
export declare const sessionCache: {
    get: (sessionId: string) => Promise<unknown>;
    set: (sessionId: string, session: any) => Promise<void>;
    delete: (sessionId: string) => Promise<void>;
};
//# sourceMappingURL=cache.service.d.ts.map