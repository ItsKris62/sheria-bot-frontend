export type V2RolloutMode = 'OFF' | 'ALLOWLIST' | 'ON';
export interface V2RolloutMetadata {
    rolloutMode?: V2RolloutMode;
    allowedOrgIds?: string[];
}
export declare function isComplianceDashboardV2Enabled(orgId: string): Promise<boolean>;
//# sourceMappingURL=compliance-dashboard-v2-rollout.d.ts.map