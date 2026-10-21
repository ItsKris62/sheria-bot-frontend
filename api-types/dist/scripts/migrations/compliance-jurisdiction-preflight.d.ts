import 'dotenv/config';
interface PreflightDuplicateGroup {
    organizationId: string;
    category: string;
    title: string;
    duplicateCount: number;
    rowIds: string[];
    completionStates: boolean[];
}
interface PreflightOrgDistribution {
    orgCategory: string;
    orgCount: number;
    complianceItemCount: number;
    snapshotCount: number;
}
export declare function runComplianceJurisdictionPreflight(): Promise<{
    passed: boolean;
    duplicateGroups: PreflightDuplicateGroup[];
    orgDistribution: PreflightOrgDistribution[];
    keyCollisions: number;
}>;
export {};
//# sourceMappingURL=compliance-jurisdiction-preflight.d.ts.map