/**
 * Backfill OrganizationMember rows for legacy users with User.organizationId.
 *
 * Dry run is the default:
 *   pnpm tsx src/scripts/backfill-organization-memberships.ts
 *   pnpm tsx src/scripts/backfill-organization-memberships.ts --dry-run
 *
 * Apply writes only safe MEMBER/ACTIVE rows:
 *   pnpm tsx src/scripts/backfill-organization-memberships.ts --apply
 *   pnpm tsx src/scripts/backfill-organization-memberships.ts --apply --limit=100
 *
 * Optional filters:
 *   --userId=<id> --organizationId=<id> --json --verbose
 */
import 'dotenv/config';
import { MemberRole, MemberStatus } from '@prisma/client';
export type BackfillMode = 'dry-run' | 'apply';
export type MembershipBackfillClassification = 'existing_active' | 'existing_non_active' | 'missing_would_create' | 'created' | 'skipped_already_exists' | 'ambiguous_org_missing' | 'ambiguous_multiple_memberships' | 'ambiguous_other_active_org' | 'create_failed';
export interface BackfillOptions {
    mode: BackfillMode;
    limit?: number;
    userId?: string;
    organizationId?: string;
    verbose: boolean;
    json: boolean;
}
export type LegacyUserCandidate = {
    id: string;
    organizationId: string | null;
    organization: {
        id: string;
    } | null;
    organizationMemberships: Array<{
        id: string;
        organizationId: string;
        role: MemberRole;
        status: MemberStatus;
    }>;
};
export interface BackfillReportItem {
    userId: string;
    organizationId: string | null;
    classification: MembershipBackfillClassification;
    wouldCreate: boolean;
    created: boolean;
    reason?: string;
    existingMembershipIds?: string[];
    existingStatus?: MemberStatus;
    existingRole?: MemberRole;
    otherActiveOrganizationIds?: string[];
    error?: string;
}
export interface BackfillReport {
    mode: BackfillMode;
    usersScanned: number;
    usersWithOrganizationId: number;
    existingActive: number;
    existingNonActive: number;
    missingMemberships: number;
    wouldCreate: number;
    created: number;
    ambiguous: number;
    skipped: number;
    cachesInvalidated: number;
    cacheInvalidationFailures: number;
    items: BackfillReportItem[];
}
export interface BackfillDependencies {
    findCandidates(options: BackfillOptions): Promise<LegacyUserCandidate[]>;
    createMembership(input: {
        userId: string;
        organizationId: string;
        role: MemberRole;
        status: MemberStatus;
    }): Promise<void>;
    findMemberships(userId: string, organizationId: string): Promise<Array<{
        id: string;
        status: MemberStatus;
    }>>;
    deleteCacheKey(key: string): Promise<unknown>;
}
export declare function parseBackfillOptions(argv: string[]): BackfillOptions;
export declare function membershipCacheKeysFor(userId: string, organizationId: string): string[];
export declare function buildMembershipCreateInput(userId: string, organizationId: string): {
    userId: string;
    organizationId: string;
    role: "MEMBER";
    status: "ACTIVE";
};
export declare function classifyLegacyMembershipCase(user: LegacyUserCandidate): BackfillReportItem;
export declare function buildInitialReport(mode: BackfillMode, candidates: LegacyUserCandidate[]): BackfillReport;
export declare function runOrganizationMembershipBackfill(options: BackfillOptions, dependencies?: BackfillDependencies): Promise<BackfillReport>;
export declare function formatTextReport(report: BackfillReport, options: BackfillOptions): string;
//# sourceMappingURL=backfill-organization-memberships.d.ts.map