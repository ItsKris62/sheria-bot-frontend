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
/** Redis key for the last-activity timestamp of an authenticated user. */
export declare const lastSeenKey: (userId: string) => string;
/** Redis key for the absolute session start timestamp. */
export declare const sessionStartKey: (userId: string) => string;
//# sourceMappingURL=session.d.ts.map