/**
 * Candidate Loader
 *
 * Loads, validates, and writes candidate manifest files under
 * `documents/_incoming/<country>/candidate-manifest.json`.
 */
import { type CandidateManifest, type CandidateEntry, type CandidateCountry } from './candidate.schema';
export interface CandidateLoadResult {
    country: CandidateCountry;
    manifest: CandidateManifest | null;
    entries: CandidateEntry[];
    errors: string[];
}
export declare function getIncomingDir(country: CandidateCountry): string;
export declare function getCandidateManifestPath(country: CandidateCountry): string;
export declare function getDiscoveryReportPath(country: CandidateCountry): string;
export declare function getDownloadReportPath(country: CandidateCountry): string;
/**
 * Load and validate an existing candidate manifest.
 */
export declare function loadCandidateManifest(country: CandidateCountry): CandidateLoadResult;
/**
 * Write a candidate manifest to disk. Creates directories if needed.
 */
export declare function writeCandidateManifest(country: CandidateCountry, manifest: CandidateManifest): void;
/**
 * Write a markdown report to disk.
 */
export declare function writeReport(filePath: string, content: string): void;
//# sourceMappingURL=candidate-loader.d.ts.map