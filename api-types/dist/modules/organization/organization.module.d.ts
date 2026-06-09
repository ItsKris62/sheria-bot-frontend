/**
 * Organization Module
 * Handles all organization management business logic
 *
 * Operations:
 * - Organization CRUD
 * - Member management (add, remove, update roles)
 * - Settings management
 * - Statistics and analytics
 * - Ownership transfer
 * - Invitations
 */
import { type Organization, type OrganizationWithMembers, type OrganizationMember, type OrganizationSettings, type OrganizationStats, type MemberRole, type CreateOrganizationInput, type UpdateOrganizationInput, type UpdateSettingsInput, type AddMemberInput, type AddMemberResult, type RemoveMemberResult, type TransferOwnershipResult, type DeleteOrganizationResult, type MemberFilters, type PaginatedMembers } from './organization.types';
/**
 * Organization Module Class
 * Encapsulates all organization-related business logic
 */
declare class OrganizationModule {
    private readonly appUrl;
    constructor();
    /**
     * Create a new organization
     */
    createOrganization(userId: string, input: CreateOrganizationInput): Promise<Organization>;
    /**
     * Get organization by ID
     */
    getOrganization(orgId: string): Promise<Organization>;
    /**
     * Get organization with members
     */
    getOrganizationWithMembers(orgId: string): Promise<OrganizationWithMembers>;
    /**
     * Update organization
     */
    updateOrganization(userId: string, orgId: string, updates: UpdateOrganizationInput): Promise<Organization>;
    /**
     * Update organization settings
     */
    updateSettings(userId: string, orgId: string, updates: UpdateSettingsInput): Promise<OrganizationSettings>;
    /**
     * Delete organization (soft delete)
     */
    deleteOrganization(userId: string, orgId: string): Promise<DeleteOrganizationResult>;
    /**
     * Get organization members
     */
    getMembers(orgId: string, filters?: MemberFilters): Promise<PaginatedMembers>;
    /**
     * Add member to organization
     */
    addMember(requesterId: string, orgId: string, input: AddMemberInput): Promise<AddMemberResult>;
    /**
     * Accept invitation
     */
    acceptInvitation(userId: string, token: string): Promise<OrganizationMember>;
    /**
     * Remove member from organization
     */
    removeMember(requesterId: string, orgId: string, memberUserId: string): Promise<RemoveMemberResult>;
    /**
     * Update a member's org-level role (MemberRole: OWNER/ADMIN/MEMBER/VIEWER).
     *
     * Operates on OrganizationMember.role, NOT User.role. These are independent
     * role dimensions. Cache invalidation targets the orgmem cache used by
     * requireOrgMembership middleware, not the session cache.
     * See docs/architecture/data-model-invariants.md for the full distinction.
     */
    updateMemberRole(requesterId: string, orgId: string, memberUserId: string, newRole: MemberRole): Promise<OrganizationMember>;
    /**
     * Transfer ownership of the organization to another member.
     *
     * Operates on OrganizationMember.role for TWO users (new owner -> OWNER,
     * previous owner -> ADMIN). Both users' orgmem cache entries are invalidated
     * independently so requireOrgMembership middleware sees the new roles immediately.
     * See docs/architecture/data-model-invariants.md for the MemberRole vs UserRole distinction.
     */
    transferOwnership(currentOwnerId: string, orgId: string, newOwnerId: string): Promise<TransferOwnershipResult>;
    /**
     * Get organization statistics
     */
    getStats(orgId: string): Promise<OrganizationStats>;
    /**
     * Check if user has required permission in organization
     */
    checkPermission(userId: string, orgId: string, requiredRole: MemberRole): Promise<void>;
    /**
     * Get user's role in organization
     */
    getMemberRole(userId: string, orgId: string): Promise<MemberRole | null>;
    /**
     * Invalidate organization cache
     */
    private invalidateOrgCache;
    /**
     * Invalidate members cache
     */
    private invalidateMembersCache;
}
export declare const organizationModule: OrganizationModule;
export { OrganizationModule };
//# sourceMappingURL=organization.module.d.ts.map