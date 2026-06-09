/**
 * One-time backfill: seed an initial ComplianceScoreSnapshot for every
 * organization that has ComplianceItem rows but no snapshot yet.
 *
 * Without this, the trend indicator shows "insufficient_history" for all
 * existing organizations for the next 30 days after the Batch 3 deployment.
 * Running this backfill immediately after deployment gives the trend logic
 * a baseline to compare against.
 *
 * Safety:
 *   - Idempotent: skips orgs that already have at least one snapshot.
 *   - Skips orgs with zero compliance items (nothing to compute).
 *   - Per-org errors are caught and logged without aborting the run.
 *
 * Run once after deploying Batch 3:
 *   pnpm backfill:compliance-snapshots
 */
import 'dotenv/config';
//# sourceMappingURL=backfill-compliance-snapshots.d.ts.map