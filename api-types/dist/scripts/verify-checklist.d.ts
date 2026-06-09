#!/usr/bin/env tsx
/**
 * verify-checklist.ts
 *
 * Sprint 3B  -  E2E verification script for the three-tier checklist generation pipeline.
 *
 * Usage:
 *   pnpm tsx src/scripts/verify-checklist.ts            # Parse/prompt layer tests only
 *   pnpm tsx src/scripts/verify-checklist.ts --live     # + live Tier 3 AI call (costs tokens)
 *   pnpm tsx src/scripts/verify-checklist.ts --live --all-tiers  # + live Tier 1+2+3 calls
 *
 * Sections:
 *   1. Parse layer unit tests   -  parseWithTierSchema accepts/rejects synthetic inputs
 *   2. Prompt builder tests     -  buildTier1/2/3Prompt return well-formed prompts
 *   3. Live AI test (--live)    -  real Claude call via aiService.executeChecklistStream()
 *   4. Retry service test       -  checklistService.retryChecklist() rejects invalid states
 */
import 'dotenv/config';
//# sourceMappingURL=verify-checklist.d.ts.map