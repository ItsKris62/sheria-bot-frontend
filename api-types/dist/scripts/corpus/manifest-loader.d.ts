/**
 * Corpus Manifest Loader
 *
 * Loads, validates, and normalizes corpus manifest files. Provides safe path
 * resolution rooted under the project `documents/` directory.
 *
 * This loader is read-only and does NOT drive ingestion. It is used by
 * validation and inventory utilities.
 */
import { type CorpusManifest, type CorpusManifestEntry, type Country } from './manifest.schema';
export interface ManifestLoadResult {
    /** The country this manifest belongs to. */
    country: Country;
    /** Parsed and validated manifest. Null if load failed. */
    manifest: CorpusManifest | null;
    /** Validated entries (only those that passed individual validation). */
    validEntries: CorpusManifestEntry[];
    /** Errors encountered during load and validation. */
    errors: ManifestError[];
    /** Warnings (non-fatal issues). */
    warnings: string[];
}
export interface ManifestError {
    entryId?: string;
    field?: string;
    message: string;
}
/**
 * Resolve the documents root.
 */
export declare function getDocumentsRoot(): string;
/**
 * Get the manifest.json path for a given country.
 */
export declare function getManifestPath(country: Country): string;
/**
 * Safely resolve a `localPath` from a manifest entry to an absolute path.
 * Validates that the resolved path is within `documents/`.
 *
 * @returns absolute path or null if unsafe
 */
export declare function resolveLocalPath(localPath: string): string | null;
/**
 * Load and validate a single country's manifest.
 */
export declare function loadManifest(country: Country): ManifestLoadResult;
/**
 * Load manifests for all known countries.
 */
export declare function loadAllManifests(): ManifestLoadResult[];
/**
 * Get the list of known countries.
 */
export declare function getKnownCountries(): Country[];
//# sourceMappingURL=manifest-loader.d.ts.map