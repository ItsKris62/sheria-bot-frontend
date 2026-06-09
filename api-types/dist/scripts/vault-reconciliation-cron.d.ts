/**
 * Vault Reconciliation Cron Job
 *
 * Nightly reconciliation of R2 vault/ objects against VaultDocument rows.
 * Detects and cleans up R2 orphans; surfaces DB orphans for human review.
 *
 * Render Cron Job config:
 *   Command:  pnpm vault:cron
 *   Schedule: 0 0 * * *  (00:00 UTC = 03:00 Africa/Nairobi)
 *   Region:   Same region as the API service
 *
 * First-run validation:
 *   VAULT_RECONCILIATION_DRY_RUN defaults to true. The cron logs what it
 *   would delete without acting. Flip to false after 2 nights of clean logs.
 */
import 'dotenv/config';
//# sourceMappingURL=vault-reconciliation-cron.d.ts.map