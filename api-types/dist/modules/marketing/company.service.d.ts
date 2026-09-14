/**
 * Company Service (P0 Enhanced)
 *
 * CRUD operations for marketing Company records, lead qualification state
 * transitions, soft-delete, and audit logging.
 */
import { CompanyOrigin, LeadStatus, SalesStage, IcpTier, CompanySizeClass, EvidenceVerificationState } from '@prisma/client';
export interface CreateCompanyParams {
    name: string;
    domain?: string | null;
    industry?: string | null;
    regulatorMix?: string[];
    notes?: string | null;
    origin?: CompanyOrigin;
    leadStatus?: LeadStatus;
    salesStage?: SalesStage;
    icpTier?: IcpTier;
    leadScore?: number | null;
    sizeClass?: CompanySizeClass;
    country?: string;
    regulatoryBody?: string | null;
    licenceType?: string | null;
    licenceNumber?: string | null;
    licenceStatus?: string | null;
    primarySourceUrl?: string | null;
    primarySourceAuthority?: string | null;
    discoveredAt?: Date | null;
    lastVerifiedAt?: Date | null;
    confidence?: number | null;
    ownerId?: string | null;
}
export interface UpdateCompanyParams {
    name?: string;
    domain?: string | null;
    industry?: string | null;
    regulatorMix?: string[];
    notes?: string | null;
    leadStatus?: LeadStatus;
    salesStage?: SalesStage;
    icpTier?: IcpTier;
    leadScore?: number | null;
    sizeClass?: CompanySizeClass;
    country?: string;
    regulatoryBody?: string | null;
    licenceType?: string | null;
    licenceNumber?: string | null;
    licenceStatus?: string | null;
    primarySourceUrl?: string | null;
    primarySourceAuthority?: string | null;
    lastVerifiedAt?: Date | null;
    confidence?: number | null;
    ownerId?: string | null;
    reviewedById?: string | null;
    reviewedAt?: Date | null;
    reviewReason?: string | null;
    rejectionReason?: string | null;
}
export interface ListCompaniesParams {
    query?: string;
    leadStatus?: LeadStatus;
    icpTier?: IcpTier;
    salesStage?: SalesStage;
    origin?: CompanyOrigin;
    country?: string;
    minScore?: number;
    maxScore?: number;
    take?: number;
    skip?: number;
    orderBy?: 'name' | 'leadScore' | 'createdAt' | 'updatedAt';
    orderDir?: 'asc' | 'desc';
}
export interface IngestEvidenceParams {
    companyId: string;
    discoveryRunId?: string | null;
    field: string;
    extractedValue: string;
    normalizedValue?: string | null;
    confidence?: number;
    sourceUrl: string;
    sourceAuthority?: string | null;
    sourceRecordId?: string | null;
    evidenceSnippet?: string | null;
    verificationState?: EvidenceVerificationState;
    extractionMethod?: string | null;
    modelProvider?: string | null;
    modelName?: string | null;
    extractorVersion?: string | null;
}
export declare function createCompany(params: CreateCompanyParams, userId: string): Promise<{
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
export declare function updateCompany(id: string, params: UpdateCompanyParams, userId: string): Promise<{
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
export declare function deleteCompany(id: string, userId: string): Promise<void>;
export declare function getCompany(id: string): Promise<{
    _count: {
        evidence: number;
        contacts: number;
    };
    reviewedBy: {
        id: string;
        email: string;
        fullName: string;
    } | null;
    owner: {
        id: string;
        email: string;
        fullName: string;
    } | null;
    evidence: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        confidence: number;
        retrievedAt: Date;
        sourceUrl: string;
        verificationState: import(".prisma/client").$Enums.EvidenceVerificationState;
        companyId: string;
        discoveryRunId: string | null;
        field: string;
        extractedValue: string;
        normalizedValue: string | null;
        sourceAuthority: string | null;
        sourceRecordId: string | null;
        evidenceSnippet: string | null;
        evidenceHash: string;
        extractionMethod: string | null;
        modelProvider: string | null;
        modelName: string | null;
        extractorVersion: string | null;
    }[];
    contacts: {
        id: string;
        email: string;
        phone: string | null;
        role: string | null;
        createdAt: Date;
        salesStage: import(".prisma/client").$Enums.SalesStage;
        firstName: string | null;
        lastName: string | null;
        linkedinUrl: string | null;
        consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
    }[];
    discoveryRuns: ({
        discoveryRun: {
            id: string;
            startedAt: Date;
            sourceAuthority: string;
            workflowName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        action: string;
        reason: string | null;
        companyId: string;
        discoveryRunId: string;
        scoreAtRun: number | null;
        icpTierAtRun: import(".prisma/client").$Enums.IcpTier | null;
        leadStatusAtRun: import(".prisma/client").$Enums.LeadStatus | null;
    })[];
} & {
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
export declare function listCompanies(params?: ListCompaniesParams): Promise<{
    items: ({
        _count: {
            evidence: number;
            contacts: number;
        };
        reviewedBy: {
            id: string;
            email: string;
            fullName: string;
        } | null;
        owner: {
            id: string;
            email: string;
            fullName: string;
        } | null;
    } & {
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
    })[];
    total: number;
}>;
/**
 * Persists an evidence record idempotently with SHA-256 hash duplicate protection.
 */
export declare function ingestDiscoveryEvidence(params: IngestEvidenceParams): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    confidence: number;
    retrievedAt: Date;
    sourceUrl: string;
    verificationState: import(".prisma/client").$Enums.EvidenceVerificationState;
    companyId: string;
    discoveryRunId: string | null;
    field: string;
    extractedValue: string;
    normalizedValue: string | null;
    sourceAuthority: string | null;
    sourceRecordId: string | null;
    evidenceSnippet: string | null;
    evidenceHash: string;
    extractionMethod: string | null;
    modelProvider: string | null;
    modelName: string | null;
    extractorVersion: string | null;
}>;
/**
 * For CSV import: resolve or create a Company record using the contact's email
 * domain and optional company name.
 */
export declare function findOrCreateByEmailDomain(email: string, companyName: string, userId: string): Promise<string | null>;
//# sourceMappingURL=company.service.d.ts.map