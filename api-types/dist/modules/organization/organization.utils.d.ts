/**
 * Organization Module Utilities
 * Helper functions for organization operations
 */
import { z } from 'zod';
import type { Organization, OrganizationWithMembers, OrganizationMember, OrganizationSettings, MemberRole } from './organization.types';
/**
 * Create organization validation schema
 */
export declare const createOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        REGULATOR: "REGULATOR";
        OTHER: "OTHER";
        FINTECH: "FINTECH";
        BANK: "BANK";
        INSURANCE: "INSURANCE";
        SACCO: "SACCO";
        MFI: "MFI";
        PAYMENT_PROVIDER: "PAYMENT_PROVIDER";
        LENDING: "LENDING";
        INVESTMENT: "INVESTMENT";
    }>;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    registrationNumber: z.ZodOptional<z.ZodString>;
    regulatoryAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Update organization validation schema
 */
export declare const updateOrganizationSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        REGULATOR: "REGULATOR";
        OTHER: "OTHER";
        FINTECH: "FINTECH";
        BANK: "BANK";
        INSURANCE: "INSURANCE";
        SACCO: "SACCO";
        MFI: "MFI";
        PAYMENT_PROVIDER: "PAYMENT_PROVIDER";
        LENDING: "LENDING";
        INVESTMENT: "INVESTMENT";
    }>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    website: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    logoUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    registrationNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
/**
 * Update settings validation schema
 */
export declare const updateSettingsSchema: z.ZodObject<{
    compliance: z.ZodOptional<z.ZodObject<{
        regulatoryAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
        autoComplianceCheck: z.ZodOptional<z.ZodBoolean>;
        deadlineReminders: z.ZodOptional<z.ZodBoolean>;
        reminderDays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>>;
    notifications: z.ZodOptional<z.ZodObject<{
        emailNotifications: z.ZodOptional<z.ZodBoolean>;
        weeklyReport: z.ZodOptional<z.ZodBoolean>;
        complianceAlerts: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    access: z.ZodOptional<z.ZodObject<{
        allowMemberInvites: z.ZodOptional<z.ZodBoolean>;
        requireApproval: z.ZodOptional<z.ZodBoolean>;
        defaultMemberRole: z.ZodOptional<z.ZodEnum<{
            ADMIN: "ADMIN";
            OWNER: "OWNER";
            MEMBER: "MEMBER";
            VIEWER: "VIEWER";
        }>>;
    }, z.core.$strip>>;
    branding: z.ZodOptional<z.ZodObject<{
        primaryColor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        customLogo: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Add member validation schema
 */
export declare const addMemberSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        OWNER: "OWNER";
        MEMBER: "MEMBER";
        VIEWER: "VIEWER";
    }> & z.ZodType<"ADMIN" | "MEMBER" | "VIEWER", "ADMIN" | "OWNER" | "MEMBER" | "VIEWER", z.core.$ZodTypeInternals<"ADMIN" | "MEMBER" | "VIEWER", "ADMIN" | "OWNER" | "MEMBER" | "VIEWER">>;
    sendInvite: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Update member role validation schema
 */
export declare const updateMemberRoleSchema: z.ZodObject<{
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        OWNER: "OWNER";
        MEMBER: "MEMBER";
        VIEWER: "VIEWER";
    }> & z.ZodType<"ADMIN" | "MEMBER" | "VIEWER", "ADMIN" | "OWNER" | "MEMBER" | "VIEWER", z.core.$ZodTypeInternals<"ADMIN" | "MEMBER" | "VIEWER", "ADMIN" | "OWNER" | "MEMBER" | "VIEWER">>;
}, z.core.$strip>;
/**
 * Member filters validation schema
 */
export declare const memberFiltersSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        OWNER: "OWNER";
        MEMBER: "MEMBER";
        VIEWER: "VIEWER";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Convert database organization to Organization type
 */
export declare function toOrganization(dbOrg: {
    id: string;
    name: string;
    type: string;
    status: string;
    description: string | null;
    website: string | null;
    logoUrl: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    registrationNumber: string | null;
    ownerId: string;
    settings: any;
    createdAt: Date;
    updatedAt: Date;
}): Organization;
/**
 * Convert database organization with members to OrganizationWithMembers
 */
export declare function toOrganizationWithMembers(dbOrg: any, members: OrganizationMember[]): OrganizationWithMembers;
/**
 * Convert database member to OrganizationMember
 */
export declare function toOrganizationMember(dbMember: {
    id: string;
    userId: string;
    organizationId: string;
    role: string;
    joinedAt: Date;
    invitedBy: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string | null;
        lastLoginAt?: Date | null;
    };
}): OrganizationMember;
/**
 * Default organization settings
 */
export declare const defaultSettings: OrganizationSettings;
/**
 * Parse settings from database JSON
 */
export declare function parseSettings(settings: any): OrganizationSettings;
/**
 * Deep merge settings with defaults
 */
export declare function mergeSettings(defaults: OrganizationSettings, updates: Partial<OrganizationSettings>): OrganizationSettings;
/**
 * Role hierarchy for permission checks
 */
export declare const ROLE_HIERARCHY: Record<MemberRole, number>;
/**
 * Check if a role has at least the required permission level
 */
export declare function hasPermission(userRole: MemberRole, requiredRole: MemberRole): boolean;
/**
 * Check if user can modify another user's role
 */
export declare function canModifyRole(modifierRole: MemberRole, targetCurrentRole: MemberRole, targetNewRole: MemberRole): boolean;
/**
 * Get role display name
 */
export declare function getRoleDisplayName(role: MemberRole): string;
/**
 * Get role description
 */
export declare function getRoleDescription(role: MemberRole): string;
/**
 * Generate invitation token
 */
export declare function generateInvitationToken(): string;
/**
 * Generate member invitation email
 */
export declare function generateInvitationEmail(organizationName: string, inviterName: string, role: MemberRole, inviteUrl: string): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate member removed notification email
 */
export declare function generateMemberRemovedEmail(memberName: string, organizationName: string): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate role change notification email
 */
export declare function generateRoleChangeEmail(memberName: string, organizationName: string, oldRole: MemberRole, newRole: MemberRole): {
    subject: string;
    text: string;
    html: string;
};
/**
 * Generate ownership transfer email
 */
export declare function generateOwnershipTransferEmail(newOwnerName: string, previousOwnerName: string, organizationName: string, isNewOwner: boolean): {
    subject: string;
    text: string;
    html: string;
};
//# sourceMappingURL=organization.utils.d.ts.map