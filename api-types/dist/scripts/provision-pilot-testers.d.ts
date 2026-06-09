/**
 * Pilot Tester Provisioning Script
 *
 * Creates Supabase Auth invitations and corresponding Prisma User + Organization
 * records for each pilot tester defined in pilot-testers.config.ts.
 *
 * Design invariants:
 *   - Idempotent: testers whose email already exists in the DB are skipped.
 *   - One Organization per tester (per Q3 architectural decision) to enforce
 *     RLS isolation and clean conversion path post-pilot.
 *   - Organization.plan is left at REGULATOR. The withPlanContext middleware
 *     overrides to ENTERPRISE for active pilots via User.isPilot + pilotExpiresAt
 *     (Option A: derived override, no Org mutation).
 *   - role is set to ENTERPRISE (the spec listed BUSINESS which is not a valid
 *     UserRole enum value; ENTERPRISE is the closest valid equivalent for
 *     testers receiving Enterprise-tier access).
 *
 * Usage:
 *   # Dry run (default -- safe, no DB or Auth changes):
 *   pnpm tsx src/scripts/provision-pilot-testers.ts
 *   pnpm tsx src/scripts/provision-pilot-testers.ts --dry-run
 *
 *   # Execute:
 *   pnpm tsx src/scripts/provision-pilot-testers.ts --execute
 *
 * Prerequisites:
 *   - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL must be set
 *     (via .env or environment).
 *   - SQL from Task 1 must have been run in Supabase (adds isPilot etc. columns).
 *   - pilot-testers.config.ts must be populated with tester data.
 */
import 'dotenv/config';
//# sourceMappingURL=provision-pilot-testers.d.ts.map