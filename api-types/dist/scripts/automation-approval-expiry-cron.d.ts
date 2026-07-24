/**
 * Automation Approval Expiry Cron Job
 *
 * Ages out PENDING AutomationApproval rows nobody ever decided on
 * (createApproval sets a 24h expiresAt). Approvals gate content publication
 * and similar customer-facing actions, so an hour of staleness tolerance
 * between expiry and this sweep is acceptable - not worth a tighter interval.
 *
 * Render Cron Job config:
 *   Command:  pnpm automation-approval-expiry:cron
 *   Schedule: 0 * * * *  (hourly)
 *   Region:   Same region as the API service
 */
import 'dotenv/config';
//# sourceMappingURL=automation-approval-expiry-cron.d.ts.map