/**
 * SHA-256 Checksum Utility
 *
 * Provides functions to compute and verify SHA-256 checksums for corpus
 * document files.
 */
/**
 * Compute the SHA-256 hex digest for a file at the given absolute path.
 */
export declare function computeFileSha256(absolutePath: string): Promise<string>;
/**
 * Verify that a file's SHA-256 matches the expected checksum.
 * Returns `{ match: true }` or `{ match: false, actual: string }`.
 */
export declare function verifyChecksum(absolutePath: string, expectedSha256: string): Promise<{
    match: boolean;
    actual: string;
}>;
//# sourceMappingURL=checksum.d.ts.map