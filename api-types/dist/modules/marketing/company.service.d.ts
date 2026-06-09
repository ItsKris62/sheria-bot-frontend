/**
 * Company Service
 *
 * CRUD operations for marketing Company records plus the import helper
 * `findOrCreateByEmailDomain` used by the CSV contact importer.
 *
 * Soft-delete: companies are never hard-deleted; deletedAt is set instead.
 * All read operations filter deletedAt: null unless explicitly fetching deleted.
 *
 * Audit actions written to AuditLog:
 *   MARKETING_COMPANY_CREATED | MARKETING_COMPANY_UPDATED | MARKETING_COMPANY_DELETED
 */
export interface CreateCompanyParams {
    name: string;
    domain?: string;
    industry?: string;
    regulatorMix?: string[];
    notes?: string;
}
export interface UpdateCompanyParams {
    name?: string;
    domain?: string;
    industry?: string;
    regulatorMix?: string[];
    notes?: string;
}
export interface ListCompaniesParams {
    query?: string;
    take?: number;
    skip?: number;
}
export declare function createCompany(params: CreateCompanyParams, userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    industry: string | null;
    notes: string | null;
    domain: string | null;
    createdById: string;
    regulatorMix: string[];
}>;
export declare function updateCompany(id: string, params: UpdateCompanyParams, userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    industry: string | null;
    notes: string | null;
    domain: string | null;
    createdById: string;
    regulatorMix: string[];
}>;
export declare function deleteCompany(id: string, userId: string): Promise<void>;
export declare function getCompany(id: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    industry: string | null;
    notes: string | null;
    domain: string | null;
    createdById: string;
    regulatorMix: string[];
}>;
export declare function listCompanies(params?: ListCompaniesParams): Promise<{
    id: string;
    createdAt: Date;
    _count: {
        contacts: number;
    };
    name: string;
    industry: string | null;
    domain: string | null;
    regulatorMix: string[];
}[]>;
/**
 * For CSV import: resolve or create a Company record using the contact's email
 * domain and optional company name.
 *
 * Returns null if:
 *   - The email domain is a public provider (gmail.com, outlook.com, etc.)
 *   - No companyName is provided (can't name an auto-created record)
 *
 * Lookup order: name (case-insensitive) → domain → create.
 */
export declare function findOrCreateByEmailDomain(email: string, companyName: string, userId: string): Promise<string | null>;
//# sourceMappingURL=company.service.d.ts.map