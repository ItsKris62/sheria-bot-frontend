/**
 * Organization Module - Public API
 * Export all organization-related functionality
 */
export { organizationModule, OrganizationModule } from './organization.module';
export type { Organization, OrganizationWithMembers, OrganizationMember, OrganizationSettings, OrganizationType, OrganizationStatus, MemberRole, CreateOrganizationInput, UpdateOrganizationInput, UpdateSettingsInput, AddMemberInput, AddMemberResult, RemoveMemberResult, TransferOwnershipResult, DeleteOrganizationResult, OrganizationStats, MemberActivityStats, OrganizationFilters, MemberFilters, PaginatedMembers, Invitation, } from './organization.types';
export { ORGANIZATION_CONSTANTS, DEFAULT_ORGANIZATION_SETTINGS, OrganizationError, hasPermission, } from './organization.types';
export type { OrganizationErrorCode } from './organization.types';
export { toOrganization, toOrganizationWithMembers, toOrganizationMember, parseSettings, mergeSettings, defaultSettings, hasPermission as checkPermission, canModifyRole, getRoleDisplayName, getRoleDescription, createOrganizationSchema, updateOrganizationSchema, updateSettingsSchema, addMemberSchema, memberFiltersSchema, } from './organization.utils';
//# sourceMappingURL=index.d.ts.map