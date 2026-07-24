/**
 * Contact List Service
 *
 * CRUD operations for ContactList records plus membership management.
 *
 * Soft-delete: lists are never hard-deleted; deletedAt is set instead.
 * All read operations filter deletedAt: null unless explicitly fetching deleted.
 *
 * Membership:
 *   addContacts    — createMany with skipDuplicates (idempotent)
 *   removeContacts — deleteMany (idempotent, no-op if membership missing)
 *   Both operations log the count of affected memberships, not individual IDs.
 *
 * Audit actions:
 *   MARKETING_LIST_CREATED | MARKETING_LIST_UPDATED | MARKETING_LIST_DELETED |
 *   MARKETING_LIST_CONTACTS_ADDED | MARKETING_LIST_CONTACTS_REMOVED
 */
import { Prisma } from '@prisma/client';
/**
 * Contact with company included — used by the send pipeline for personalization.
 */
export type ContactWithCompany = Prisma.ContactGetPayload<{
    include: {
        company: true;
    };
}>;
/**
 * Combine the base eligibility filter with a dynamic list's filterCriteria
 * (stored, for resolveContacts, or ad-hoc, for previewDynamic).
 */
export declare function buildDynamicContactWhere(filterCriteria: Prisma.ContactWhereInput): Prisma.ContactWhereInput;
export interface CreateListParams {
    name: string;
    description?: string;
}
export interface UpdateListParams {
    name?: string;
    description?: string;
}
export interface ListListsParams {
    query?: string;
    take?: number;
    skip?: number;
}
export interface GetListMembersParams {
    listId: string;
    take?: number;
    skip?: number;
}
export declare function createList(params: CreateListParams, userId: string): Promise<{
    id: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    createdById: string;
    isDynamic: boolean;
    filterCriteria: Prisma.JsonValue | null;
}>;
export declare function updateList(id: string, params: UpdateListParams, userId: string): Promise<{
    id: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    createdById: string;
    isDynamic: boolean;
    filterCriteria: Prisma.JsonValue | null;
}>;
export declare function deleteList(id: string, userId: string): Promise<void>;
export declare function getList(id: string): Promise<{
    _count: {
        memberships: number;
    };
} & {
    id: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;
    createdById: string;
    isDynamic: boolean;
    filterCriteria: Prisma.JsonValue | null;
}>;
export declare function listLists(params?: ListListsParams): Promise<{
    id: string;
    description: string | null;
    createdAt: Date;
    _count: {
        memberships: number;
    };
    name: string;
    isDynamic: boolean;
}[]>;
/**
 * Add contacts to a list. Idempotent — existing memberships are silently skipped
 * (createMany with skipDuplicates). Returns the count of net-new memberships added.
 */
export declare function addContacts(listId: string, contactIds: string[], userId: string): Promise<number>;
/**
 * Remove contacts from a list. Idempotent — missing memberships are a no-op.
 * Returns the count of memberships deleted.
 */
export declare function removeContacts(listId: string, contactIds: string[], userId: string): Promise<number>;
/**
 * Resolve all sendable contacts for a list.
 *
 * B1 spec gap retrofit (Phase B2 TG1):
 *   - Filters: consentStatus !== REVOKED, suppressedAt: null, deletedAt: null
 *   - Includes company for downstream template personalization
 *   - Hard cap: 5000 contacts. Throws BadRequestError if exceeded.
 *   - Static lists: resolved via ContactListMembership
 *   - Dynamic lists: resolved via stored filterCriteria JSONB
 *
 * Does NOT modify getListMembers — that remains for paginated UI use.
 */
export declare function resolveContacts(listId: string): Promise<ContactWithCompany[]>;
/**
 * Paginated member listing for a list.
 * Filters out soft-deleted contacts so removed contacts don't appear in the result.
 */
export declare function getListMembers(params: GetListMembersParams): Promise<{
    contact: {
        id: string;
        email: string;
        company: {
            id: string;
            name: string;
        } | null;
        role: string | null;
        firstName: string | null;
        lastName: string | null;
        consentStatus: import(".prisma/client").$Enums.ContactConsentStatus;
        suppressedAt: Date | null;
    };
    addedAt: Date;
}[]>;
//# sourceMappingURL=list.service.d.ts.map