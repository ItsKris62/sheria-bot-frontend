/**
 * Hash an IP address before using it in logs or Redis keys.
 */
export declare function hashIp(ip: string | undefined): string;
export declare function hashToken(token: string): string;
export declare function revokedBearerTokenKey(token: string): string;
//# sourceMappingURL=request-identifiers.d.ts.map