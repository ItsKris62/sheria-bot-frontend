/**
 * Session security configuration.
 *
 * IDLE_TIMEOUT_SECONDS   -  Maximum consecutive inactivity before the session
 *   is silently invalidated on the next request. A sliding window: every
 *   authenticated request resets the clock.
 *
 * ABSOLUTE_TIMEOUT_SECONDS  -  Hard cap on how long a session (Supabase JWT +
 *   our Redis last-seen window) can remain live regardless of activity. This
 *   matches Supabase's default access-token lifetime (1 hour) multiplied by 8
 *   to cover a full business day without requiring re-login while still
 *   bounding the exposure window.
 */
export declare const SESSION_CONFIG: {
    /** 30 minutes of inactivity invalidates the session. */
    readonly IDLE_TIMEOUT_SECONDS: number;
    /** 8-hour absolute session cap (independent of inactivity). */
    readonly ABSOLUTE_TIMEOUT_SECONDS: number;
};
/**
 * Redis key for user session cache (anchored on Supabase Auth UUID or DB User ID).
 *
 * Canonical lookup identifier:
 * - tRPC createContext / fast-path uses `user:session:${supabaseUserId}` (JWT `sub`).
 * - Auth handlers write to both `user:session:${supabaseUserId}` and `user:session:${prismaUserId}`
 *   to guarantee instant cache hits regardless of which identifier is presented.
 */
export declare const userSessionKey: (userId: string) => string;
/** Redis key for the last-activity timestamp of an authenticated user (anchored on DB User ID). */
export declare const lastSeenKey: (userId: string) => string;
/** Redis key for session fingerprint (anchored on Session ID). */
export declare const sessionFingerprintKey: (sessionId: string) => string;
/** Redis key for the absolute session start timestamp (anchored on DB User ID). */
export declare const sessionStartKey: (userId: string) => string;
export interface SessionFingerprint {
    uaHash: string;
    ip: string;
}
/**
 * Normalizes and hashes the incoming User-Agent string.
 */
export declare function hashUserAgent(userAgent: string | undefined): string;
/**
 * Builds a structured session fingerprint containing:
 * 1. uaHash: SHA-256 of User-Agent (detects browser/client changes)
 * 2. ip: Initial login IP (used strictly for informational telemetry / anomaly logging)
 *
 * IMPORTANT: Behind Cloudflare Anycast, mobile networks, and multi-cloud proxies,
 * client IP addresses change frequently during active sessions. IP must NEVER
 * be hard-bound or used to revoke JWT tokens.
 */
export declare function buildSessionFingerprint(ip: string | undefined | null, userAgent: string | undefined): string;
/**
 * Parses a stored session fingerprint string from Redis.
 * Handles both new JSON structure `{ uaHash, ip }` and legacy raw SHA-256 strings gracefully.
 */
export declare function parseSessionFingerprint(rawFp: string | null | undefined): SessionFingerprint | null;
//# sourceMappingURL=session.d.ts.map