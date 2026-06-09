export interface SignedToken {
    /** Send this in the URL */
    publicToken: string;
    /** Store this in the DB */
    tokenHash: string;
}
/**
 * Generate a tamper-evident signed token for pilot invitation and unsubscribe URLs.
 *
 * Format: `<random32hex>.<hmac32hex>` (65 chars total)
 * - `publicToken` — embed in the URL: `https://app.sheriabot.com/pilot/apply/<publicToken>`
 * - `tokenHash`   — store in `PilotInvitation.tokenHash`; never send to the client
 *
 * @example
 * const { publicToken, tokenHash } = generateSignedToken();
 * await prisma.pilotInvitation.create({ data: { tokenHash, ... } });
 * // Send email with: `${appConfig.marketing.appPublicUrl}/pilot/apply/${publicToken}`
 */
export declare function generateSignedToken(): SignedToken;
export interface VerifyResult {
    valid: boolean;
    /** Present only when valid; use this to look up the DB row */
    tokenHash?: string;
    reason?: 'malformed' | 'invalid_signature';
}
/**
 * Verify a signed token received from a URL parameter.
 *
 * Verification flow:
 * 1. Receive `publicToken` from request URL
 * 2. Call `verifySignedToken(publicToken)`
 * 3. If `result.valid`, look up `PilotInvitation` by `result.tokenHash`
 * 4. Check expiry and status on the DB row
 *
 * @example
 * const result = verifySignedToken(ctx.params.token);
 * if (!result.valid) throw new BadRequestError(`Invalid token: ${result.reason}`);
 * const invite = await prisma.pilotInvitation.findUnique({ where: { tokenHash: result.tokenHash } });
 *
 * Uses constant-time comparison to prevent timing attacks.
 * Never throws for invalid tokens — always returns a `VerifyResult`.
 */
export declare function verifySignedToken(publicToken: string): VerifyResult;
//# sourceMappingURL=signed-token.util.d.ts.map