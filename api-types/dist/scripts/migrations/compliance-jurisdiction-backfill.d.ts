import 'dotenv/config';
interface BackfillStats {
    orgsExamined: number;
    genuineKeOrgs: number;
    nonKeConfiguredOrgs: number;
    unconfiguredOrgs: number;
    canonicalItemsUpdated: number;
    legacyDuplicateItemsPreserved: number;
    snapshotsUpdated: number;
    snapshotsPreservedUnscoped: number;
}
export declare function runComplianceJurisdictionBackfill(execute?: boolean): Promise<BackfillStats>;
export {};
//# sourceMappingURL=compliance-jurisdiction-backfill.d.ts.map