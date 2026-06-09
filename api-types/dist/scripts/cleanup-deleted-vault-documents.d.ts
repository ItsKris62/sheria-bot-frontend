/**
 * Permanently deletes soft-deleted vault objects after the retention period.
 *
 * Policy:
 *   - User delete marks VaultDocument.deletedAt and keeps the R2 object for recovery/audit.
 *   - This cron deletes the R2 object and then the DB row after retention expires.
 *   - Active DB rows are never deleted by this script.
 *
 * Usage:
 *   pnpm vault:cleanup-deleted
 *   VAULT_DELETED_RETENTION_DAYS=30 pnpm vault:cleanup-deleted
 */
export {};
//# sourceMappingURL=cleanup-deleted-vault-documents.d.ts.map