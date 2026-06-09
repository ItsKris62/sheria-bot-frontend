/**
 * One-time backfill script: reconstruct historical UsagePeriod records from
 * existing timestamped records (ComplianceQuery, Checklist, GapAnalysis, Policy).
 *
 * Run manually AFTER running the add_usage_period.sql migration:
 *   npx ts-node -r tsconfig-paths/register src/scripts/backfill-usage-periods.ts
 *
 * Safe to run multiple times  -  uses upserts (createMany with skipDuplicates).
 *
 * Caveats:
 * - Plan limits are snapshotted from each org's CURRENT plan (imperfect for
 *   orgs that have upgraded/downgraded, but best available without plan history).
 * - documentStorageMb is left at 0 for all historical periods (no size data
 *   on existing records; the live system will track this going forward).
 * - apiCalls are left at 0 (the feature was never metered in existing code).
 */
import 'dotenv/config';
//# sourceMappingURL=backfill-usage-periods.d.ts.map