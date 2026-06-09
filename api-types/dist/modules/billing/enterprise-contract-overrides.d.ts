import { z } from 'zod';
import type { PlanEntitlementConfig } from '@/config/entitlements.config';
export declare const allowedEnterpriseOverrideKeys: readonly ["seats.limit", "features.customFrameworks", "features.policyGeneration", "features.licenseManagement", "features.complianceCalendar", "features.gapAnalysis", "features.benchmarkDocuments", "limits.complianceQueries.month", "limits.gapAnalysis.month", "limits.policyGeneration.month", "limits.documentUploads.month", "limits.storageGb", "limits.customFrameworks.count", "limits.benchmarkDocuments.count", "support.tier"];
export type EnterpriseOverrideKey = (typeof allowedEnterpriseOverrideKeys)[number];
export interface AppliedEnterpriseOverride {
    key: EnterpriseOverrideKey;
    source: 'enterprise_contract';
    contractId: string;
    overrideId: string;
}
type EnterpriseOverrideRow = {
    id: string;
    contractId: string;
    key: string;
    value: unknown;
};
export declare const enterpriseOverrideValueSchemas: {
    'seats.limit': z.ZodNumber;
    'features.customFrameworks': z.ZodBoolean;
    'features.policyGeneration': z.ZodBoolean;
    'features.licenseManagement': z.ZodBoolean;
    'features.complianceCalendar': z.ZodBoolean;
    'features.gapAnalysis': z.ZodBoolean;
    'features.benchmarkDocuments': z.ZodBoolean;
    'limits.complianceQueries.month': z.ZodNumber;
    'limits.gapAnalysis.month': z.ZodNumber;
    'limits.policyGeneration.month': z.ZodNumber;
    'limits.documentUploads.month': z.ZodNumber;
    'limits.storageGb': z.ZodNumber;
    'limits.customFrameworks.count': z.ZodNumber;
    'limits.benchmarkDocuments.count': z.ZodNumber;
    'support.tier': z.ZodEnum<{
        community: "community";
        "email-48hr": "email-48hr";
        "priority-24hr": "priority-24hr";
        dedicated: "dedicated";
    }>;
};
export declare function isEnterpriseOverrideKey(key: string): key is EnterpriseOverrideKey;
export declare function parseEnterpriseOverrideValue(key: string, value: unknown): unknown;
export declare function applyEnterpriseContractOverrides(base: PlanEntitlementConfig, rows: EnterpriseOverrideRow[]): {
    entitlements: PlanEntitlementConfig;
    appliedOverrides: AppliedEnterpriseOverride[];
};
export {};
//# sourceMappingURL=enterprise-contract-overrides.d.ts.map