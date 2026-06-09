type PrismaLike = {
    organization: {
        findUnique: (args: any) => Promise<any>;
    };
    organizationMember: {
        count: (args: any) => Promise<number>;
        findFirst?: (args: any) => Promise<any>;
    };
    invitation: {
        count: (args: any) => Promise<number>;
        findFirst: (args: any) => Promise<any>;
    };
    pilotAccess?: {
        findFirst: (args: any) => Promise<any>;
    };
};
export interface OrganizationSeatUsage {
    seatLimit: number;
    activeMembers: number;
    pendingInvites: number;
    usedSeats: number;
    availableSeats: number;
}
export declare function buildSeatLimitMessage(usage: OrganizationSeatUsage): string;
export declare function getSeatUsageForOrganization(prisma: PrismaLike, organizationId: string, now?: Date): Promise<OrganizationSeatUsage>;
export declare function hasSeatCapacity(usage: OrganizationSeatUsage): boolean;
export declare function findPendingOrganizationInvite(prisma: PrismaLike, organizationId: string, email: string, now?: Date): Promise<{
    id: string;
} | null>;
export {};
//# sourceMappingURL=organization-seat.service.d.ts.map