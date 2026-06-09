/**
 * Compliance Snapshot Retention Cleanup Cron Job
 *
 * Deletes ComplianceScoreSnapshot rows older than 90 days.
 * The trend window only needs 30 days; 90 days provides a 3× buffer for any
 * future "quarterly review" features without significant storage growth.
 *
 * Design:
 *   - Single deleteMany — no per-row iteration, no N+1.
 *   - Exits 0 on success, 1 on failure (Render treats non-zero as cron failure).
 *   - Structured Pino logs on both success and failure paths.
 *
 * Render Cron Job config (paste into render.yaml or configure in the Render dashboard):
 *   type:     cron
 *   name:     cleanup-compliance-snapshots
 *   schedule: "0 2 * * *"   # 02:00 UTC daily (low-traffic window)
 *   command:  pnpm cron:cleanup-snapshots
 *
 * Run manually:
 *   pnpm cron:cleanup-snapshots
 */
import 'dotenv/config';
//# sourceMappingURL=cleanup-compliance-snapshots.d.ts.map