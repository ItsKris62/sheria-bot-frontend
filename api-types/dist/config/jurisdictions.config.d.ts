export declare const AUDITED_JURISDICTIONS: readonly ["KE", "RW", "MW", "NG"];
export type AuditedJurisdiction = typeof AUDITED_JURISDICTIONS[number];
export declare const DEFAULT_JURISDICTION: AuditedJurisdiction;
export declare const JURISDICTION_CURRENCIES: Record<AuditedJurisdiction, string>;
export interface JurisdictionCapability {
    code: AuditedJurisdiction;
    name: string;
    currency: string;
    isSupported: boolean;
    hasComplianceBaseline: boolean;
    hasRegulatoryAlerts: boolean;
}
export declare const JURISDICTION_REGISTRY: Record<AuditedJurisdiction, JurisdictionCapability>;
export declare function isSupportedJurisdiction(code?: string | null): code is AuditedJurisdiction;
export declare function hasComplianceBaseline(code?: string | null): boolean;
export declare function getJurisdictionCapability(code?: string | null): JurisdictionCapability | null;
//# sourceMappingURL=jurisdictions.config.d.ts.map