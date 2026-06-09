/**
 * Organization Module Types
 * Type definitions for organization management operations
 */
/**
 * Organization type/category
 */
export type OrganizationType = 'FINTECH' | 'BANK' | 'INSURANCE' | 'SACCO' | 'MFI' | 'PAYMENT_PROVIDER' | 'LENDING' | 'INVESTMENT' | 'REGULATOR' | 'OTHER';
/**
 * Organization status
 */
export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DELETED';
/**
 * Member role within an organization
 */
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
/**
 * Organization data
 */
export interface Organization {
    id: string;
    name: string;
    type: OrganizationType;
    status: OrganizationStatus;
    description: string | null;
    website: string | null;
    logoUrl: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    registrationNumber: string | null;
    ownerId: string;
    settings: OrganizationSettings;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Organization with members
 */
export interface OrganizationWithMembers extends Organization {
    members: OrganizationMember[];
    memberCount: number;
}
/**
 * Organization member
 */
export interface OrganizationMember {
    id: string;
    userId: string;
    organizationId: string;
    role: MemberRole;
    joinedAt: Date;
    invitedBy: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    };
}
/**
 * Organization settings stored as JSON
 */
export interface OrganizationSettings {
    compliance: {
        regulatoryAreas: string[];
        autoComplianceCheck: boolean;
        deadlineReminders: boolean;
        reminderDays: number[];
    };
    notifications: {
        emailNotifications: boolean;
        weeklyReport: boolean;
        complianceAlerts: boolean;
    };
    access: {
        allowMemberInvites: boolean;
        requireApproval: boolean;
        defaultMemberRole: MemberRole;
    };
    branding: {
        primaryColor: string | null;
        customLogo: boolean;
    };
}
/**
 * Default organization settings
 */
export declare const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings;
/**
 * Create organization input
 */
export interface CreateOrganizationInput {
    name: string;
    type: OrganizationType;
    description?: string;
    website?: string;
    address?: string;
    phone?: string;
    email?: string;
    registrationNumber?: string;
    regulatoryAreas?: string[];
}
/**
 * Update organization input
 */
export interface UpdateOrganizationInput {
    name?: string;
    type?: OrganizationType;
    description?: string;
    website?: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    email?: string;
    registrationNumber?: string;
}
/**
 * Update organization settings input
 */
export interface UpdateSettingsInput {
    compliance?: Partial<OrganizationSettings['compliance']>;
    notifications?: Partial<OrganizationSettings['notifications']>;
    access?: Partial<OrganizationSettings['access']>;
    branding?: Partial<OrganizationSettings['branding']>;
}
/**
 * Add member input
 */
export interface AddMemberInput {
    email: string;
    role: MemberRole;
    sendInvite?: boolean;
}
/**
 * Invitation data
 */
export interface Invitation {
    id: string;
    organizationId: string;
    email: string;
    role: MemberRole;
    invitedBy: string;
    token: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    createdAt: Date;
}
/**
 * Organization statistics
 */
export interface OrganizationStats {
    totalMembers: number;
    activeMembers: number;
    membersByRole: Record<MemberRole, number>;
    totalPolicies: number;
    publishedPolicies: number;
    draftPolicies: number;
    totalDocuments: number;
    totalQueries: number;
    storageUsedBytes: number;
    storageQuotaBytes: number;
    aiTokensUsedThisMonth: number;
    aiTokensQuota: number;
    complianceScore: number | null;
    pendingRequirements: number;
    completedRequirements: number;
    upcomingDeadlines: number;
    lastActivityAt: Date | null;
    createdAt: Date;
}
/**
 * Member activity stats
 */
export interface MemberActivityStats {
    userId: string;
    userName: string;
    policiesCreated: number;
    queriesSubmitted: number;
    documentsUploaded: number;
    lastActiveAt: Date | null;
}
/**
 * Add member result
 */
export interface AddMemberResult {
    success: boolean;
    member?: OrganizationMember;
    invitation?: Invitation;
    message: string;
}
/**
 * Remove member result
 */
export interface RemoveMemberResult {
    success: boolean;
    message: string;
}
/**
 * Transfer ownership result
 */
export interface TransferOwnershipResult {
    success: boolean;
    previousOwner: {
        id: string;
        newRole: MemberRole;
    };
    newOwner: {
        id: string;
        role: MemberRole;
    };
    message: string;
}
/**
 * Delete organization result
 */
export interface DeleteOrganizationResult {
    success: boolean;
    archivedPolicies: number;
    archivedDocuments: number;
    removedMembers: number;
    message: string;
}
/**
 * Organization list filters
 */
export interface OrganizationFilters {
    type?: OrganizationType;
    status?: OrganizationStatus;
    search?: string;
    page?: number;
    limit?: number;
}
/**
 * Member list filters
 */
export interface MemberFilters {
    role?: MemberRole;
    search?: string;
    page?: number;
    limit?: number;
}
/**
 * Paginated members result
 */
export interface PaginatedMembers {
    members: OrganizationMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class OrganizationError extends Error {
    code: OrganizationErrorCode;
    statusCode: number;
    constructor(message: string, code: OrganizationErrorCode, statusCode?: number);
}
export type OrganizationErrorCode = 'ORGANIZATION_NOT_FOUND' | 'MEMBER_NOT_FOUND' | 'USER_NOT_FOUND' | 'ALREADY_MEMBER' | 'NOT_MEMBER' | 'INSUFFICIENT_PERMISSIONS' | 'CANNOT_REMOVE_OWNER' | 'CANNOT_REMOVE_LAST_ADMIN' | 'INVALID_ROLE' | 'INVITATION_EXPIRED' | 'INVITATION_NOT_FOUND' | 'ORGANIZATION_LIMIT_REACHED' | 'MEMBER_LIMIT_REACHED' | 'RATE_LIMIT_EXCEEDED';
export declare const ORGANIZATION_CONSTANTS: {
    readonly MAX_MEMBERS_FREE: 5;
    readonly MAX_MEMBERS_PRO: 25;
    readonly MAX_MEMBERS_ENTERPRISE: 100;
    readonly MAX_ORGANIZATIONS_PER_USER: 5;
    readonly ORG_CACHE_TTL: number;
    readonly MEMBERS_CACHE_TTL: number;
    readonly STATS_CACHE_TTL: number;
    readonly INVITATION_EXPIRY_DAYS: 7;
    readonly REDIS_KEYS: {
        readonly ORGANIZATION: "org:";
        readonly MEMBERS: "org:members:";
        readonly STATS: "org:stats:";
        readonly INVITATION: "org:invitation:";
    };
    readonly ROLE_HIERARCHY: {
        readonly VIEWER: 1;
        readonly MEMBER: 2;
        readonly ADMIN: 3;
        readonly OWNER: 4;
    };
};
/**
 * Check if role has sufficient permissions
 */
export declare function hasPermission(userRole: MemberRole, requiredRole: MemberRole): boolean;
//# sourceMappingURL=organization.types.d.ts.map