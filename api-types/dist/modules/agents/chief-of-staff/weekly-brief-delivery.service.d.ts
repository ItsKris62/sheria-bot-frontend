import type { EmailOptions, EmailResult } from '@/lib/email/client';
import type { DecisionNeeded, RankedAction } from './types';
type SendEmail = (options: EmailOptions) => Promise<EmailResult>;
export interface WeeklyBriefDeliveryDependencies {
    sendEmail?: SendEmail;
}
export interface WeeklyBriefDeliveryInput {
    subject: string;
    summary: string;
    wins: string[];
    rankedActions: RankedAction[];
    decisionsNeeded: DecisionNeeded[];
    agentRunId: string;
}
/**
 * Sibling to security-ops' own operator-alert service - same sendEmail()
 * primitive and recipient, different (weekly-brief-specific) tags. Does not
 * import from or modify anything in the security-ops module, or
 * agent-run.service.ts's own alert method.
 *
 * Unlike security-ops' evidence-gated alert, this sends on every successful
 * run unconditionally - a "nothing changed this week" brief is still the
 * point of a weekly digest.
 */
export declare class WeeklyBriefDeliveryService {
    private readonly sendEmail;
    constructor(dependencies?: WeeklyBriefDeliveryDependencies);
    send(input: WeeklyBriefDeliveryInput): Promise<void>;
}
export declare const weeklyBriefDeliveryService: WeeklyBriefDeliveryService;
export {};
//# sourceMappingURL=weekly-brief-delivery.service.d.ts.map