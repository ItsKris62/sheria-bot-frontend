/**
 * JWT revocation helpers.
 *
 * Two complementary strategies:
 *
 * 1. Per-token JTI blocklist  (`sheriabot:revoked:{jti}`)
 *    Written at logout / password reset for the specific token presented.
 *    TTL = remaining token lifetime so the key self-prunes when the JWT would
 *    have expired anyway.
 *
 * 2. User-level "revoke all"  (`sheriabot:user_tokens_revoked_after:{userId}`)
 *    Written when ALL in-flight tokens for a user must be invalidated (e.g.
 *    after a password change or a forced sign-out).  Any token whose `iat`
 *    (issued-at) is ≤ the stored timestamp is rejected.  TTL = 1 hour (longer
 *    than the Supabase access-token lifetime of 1 hour, so all live tokens
 *    will be caught during at least one validation window).
 */
/** Redis key for a single revoked JWT ID. */
export declare const revokedJtiKey: (jti: string) => string;
/**
 * Redis key marking the epoch-second timestamp after which ALL tokens for
 * this user are considered revoked.
 */
export declare const userRevokedAfterKey: (userId: string) => string;
/**
 * Blocklist a specific JWT by its JTI claim.
 *
 * @param token  Raw Bearer token string (will be decoded to extract JTI + EXP).
 * @param reason Short tag written as the Redis value for audit queries.
 */
export declare function revokeToken(token: string, reason?: 'logout' | 'password_reset' | 'admin_revoke'): Promise<void>;
/**
 * Revoke ALL currently-live tokens for a user by recording the current
 * epoch-second.  Any token with `iat ≤ now` will be rejected.
 *
 * @param userId Prisma User.id (cuid).
 * @param reason Short audit tag.
 */
export declare function revokeAllUserTokens(userId: string, reason?: 'password_change' | 'admin_revoke' | 'security_incident'): Promise<void>;
/**
 * Returns true if the token has been explicitly revoked (either by JTI
 * or because all tokens for this user were revoked after its `iat`).
 *
 * Fails **open** on Redis errors  -  if the blocklist is unreachable we still
 * let the Supabase-verified token through rather than knocking everyone out.
 * The primary revocation path (Supabase `admin.signOut`) is unaffected.
 */
export declare function isTokenRevoked(token: string, userId: string): Promise<boolean>;
//# sourceMappingURL=token-revocation.d.ts.map