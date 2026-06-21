/**
 * URL Utilities
 *
 * Safe URL resolution, domain allowlist enforcement, and document link
 * extraction from HTML content.
 */
export declare const DOCUMENT_EXTENSIONS: readonly [".pdf", ".doc", ".docx", ".txt"];
export type DocumentExtension = (typeof DOCUMENT_EXTENSIONS)[number];
/**
 * Resolve a potentially relative URL against a base URL.
 * Returns null if the result is not a valid HTTP(S) URL.
 */
export declare function resolveUrl(href: string, baseUrl: string): string | null;
/**
 * Check whether a URL's hostname matches any of the allowed domains.
 * Supports exact match and subdomain matching (e.g. "example.com" allows
 * "www.example.com" and "docs.example.com").
 */
export declare function isAllowedDomain(url: string, allowedDomains: string[]): boolean;
/**
 * Simple regex-based extraction of document links from HTML content.
 * Extracts <a href="..."> links whose href ends with a known document extension.
 *
 * Returns an array of { href, text } objects with raw (unresolved) hrefs.
 */
export declare function extractDocumentLinks(html: string): Array<{
    href: string;
    text: string;
}>;
/**
 * Check if a URL or path ends with a known document extension.
 */
export declare function isDocumentUrl(urlOrPath: string): boolean;
/**
 * Extract the file extension from a URL or path (without the dot).
 * Returns null if no recognised extension found.
 */
export declare function extractFileExtension(urlOrPath: string): string | null;
/**
 * Extract the filename portion from a URL path.
 */
export declare function extractFilenameFromUrl(url: string): string | null;
//# sourceMappingURL=url-utils.d.ts.map