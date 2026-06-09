import { Redis } from '@upstash/redis';
/**
 * Upstash Redis client (HTTP-based, serverless-friendly).
 * Replaces the previous ioredis TCP client.
 *
 * Key API differences from ioredis:
 *  - setex(key, ttl, val)  => set(key, val, { ex: ttl })
 *  - zadd(key, score, mem) => zadd(key, { score, member: mem })
 *  - No connection lifecycle (connect / quit / events) -- HTTP per call
 */
export declare const redis: Redis;
export declare function connectRedis(): Promise<void>;
export declare function disconnectRedis(): Promise<void>;
export declare function checkRedisHealth(): Promise<boolean>;
export declare function getRedisStats(): Promise<{
    connected: boolean;
    usedMemory: string;
    connectedClients: number;
    totalCommandsProcessed: number;
}>;
export declare function get(key: string): Promise<string | null>;
export declare function set(key: string, value: string, ttl?: number): Promise<boolean>;
export declare function del(key: string): Promise<boolean>;
export declare function exists(key: string): Promise<boolean>;
export declare function expire(key: string, seconds: number): Promise<boolean>;
export declare function ttl(key: string): Promise<number>;
export declare function keys(pattern: string): Promise<string[]>;
export declare function deletePattern(pattern: string): Promise<number>;
/**
 * Atomically deletes all keys tracked in a Redis Set index, then deletes the
 * index itself. O(M) where M is the number of tracked members  -  no keyspace scan.
 *
 * Members may include expired keys (natural TTL expiry without SREM); DEL on a
 * non-existent key is a safe no-op.
 */
export declare function deleteTrackedSet(setKey: string): Promise<number>;
export declare function increment(key: string, amount?: number): Promise<number>;
export declare function decrement(key: string, amount?: number): Promise<number>;
export declare function hset(key: string, field: string, value: string): Promise<boolean>;
export declare function hget(key: string, field: string): Promise<string | null>;
export declare function hgetall(key: string): Promise<Record<string, string>>;
export declare function hdel(key: string, field: string): Promise<boolean>;
export declare function lpush(key: string, ...values: string[]): Promise<number>;
export declare function rpush(key: string, ...values: string[]): Promise<number>;
export declare function lpop(key: string): Promise<string | null>;
export declare function lrange(key: string, start: number, stop: number): Promise<string[]>;
export declare function sadd(key: string, ...members: string[]): Promise<number>;
export declare function smembers(key: string): Promise<string[]>;
export declare function sismember(key: string, member: string): Promise<boolean>;
export declare function flushAll(): Promise<boolean>;
export { redis as redisClient };
export type { Redis };
//# sourceMappingURL=client.d.ts.map