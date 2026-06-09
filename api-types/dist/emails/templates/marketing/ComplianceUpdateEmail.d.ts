/**
 * ComplianceUpdateEmail
 *
 * Triggered when a regulator publishes new guidelines — sent within 48 hours.
 * Positions SheriaBot as the authority that has already mapped the change.
 *
 * Subject suggestion:
 *   "{regulatorName} update: {updateTitle}"
 */
import * as React from 'react';
export interface ComplianceUpdateEmailProps {
    recipientFirstName?: string;
    updateTitle: string;
    regulatorName: string;
    publishedDate: string;
    summary: string;
    whoAffected: string;
    ctaUrl: string;
    unsubscribeUrl: string;
}
export default function ComplianceUpdateEmail({ recipientFirstName, updateTitle, regulatorName, publishedDate, summary, whoAffected, ctaUrl, unsubscribeUrl, }: ComplianceUpdateEmailProps): React.JSX.Element;
//# sourceMappingURL=ComplianceUpdateEmail.d.ts.map