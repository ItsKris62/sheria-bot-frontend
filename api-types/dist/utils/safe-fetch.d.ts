export declare class SSRFValidationError extends Error {
    constructor(message: string);
}
/**
 * Checks if an IPv4 address is in a private, loopback, link-local,
 * multicast, reserved, or special-purpose IP range.
 */
export declare function isPrivateIPv4(ip: string): boolean;
/**
 * Checks if an IPv6 address is in a private, loopback, link-local,
 * unique local, multicast, or special-purpose IP range.
 */
export declare function isPrivateIPv6(ip: string): boolean;
export declare function isPrivateIP(ip: string): boolean;
/**
 * Validates a URL and resolves its hostname to guarantee it does not
 * point to private, loopback, or cloud-metadata IPs.
 */
export declare function validateSafeUrl(rawUrl: string): Promise<URL>;
export interface SafeFetchOptions extends RequestInit {
    timeoutMs?: number;
    maxRedirects?: number;
    maxResponseBytes?: number;
}
export interface SafeFetchResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;
    url: string;
    text: () => Promise<string>;
    json: <T = unknown>() => Promise<T>;
}
/**
 * Fetches an external URL safely with:
 * 1. Protocol checking (HTTP/HTTPS only)
 * 2. DNS resolution check against private/RFC1918/link-local/cloud-metadata subnets
 * 3. Manual redirect following with re-validation on every redirect hop
 * 4. Connect/request timeout
 * 5. Maximum response size enforcement
 */
export declare function safeFetch(rawUrl: string, options?: SafeFetchOptions): Promise<SafeFetchResponse>;
//# sourceMappingURL=safe-fetch.d.ts.map