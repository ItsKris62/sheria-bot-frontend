interface AcquireLockParams {
    key: string;
    ttlSeconds: number;
    context: Record<string, string>;
}
interface LockHandle {
    release: () => Promise<void>;
}
/**
 * Acquires a distributed lock via Redis SET NX EX. Returns a handle with a
 * release() method, or null if the lock is already held.
 *
 * Caller must call release() in a finally block. If the process crashes before
 * release, the lock auto-expires after ttlSeconds.
 *
 * Token-based release: the stored token is compared before DEL to avoid
 * releasing a lock acquired by another process after our TTL expired.
 */
export declare function acquireLock(params: AcquireLockParams): Promise<LockHandle | null>;
export {};
//# sourceMappingURL=redis-lock.d.ts.map