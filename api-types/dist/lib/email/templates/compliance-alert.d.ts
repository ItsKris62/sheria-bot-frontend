/**
 * Compliance alert email template parameters
 */
export interface ComplianceAlertEmailParams {
    to?: string;
    email?: string;
    userId?: string;
    name: string;
    alertTitle: string;
    alertType: 'NEW_REGULATION' | 'REGULATION_CHANGE' | 'DEADLINE' | 'VIOLATION_RISK';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    affectedAreas: string[];
    actionRequired: string;
    deadline?: string;
    resourceUrl?: string;
    recommendations?: string[];
}
/**
 * Generate complete compliance alert email
 */
export declare function generateComplianceAlertEmail(params: ComplianceAlertEmailParams): {
    html: string;
    text: string;
    subject: string;
};
//# sourceMappingURL=compliance-alert.d.ts.map