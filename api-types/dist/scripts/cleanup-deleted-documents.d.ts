/**
 * Cleanup Deleted Documents Script
 *
 * Permanently removes documents that were soft-deleted more than
 * RETENTION_DAYS ago. For each expired document:
 *   1. Deletes the R2 object from Cloudflare R2
 *   2. Hard-deletes the DB record (cascades to DocumentChunk + DocumentShare)
 *
 * Run via:
 *   pnpm tsx src/scripts/cleanup-deleted-documents.ts
 *
 * Schedule recommendation (Render):
 *   Add a Render Cron Job that runs this script daily at a low-traffic hour.
 *   Example cron expression: "0 2 * * *"  (02:00 UTC every day)
 *
 * Environment variables:
 *   RETENTION_DAYS  -  days to retain soft-deleted documents before hard delete
 *                    Defaults to 90 if not set.
 */
import 'dotenv/config';
//# sourceMappingURL=cleanup-deleted-documents.d.ts.map