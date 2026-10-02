import { Prisma, PrismaClient } from '@prisma/client';
export interface ProvisionOrganizationParams {
    user: {
        id: string;
        email: string;
        fullName?: string | null;
        role?: string;
        organizationId?: string | null;
    };
    companyName?: string | null;
    homeJurisdictionCode?: string | null;
    defaultSubscriptionTier?: string;
}
export interface ProvisionOrganizationResult {
    organizationId: string;
    organizationName: string;
    membershipId: string;
    isNew: boolean;
}
/**
 * Service to provision a default organization and owner membership for a user in an idempotent, atomic manner.
 * Can be executed inside a Prisma interactive transaction (tx) or standalone with the Prisma client.
 */
export declare function provisionDefaultOrganization(tx: Prisma.TransactionClient | PrismaClient, params: ProvisionOrganizationParams): Promise<ProvisionOrganizationResult>;
//# sourceMappingURL=organization-provisioning.service.d.ts.map