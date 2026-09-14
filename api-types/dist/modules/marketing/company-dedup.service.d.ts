/**
 * Company Deduplication & Entity Resolution Service (P0)
 *
 * Implements multi-signal entity resolution across domain, legal name,
 * and regulatory licence number, with safe admin merge capability.
 */
/**
 * Normalizes a URL or domain string into a clean canonical hostname.
 * Strips protocol, www., paths, query parameters, ports, and trailing slashes.
 */
export declare function normalizeDomain(input?: string | null): string | null;
/**
 * Normalizes a company legal name for exact matching:
 * Lowercases, strips punctuation, strips common corporate legal suffixes.
 */
export declare function normalizeCompanyName(name?: string | null): string;
/**
 * Normalizes a regulatory licence number (strips hyphens, spaces, slashes, uppercase).
 */
export declare function normalizeLicenceNumber(licence?: string | null): string;
export interface MatchCompanyResult {
    matchedCompany: any | null;
    matchType: 'DOMAIN' | 'LICENCE' | 'EXACT_NAME' | null;
    confidence: number;
}
/**
 * Finds an existing non-deleted Company record matching a candidate lead.
 * Resolution Priority:
 *   1. Canonical Domain (Highest confidence: 1.0)
 *   2. Regulatory Licence Number (High confidence: 0.95)
 *   3. Normalized Legal Name within same Country (Confidence: 0.85)
 */
export declare function findMatchingCompany(params: {
    name: string;
    domain?: string | null;
    licenceNumber?: string | null;
    country?: string | null;
}): Promise<MatchCompanyResult>;
/**
 * Checks whether a candidate domain or name belongs to an existing paying Organization.
 */
export declare function isExistingPayingCustomer(params: {
    domain?: string | null;
    name?: string;
}): Promise<boolean>;
export interface MergeCompaniesParams {
    primaryCompanyId: string;
    secondaryCompanyId: string;
    userId: string;
}
export declare function mergeCompanies(params: MergeCompaniesParams): Promise<{
    origin: import(".prisma/client").$Enums.CompanyOrigin;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    industry: string | null;
    confidence: number | null;
    regulatoryBody: string | null;
    notes: string | null;
    domain: string | null;
    reviewedAt: Date | null;
    createdById: string;
    regulatorMix: string[];
    leadStatus: import(".prisma/client").$Enums.LeadStatus;
    salesStage: import(".prisma/client").$Enums.SalesStage;
    icpTier: import(".prisma/client").$Enums.IcpTier;
    leadScore: number | null;
    sizeClass: import(".prisma/client").$Enums.CompanySizeClass;
    country: string;
    licenceType: string | null;
    licenceNumber: string | null;
    licenceStatus: string | null;
    primarySourceUrl: string | null;
    primarySourceAuthority: string | null;
    discoveredAt: Date | null;
    lastVerifiedAt: Date | null;
    reviewReason: string | null;
    rejectionReason: string | null;
    ownerId: string | null;
    reviewedById: string | null;
}>;
//# sourceMappingURL=company-dedup.service.d.ts.map