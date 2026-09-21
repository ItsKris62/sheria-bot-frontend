export type MfaDecryptFailureReason = 'format_invalid' | 'auth_tag_mismatch' | 'key_rotated' | 'unknown';
export declare class MfaChallengeDecryptError extends Error {
    readonly reason: MfaDecryptFailureReason;
    constructor(reason: MfaDecryptFailureReason, message?: string);
}
export interface MfaChallengePayload {
    userId: string;
    accessToken: string;
    refreshToken: string;
}
/**
 * Encrypts an MFA session challenge payload into a four-segment format:
 * `<userId>.<iv_b64url>.<authTag_b64url>.<ciphertext_b64url>`
 */
export declare function encryptMfaChallenge(payload: {
    userId: string;
    accessToken: string;
    refreshToken: string;
}): string;
/**
 * Decrypts an MFA session challenge string.
 * Expects `<userId>.<iv_b64url>.<authTag_b64url>.<ciphertext_b64url>`
 */
export declare function decryptMfaChallenge(blob: string): MfaChallengePayload;
//# sourceMappingURL=mfa-challenge-crypto.d.ts.map