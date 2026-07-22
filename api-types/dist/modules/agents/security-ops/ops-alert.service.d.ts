import type { EmailOptions, EmailResult } from '@/lib/email/client';
type SendEmail = (options: EmailOptions) => Promise<EmailResult>;
export interface OpsAlertDependencies {
    sendEmail?: SendEmail;
}
export interface OpsAlertInput {
    subject: string;
    summary: string;
    risks: string[];
    agentRunId: string;
}
/**
 * Sibling to agent-run.service.ts's own private operator-alert method - same
 * sendEmail() primitive and recipient, different (ops-specific) tags. Does not import
 * from or modify src/modules/agents/agent-run.service.ts.
 */
export declare class SecurityOpsAlertService {
    private readonly sendEmail;
    constructor(dependencies?: OpsAlertDependencies);
    sendAlert(input: OpsAlertInput): Promise<void>;
}
export declare const securityOpsAlertService: SecurityOpsAlertService;
export {};
//# sourceMappingURL=ops-alert.service.d.ts.map