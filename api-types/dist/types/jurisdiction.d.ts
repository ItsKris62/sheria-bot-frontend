export declare const JURISDICTION_CODES: readonly ["KE", "RW", "MW", "NG"];
export type JurisdictionCode = typeof JURISDICTION_CODES[number];
export type QueryMode = 'SINGLE' | 'COMPARE';
export type JurisdictionAvailabilityStatus = 'ACTIVE' | 'COMING_SOON' | 'DISABLED';
export interface JurisdictionCapability {
    code: JurisdictionCode;
    label: string;
    queryEnabled: boolean;
    comparisonEnabled: boolean;
    status: JurisdictionAvailabilityStatus;
}
export declare const JURISDICTION_CAPABILITIES: Record<JurisdictionCode, JurisdictionCapability>;
export declare const JURISDICTION_LABEL_BY_CODE: Record<JurisdictionCode, string>;
export declare function isJurisdictionCode(value: unknown): value is JurisdictionCode;
export declare function jurisdictionLabel(code: JurisdictionCode): string;
export declare function jurisdictionCodeFromLabel(value: string | null | undefined): JurisdictionCode | null;
export type JurisdictionSource = 'REQUEST' | 'LEGACY_DEFAULT' | 'PERSISTED_QUERY';
export interface SingleJurisdictionContext {
    mode: 'SINGLE';
    jurisdictions: readonly [JurisdictionCode];
    primaryJurisdiction: JurisdictionCode;
    jurisdictionSource: JurisdictionSource;
}
export type JurisdictionContext = SingleJurisdictionContext;
export interface JurisdictionContractInput {
    mode?: QueryMode;
    jurisdictions?: readonly JurisdictionCode[];
}
export declare class JurisdictionContractError extends Error {
    readonly code: 'JURISDICTION_REQUIRED' | 'JURISDICTION_UNSUPPORTED' | 'JURISDICTION_NOT_AVAILABLE' | 'COMPARISON_NOT_ENABLED';
    constructor(code: 'JURISDICTION_REQUIRED' | 'JURISDICTION_UNSUPPORTED' | 'JURISDICTION_NOT_AVAILABLE' | 'COMPARISON_NOT_ENABLED', message: string);
}
export declare function resolveJurisdictionContext(input: JurisdictionContractInput, options?: {
    allowLegacyDefault?: boolean;
    source?: JurisdictionSource;
}): JurisdictionContext;
export declare function resolvePersistedJurisdictionContext(input: {
    mode?: string | null;
    jurisdictions?: unknown;
    primaryJurisdiction?: string | null;
    metadata?: unknown;
}): JurisdictionContext;
export declare function serializeJurisdictionContext(context: JurisdictionContext): {
    mode: 'SINGLE';
    jurisdictions: JurisdictionCode[];
    primaryJurisdiction: JurisdictionCode;
    jurisdictionSource: JurisdictionSource;
};
//# sourceMappingURL=jurisdiction.d.ts.map