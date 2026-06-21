/**
 * Discovery Report Generator
 *
 * Produces human-readable markdown reports from discovery and download results.
 */
import type { CandidateEntry } from './candidate.schema';
import type { SourceRegistryEntry } from './source-registry.schema';
export declare function generateDiscoveryReport(country: string, sourcesScanned: SourceRegistryEntry[], candidates: CandidateEntry[], errors: string[], dryRun: boolean): string;
export declare function generateDownloadReport(country: string, downloaded: CandidateEntry[], skipped: CandidateEntry[], failed: Array<{
    entry: CandidateEntry;
    error: string;
}>, dryRun: boolean): string;
//# sourceMappingURL=discovery-report.d.ts.map