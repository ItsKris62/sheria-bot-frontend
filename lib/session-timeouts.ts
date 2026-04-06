export const SESSION_TIMEOUTS = {
  /** Global idle timeout in milliseconds */
  GLOBAL_IDLE_MS: 30 * 60 * 1000, // 30 minutes

  /** Sensitive page idle timeout in milliseconds */
  SENSITIVE_IDLE_MS: 5 * 60 * 1000, // 5 minutes

  /** Warning modal countdown in seconds (shown before logout) */
  WARNING_COUNTDOWN_SECONDS: 60, // 1-minute countdown

  /** Events that count as "user activity" */
  ACTIVITY_EVENTS: ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'] as const,

  /** Throttle interval for activity tracking (avoid excessive lastActivity writes) */
  ACTIVITY_THROTTLE_MS: 30 * 1000, // update "last active" at most every 30 seconds

  /**
   * Sensitive route prefixes — any route starting with one of these gets the
   * shorter SENSITIVE_IDLE_MS timeout.
   * Note: billing lives under /settings/billing in this app (no top-level /billing).
   */
  SENSITIVE_ROUTES: [
    '/settings/billing',
    '/settings/security',
    '/settings/api-keys',
    '/admin',
  ] as const,
} as const;

/** localStorage key written on logout to signal other open tabs */
export const LOGOUT_SIGNAL_KEY = 'sheriabot:logout_signal';

/** sessionStorage key set when a session expires so the login page can show a banner */
export const SESSION_EXPIRED_FLAG = 'sheriabot:session_expired';
