/**
 * Backfill script: sync Organization.plan from Organization.subscriptionTier
 *
 * Background
 * ----------
 * The Organization model has two subscription-related fields:
 *   - subscriptionTier (String, legacy)  -  written by the admin module and,
 *     historically, by any billing code that predates the enum migration.
 *   - plan (SubscriptionPlan enum, authoritative)  -  read by withPlanContext
 *     to gate features. Defaults to REGULATOR.
 *
 * Any org whose subscriptionTier indicates a paid tier but whose plan column
 * is still REGULATOR (the schema default) has been wrongly blocked from paid
 * features. This script identifies those orgs and corrects plan.
 *
 * Usage
 * -----
 *   # Dry run (default  -  safe to run at any time):
 *   npx tsx src/scripts/backfill-org-plan.ts
 *
 *   # Targeted dry run for a single org:
 *   npx tsx src/scripts/backfill-org-plan.ts --single <orgId>
 *
 *   # Execute the fix:
 *   npx tsx src/scripts/backfill-org-plan.ts --execute
 *
 *   # Execute for a single org:
 *   npx tsx src/scripts/backfill-org-plan.ts --execute --single <orgId>
 */
export {};
//# sourceMappingURL=backfill-org-plan.d.ts.map