/**
 * Contact Service
 *
 * CRUD + CSV bulk import for marketing Contact records.
 *
 * CSV import contract:
 *   - Expected headers (case-insensitive): email, firstName, lastName, role,
 *     phone, primaryRegulator, companyName, tags, notes
 *   - RFC 4180 state-machine parser handles quoted commas, embedded newlines,
 *     escaped double-quotes, empty cells, trailing newlines
 *   - Suppression check fires BEFORE company resolution (import guard)
 *   - Per-row $transaction (interactive): contact upsert + ConsentRecord insert
 *   - Sequential for…of — no Promise.all over rows
 *   - New contacts: consentStatus=PENDING via ConsentRecord(IMPORTED_LEGITIMATE_INTEREST)
 *   - Existing contacts: non-null CSV fields merged, consentStatus preserved
 *   - Tags: lowercase + trim, deduped, capped at 10 per contact
 *   - Single audit log entry after all rows: MARKETING_CONTACT_IMPORTED
 *
 * resolveContacts filters:
 *   - deletedAt: null
 *   - consentStatus: NOT REVOKED
 *   - suppressedAt: null
 *   - Hard cap: 5000 (BadRequestError if exceeded)
 *
 * Audit actions:
 *   MARKETING_CONTACT_CREATED | MARKETING_CONTACT_UPDATED |
 *   MARKETING_CONTACT_DELETED | MARKETING_CONTACT_IMPORTED
 */
export interface CreateContactParams {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    phone?: string;
    primaryRegulator?: string;
    companyId?: string;
    tags?: string[];
    notes?: string;
}
export interface UpdateContactParams {
    firstName?: string;
    lastName?: string;
    role?: string;
    phone?: string;
    primaryRegulator?: string;
    companyId?: string;
    tags?: string[];
    notes?: string;
}
export interface ListContactsParams {
    query?: string;
    companyId?: string;
    take?: number;
    skip?: number;
}
export interface ImportContactsCsvParams {
    csvText: string;
    source?: string;
}
export interface ImportResult {
    created: number;
    updated: number;
    skipped: number;
    errors: Array<{
        row: number;
        email: string;
        reason: string;
    }>;
}
export interface ResolvedContact {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
}
export interface ResolveContactsParams {
    contactIds?: string[];
    listIds?: string[];
}
export declare function createContact(params: CreateContactParams, userId: string): Promise<{
    id: string;
    email: string;
    phone: string | null;
    role: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    tags: string[];
    notes: string | null;
    createdById: string;
    companyId: string | null;
    firstName: string | null;
    lastName: string | null;
    primaryRegulator: string | null;
    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
    consentSource: string | null;
    consentTimestamp: Date | null;
    suppressedAt: Date | null;
    suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
    lastEmailedAt: Date | null;
    lastEmailOpenedAt: Date | null;
}>;
export declare function updateContact(id: string, params: UpdateContactParams, userId: string): Promise<{
    id: string;
    email: string;
    phone: string | null;
    role: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    tags: string[];
    notes: string | null;
    createdById: string;
    companyId: string | null;
    firstName: string | null;
    lastName: string | null;
    primaryRegulator: string | null;
    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
    consentSource: string | null;
    consentTimestamp: Date | null;
    suppressedAt: Date | null;
    suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
    lastEmailedAt: Date | null;
    lastEmailOpenedAt: Date | null;
}>;
export declare function deleteContact(id: string, userId: string): Promise<void>;
export declare function getContact(id: string): Promise<{
    id: string;
    email: string;
    phone: string | null;
    role: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    tags: string[];
    notes: string | null;
    createdById: string;
    companyId: string | null;
    firstName: string | null;
    lastName: string | null;
    primaryRegulator: string | null;
    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
    consentSource: string | null;
    consentTimestamp: Date | null;
    suppressedAt: Date | null;
    suppressedReason: import("@prisma/client").$Enums.SuppressionReason | null;
    lastEmailedAt: Date | null;
    lastEmailOpenedAt: Date | null;
}>;
export declare function listContacts(params?: ListContactsParams): Promise<{
    id: string;
    email: string;
    phone: string | null;
    company: {
        id: string;
        name: string;
    } | null;
    role: string | null;
    createdAt: Date;
    tags: string[];
    companyId: string | null;
    firstName: string | null;
    lastName: string | null;
    consentStatus: import("@prisma/client").$Enums.ContactConsentStatus;
    suppressedAt: Date | null;
}[]>;
/**
 * Import contacts from RFC 4180 CSV text.
 *
 * Required column: email
 * Optional columns: firstName, lastName, role, phone, primaryRegulator,
 *                   companyName, tags (comma-separated within the cell), notes
 *
 * Per-row processing order:
 *   1. Normalize + validate email
 *   2. Suppression check (isSuppressed) — skip if suppressed
 *   3. Company resolution (findOrCreateByEmailDomain)
 *   4. Row-level $transaction:
 *        - New contact: create + ConsentRecord(IMPORTED_LEGITIMATE_INTEREST)
 *        - Existing contact: update non-null fields, merge tags, preserve consentStatus
 *
 * Single MARKETING_CONTACT_IMPORTED audit entry after all rows complete.
 */
export declare function importContactsCsv(params: ImportContactsCsvParams, userId: string): Promise<ImportResult>;
/**
 * Resolve a de-duped list of sendable contacts from contact IDs and/or list IDs.
 *
 * Filters applied:
 *   - deletedAt: null
 *   - consentStatus: NOT REVOKED  (PENDING and GRANTED are eligible)
 *   - suppressedAt: null          (hard-bounce / complaint / manual suppression)
 *
 * Throws BadRequestError if the resolved set would exceed RESOLVE_HARD_CAP (5000).
 *
 * Returns ResolvedContact[] (id, email, firstName, lastName).
 */
export declare function resolveContacts(params: ResolveContactsParams): Promise<ResolvedContact[]>;
//# sourceMappingURL=contact.service.d.ts.map