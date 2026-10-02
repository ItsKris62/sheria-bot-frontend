/**
 * Backfill LegalDocument Storage Keys Script
 *
 * Normalizes legacy full-URL `fileUrl` entries in `LegalDocument` table to raw R2 keys.
 * Example:
 *   "https://your-bucket.r2.dev/legal-documents/doc-123.pdf" -> "legal-documents/doc-123.pdf"
 *
 * Usage:
 *   # Dry run (default):
 *   pnpm tsx src/scripts/backfill-legal-document-keys.ts --dry-run
 *
 *   # Apply changes:
 *   pnpm tsx src/scripts/backfill-legal-document-keys.ts --apply
 */
import 'dotenv/config';
//# sourceMappingURL=backfill-legal-document-keys.d.ts.map