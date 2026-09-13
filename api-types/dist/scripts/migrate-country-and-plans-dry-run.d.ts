/**
 * Migration Dry-Run & Execution Script: Organization Jurisdiction & Plan Upgrade
 *
 * Requirements:
 * 1. Do not default all records to KE blindly.
 * 2. Backfill only from authoritative existing organization jurisdiction data.
 * 3. Mark unresolved records with `needsCountryConfirmation = true`.
 * 4. Permit account access while requiring country confirmation (no unrestricted retrieval).
 * 5. Preserve records, ownership, memberships, and pilot expiry.
 * 6. Produce an idempotent dry-run report showing mapped, unresolved, and conflicting records.
 *
 * Usage:
 *   Dry-run mode:  tsx src/scripts/migrate-country-and-plans-dry-run.ts
 *   Execute mode:  tsx src/scripts/migrate-country-and-plans-dry-run.ts --execute
 */
import 'dotenv/config';
import { type SubscriptionPlan } from '@prisma/client';
import { type AuditedJurisdiction } from '../config/jurisdictions.config';
interface OrganizationMigrationRecord {
    id: string;
    name: string;
    plan: SubscriptionPlan;
    currentJurisdiction: string | null;
    resolvedJurisdiction: AuditedJurisdiction | null;
    enabledJurisdictions: AuditedJurisdiction[];
    needsCountryConfirmation: boolean;
    resolutionSource: 'EXISTING_VALID' | 'CBK_LICENSE' | 'AUTHORITATIVE_TLD' | 'UNRESOLVED';
    conflict: string | null;
    isPilot: boolean;
}
export declare function evaluateOrganizationJurisdictions(isExecute?: boolean): Promise<{
    total: number;
    mapped: number;
    unresolved: number;
    conflicts: number;
    records: OrganizationMigrationRecord[];
}>;
export {};
//# sourceMappingURL=migrate-country-and-plans-dry-run.d.ts.map