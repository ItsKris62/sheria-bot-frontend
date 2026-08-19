import { SubscriptionPlan } from '@prisma/client';
import type { MemberRole } from '@prisma/client';
type TxLike = {
    $executeRaw: (query: TemplateStringsArray, ...values: any[]) => Promise<any>;
    organization: {
        findUnique: (args: any) => Promise<any>;
    };
    organizationMember: {
        findUnique: (args: any) => Promise<any>;
        findFirst: (args: any) => Promise<any>;
        upsert: (args: any) => Promise<any>;
        count: (args: any) => Promise<number>;
    };
    invitation: {
        create: (args: any) => Promise<any>;
        findFirst: (args: any) => Promise<any>;
        findUnique: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
        count: (args: any) => Promise<number>;
    };
    user: {
        findUnique: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
    };
    auditLog?: {
        create: (args: any) => Promise<any>;
    };
    pilotAccess?: {
        findFirst: (args: any) => Promise<any>;
    };
};
export type OrganizationInvitationRole = MemberRole;
export declare function generateInvitationToken(): string;
export declare function hashInvitationToken(rawToken: string): string;
export declare function lockOrganizationSeatAllocation(tx: TxLike, organizationId: string): Promise<void>;
export declare function invitationTokenWhere(rawToken: string): Array<{
    token: string;
}>;
export declare function platformRoleForOrganizationPlan(plan: SubscriptionPlan): 'STARTUP' | 'ENTERPRISE';
export declare function assertOrganizationHasTeamSeats(tx: TxLike, organizationId: string): Promise<{
    plan: SubscriptionPlan;
}>;
export declare function assertSeatCapacityLocked(tx: TxLike, organizationId: string): Promise<void>;
export declare function findValidInvitationByEmailAndToken(tx: TxLike, email: string, rawToken: string | undefined): Promise<any | null>;
export declare function hasPendingInvitationForEmail(tx: TxLike, email: string): Promise<boolean>;
export declare function createOrganizationInvitationLocked(args: {
    tx: TxLike;
    actorUserId: string;
    organizationId: string;
    email: string;
    organizationRole: OrganizationInvitationRole;
    expiresInDays: number;
    inviterName?: string | null;
}): Promise<{
    invitation: any;
    rawToken: string;
}>;
export declare function sendOrganizationInvitationEmail(args: {
    email: string;
    rawToken: string;
    role: string;
    inviterName?: string | null;
    expiresInDays: number;
}): Promise<void>;
export declare function writeSafeAuditLog(tx: TxLike, args: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
    ipAddress?: string | null;
    userAgent?: string | null;
}): Promise<void>;
export {};
//# sourceMappingURL=organization-invitation.service.d.ts.map