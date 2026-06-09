import { Prisma } from '@prisma/client';
import { z } from 'zod';
export declare function isValidOrganizationId(value: string): boolean;
export declare const optionalOrganizationIdSchema: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodString>>;
export declare const createUserWithOrganizationInputSchema: z.ZodObject<{
    email: z.ZodString;
    fullName: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        ENTERPRISE: "ENTERPRISE";
        ADMIN: "ADMIN";
    }>>;
    subscriptionTier: z.ZodOptional<z.ZodEnum<{
        REGULATOR: "REGULATOR";
        STARTUP: "STARTUP";
        BUSINESS: "BUSINESS";
        ENTERPRISE: "ENTERPRISE";
    }>>;
    isPilot: z.ZodDefault<z.ZodBoolean>;
    organizationId: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodString>>;
    organizationName: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodString>>;
    supabaseAuthId: z.ZodString;
    adminId: z.ZodString;
    requestId: z.ZodString;
    passwordHash: z.ZodOptional<z.ZodString>;
    mustChangePassword: z.ZodDefault<z.ZodBoolean>;
    temporaryPasswordExpiresAt: z.ZodOptional<z.ZodDate>;
    temporaryPasswordIssuedAt: z.ZodOptional<z.ZodDate>;
    temporaryPasswordDeliveryStatus: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export interface CreateUserWithOrganizationInput {
    email: string;
    fullName: string;
    role?: 'REGULATOR' | 'STARTUP' | 'ENTERPRISE' | 'ADMIN';
    subscriptionTier?: 'REGULATOR' | 'STARTUP' | 'BUSINESS' | 'ENTERPRISE';
    isPilot?: boolean;
    organizationId?: string;
    organizationName?: string;
    supabaseAuthId: string;
    adminId: string;
    requestId: string;
    passwordHash?: string;
    mustChangePassword?: boolean;
    temporaryPasswordExpiresAt?: Date;
    temporaryPasswordIssuedAt?: Date;
    temporaryPasswordDeliveryStatus?: string;
}
declare const provisionedUserInclude: {
    organization: {
        select: {
            id: true;
            name: true;
            subscriptionTier: true;
            plan: true;
        };
    };
};
export type ProvisionedUser = Prisma.UserGetPayload<{
    include: typeof provisionedUserInclude;
}>;
export type ProvisionedOrganization = NonNullable<ProvisionedUser['organization']>;
export interface CreateUserWithOrganizationResult {
    user: ProvisionedUser;
    organization: ProvisionedOrganization | null;
}
export declare function createUserWithOrganization(rawInput: CreateUserWithOrganizationInput): Promise<CreateUserWithOrganizationResult>;
export {};
//# sourceMappingURL=userProvisioning.service.d.ts.map