/**
 * pilot-access.test.ts
 *
 * Static source-analysis tests that verify the production-incident fixes
 * described in the "pilot tester access" incident report.
 *
 * These tests do NOT require a live database or Redis connection — they
 * inspect the source text of the relevant modules to confirm that the
 * required structural guarantees are present.
 *
 * Acceptance criteria covered:
 *   1. New pilot tester can access complianceDashboard.getComplianceDashboard.
 *   2. New pilot tester can call checklist.listChecklists.
 *   3. New pilot tester can call gapAnalysis.getFrameworks / run gap analysis.
 *   4. User without ACTIVE OrganizationMember still gets FORBIDDEN.
 *   5. admin.getStats no longer throws on prisma.policy.count().
 *   6. system health returns OK or DEGRADED, not an unhandled 500.
 */
export {};
//# sourceMappingURL=pilot-access.test.d.ts.map