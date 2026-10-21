import { type JurisdictionCode } from '@/types/jurisdiction';
export type FrameworkScope = 'DOMESTIC' | 'INTERNATIONAL' | 'CROSS_BORDER';
export interface RegulatoryFrameworkMetadata {
    slug: string;
    name: string;
    category: string;
    tier: 'STARTUP' | 'BUSINESS' | 'ENTERPRISE';
    scope: FrameworkScope;
    jurisdictions: JurisdictionCode[];
    regulator?: string;
    description?: string;
}
/**
 * Authoritative metadata registry for regulatory frameworks supported by SheriaBot.
 *
 * Rules:
 * - DOMESTIC frameworks apply only to explicit jurisdictions (e.g. Kenya domestic laws apply to KE).
 * - INTERNATIONAL frameworks (e.g. ISO 27001, PCI-DSS, FATF, SOC 2, SWIFT CSP, Basel III, GDPR)
 *   are applicable across all jurisdictions and retrieve international standards corpus.
 * - CROSS_BORDER frameworks apply to designated multi-jurisdiction regions.
 */
export declare const FRAMEWORK_METADATA_REGISTRY: Record<string, RegulatoryFrameworkMetadata>;
/**
 * Returns framework metadata for a given slug, or a synthetic default if unlisted.
 */
export declare function getFrameworkMetadata(slug: string): RegulatoryFrameworkMetadata | null;
/**
 * Determines whether a given regulatory framework is applicable to a specific jurisdiction.
 *
 * - INTERNATIONAL frameworks: universally applicable across all supported jurisdictions.
 * - DOMESTIC frameworks: applicable ONLY if the jurisdiction is in the framework's explicit list.
 * - CROSS_BORDER frameworks: applicable if the jurisdiction is in the cross-border jurisdiction set.
 */
export declare function isFrameworkApplicableToJurisdiction(slugOrMeta: string | RegulatoryFrameworkMetadata, jurisdiction: JurisdictionCode): boolean;
/**
 * Validates a list of framework slugs against a requested analysis jurisdiction.
 */
export declare function validateFrameworkApplicability(frameworkSlugs: string[], jurisdiction: JurisdictionCode): {
    valid: boolean;
    incompatibleSlugs: string[];
};
//# sourceMappingURL=framework-metadata.config.d.ts.map