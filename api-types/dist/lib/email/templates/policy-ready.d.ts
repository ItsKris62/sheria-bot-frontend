/**
 * Policy ready email template parameters
 */
export interface PolicyReadyEmailParams {
    to?: string;
    email?: string;
    userId?: string;
    name: string;
    policyTitle: string;
    policyId: string;
    policyUrl: string;
    executiveSummary?: string;
    regulatoryAreas: string[];
    generationTime: number;
    citationCount?: number;
}
/**
 * Generate complete policy ready email
 */
export declare function generatePolicyReadyEmail(params: PolicyReadyEmailParams): {
    html: string;
    text: string;
    subject: string;
};
//# sourceMappingURL=policy-ready.d.ts.map