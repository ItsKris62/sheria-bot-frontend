import { z } from 'zod';
/**
 * Organization Schemas
 *
 * Zod validation schemas for organization management.
 */
/**
 * Create organization
 *
 * @example
 * {
 *   name: "FinTech Solutions Ltd",
 *   type: "STARTUP",
 *   registrationNumber: "PVT-123456",
 *   industry: "Financial Technology",
 *   contactEmail: "info@fintech.co.ke",
 *   contactPhone: "+254700123456",
 *   address: "Nairobi, Kenya"
 * }
 */
export declare const createOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        ENTERPRISE: "ENTERPRISE";
        OTHER: "OTHER";
        BANK: "BANK";
        TELECOM: "TELECOM";
        INSURANCE: "INSURANCE";
    }>;
    registrationNumber: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    contactEmail: z.ZodString;
    contactPhone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    address: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
/**
 * Update organization
 *
 * All fields optional (partial update)
 */
export declare const updateOrganizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        ENTERPRISE: "ENTERPRISE";
        OTHER: "OTHER";
        BANK: "BANK";
        TELECOM: "TELECOM";
        INSURANCE: "INSURANCE";
    }>>;
    registrationNumber: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    contactEmail: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    address: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
/**
 * Get organization by ID
 */
export declare const getOrganizationSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetOrganizationInput = z.infer<typeof getOrganizationSchema>;
/**
 * List organizations with pagination
 */
export declare const listOrganizationsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        ENTERPRISE: "ENTERPRISE";
        OTHER: "OTHER";
        BANK: "BANK";
        TELECOM: "TELECOM";
        INSURANCE: "INSURANCE";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ListOrganizationsInput = z.infer<typeof listOrganizationsSchema>;
/**
 * Add member to organization
 */
export declare const addMemberSchema: z.ZodObject<{
    organizationId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
        VIEWER: "VIEWER";
    }>>;
}, z.core.$strip>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
/**
 * Remove member from organization
 */
export declare const removeMemberSchema: z.ZodObject<{
    organizationId: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
/**
 * Get organization members
 */
export declare const getMembersSchema: z.ZodObject<{
    organizationId: z.ZodString;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetMembersInput = z.infer<typeof getMembersSchema>;
/**
 * Delete organization
 */
export declare const deleteOrganizationSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;
/**
 * Update organization settings (settings page  -  uses ctx.user.organizationId, no id param)
 *
 * All fields optional (partial update). Includes contact information fields.
 */
export declare const updateOrganizationSettingsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    registrationNumber: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodString>;
    contactPerson: z.ZodOptional<z.ZodString>;
    contactPosition: z.ZodOptional<z.ZodString>;
    contactEmail: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
    contactPhone: z.ZodOptional<z.ZodUnion<readonly [z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodLiteral<"">]>>;
}, z.core.$strip>;
export type UpdateOrganizationSettingsInput = z.infer<typeof updateOrganizationSettingsSchema>;
//# sourceMappingURL=organization.schema.d.ts.map