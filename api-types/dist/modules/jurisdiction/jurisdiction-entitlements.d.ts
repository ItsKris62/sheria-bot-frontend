import { TRPCError } from '@trpc/server';
import type { EffectivePlan } from '@/types/plan.types';
import { JurisdictionContractError, type JurisdictionCode, type JurisdictionContext, type JurisdictionSource, type QueryMode } from '@/types/jurisdiction';
export declare const JURISDICTION_AUTH_ERROR: {
    readonly HOME_JURISDICTION_REQUIRED: "HOME_JURISDICTION_REQUIRED";
    readonly JURISDICTION_NOT_ENTITLED: "JURISDICTION_NOT_ENTITLED";
    readonly COMPARISON_NOT_ENTITLED: "COMPARISON_NOT_ENTITLED";
};
export type JurisdictionAuthorizationErrorCode = keyof typeof JURISDICTION_AUTH_ERROR | JurisdictionContractError['code'];
export declare class JurisdictionAuthorizationError extends Error {
    readonly code: JurisdictionAuthorizationErrorCode;
    readonly statusCode: 400 | 403;
    constructor(code: JurisdictionAuthorizationErrorCode, message: string, statusCode?: 400 | 403);
}
export interface JurisdictionEntitlementRule {
    restrictedToHomeJurisdiction: boolean;
    comparisonAllowed: boolean;
    maxJurisdictions: number;
}
export declare const JURISDICTION_ENTITLEMENTS: Record<EffectivePlan, JurisdictionEntitlementRule>;
export interface ResolvedJurisdictionEntitlement {
    homeJurisdiction: JurisdictionCode;
    requestedJurisdictions: JurisdictionCode[];
    allowedJurisdictions: JurisdictionCode[];
    mode: QueryMode;
    comparisonAllowed: boolean;
    jurisdictionContext: JurisdictionContext;
}
interface JurisdictionPrismaReader {
    organization: {
        findUnique(args: {
            where: {
                id: string;
            };
            select: {
                id: true;
                homeJurisdictionCode: true;
            };
        }): Promise<{
            id: string;
            homeJurisdictionCode: string | null;
        } | null>;
    };
}
interface ResolveJurisdictionEntitlementInput {
    prisma: JurisdictionPrismaReader;
    organizationId: string;
    effectivePlan: EffectivePlan;
    requestedMode?: QueryMode;
    requestedJurisdictions?: readonly JurisdictionCode[];
    allowLegacyDefault?: boolean;
    source?: JurisdictionSource;
    audit?: {
        userId?: string;
        route?: string;
    };
}
export declare function toTrpcJurisdictionAuthorizationError(error: unknown): TRPCError;
export declare function resolveJurisdictionEntitlement(input: ResolveJurisdictionEntitlementInput): Promise<ResolvedJurisdictionEntitlement>;
export {};
//# sourceMappingURL=jurisdiction-entitlements.d.ts.map