/**
 * Source Registry Loader
 *
 * Loads and validates per-country source registry JSON files from
 * `scripts/corpus/sources/<country>.sources.json`.
 */
import { type SourceRegistry, type SourceRegistryEntry, type SourceCountry } from './source-registry.schema';
export interface SourceRegistryLoadResult {
    country: SourceCountry;
    registry: SourceRegistry | null;
    sources: SourceRegistryEntry[];
    enabledSources: SourceRegistryEntry[];
    errors: string[];
}
export declare function loadSourceRegistry(country: SourceCountry): SourceRegistryLoadResult;
export declare function loadAllSourceRegistries(): SourceRegistryLoadResult[];
export declare function getKnownSourceCountries(): SourceCountry[];
//# sourceMappingURL=source-registry-loader.d.ts.map