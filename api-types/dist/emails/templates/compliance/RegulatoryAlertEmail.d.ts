import * as React from 'react';
export interface RegulatoryAlertEmailProps {
    recipientName: string;
    alertTitle: string;
    alertSummary: string;
    alertBody: string;
    regulatoryBody: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    effectiveDate?: string;
    sourceUrl?: string;
    alertUrl: string;
    unsubscribeUrl: string;
}
export declare function RegulatoryAlertEmail({ recipientName, alertTitle, alertSummary, alertBody, regulatoryBody, severity, effectiveDate, sourceUrl, alertUrl, unsubscribeUrl, }: RegulatoryAlertEmailProps): React.JSX.Element;
export declare function getRegulatoryAlertEmailSubject(severity: string, regulatoryBody: string, title: string): string;
//# sourceMappingURL=RegulatoryAlertEmail.d.ts.map