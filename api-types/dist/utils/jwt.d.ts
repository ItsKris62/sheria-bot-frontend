/**
 * Lightweight JWT claim extractors.
 *
 * We deliberately use `jsonwebtoken.decode` (no verification) here because:
 *  - Supabase has already cryptographically verified the token in context.ts
 *    via `supabaseAdmin.auth.getUser(token)` before these helpers are called.
 *  - We only need to read the JTI / IAT / EXP claims for revocation bookkeeping,
 *    not re-validate the signature.
 *
 * `jsonwebtoken` is already in package.json (^9.0.3 / @types/jsonwebtoken ^9.0.10).
 */
/** Extract the JWT ID (jti) claim. Returns null if absent or malformed. */
export declare function extractJti(token: string): string | null;
/** Extract the issued-at (iat) claim as a Unix second timestamp. */
export declare function extractIat(token: string): number | null;
/** Extract the expiry (exp) claim as a Unix second timestamp. */
export declare function extractExp(token: string): number | null;
//# sourceMappingURL=jwt.d.ts.map