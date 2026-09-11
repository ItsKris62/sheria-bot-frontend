/**
 * Canonical URL Normalization Utility
 *
 * Implements a conservative URL normalization strategy for regulatory sources.
 * Strips ONLY known tracking parameters without collapsing distinct document endpoints.
 */
/**
 * Normalizes a URL for regulatory evidence deduplication.
 * Throws if the URL is invalid.
 */
export declare function canonicalizeUrl(rawUrl: string): string;
//# sourceMappingURL=canonical-url.d.ts.map