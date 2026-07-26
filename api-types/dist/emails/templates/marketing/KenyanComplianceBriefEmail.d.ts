/**
 * KenyanComplianceBriefEmail
 *
 * "The Kenyan Compliance Brief" - the recurring multi-item regulatory digest.
 * Unlike ComplianceUpdateEmail (one regulator update per send), this template
 * renders a list of named item slots (title/summary/optional source link) so
 * a single weekly send can cover several regulatory items at once.
 *
 * Subject suggestion:
 *   "The Kenyan Compliance Brief - {editionLabel}"
 */
import * as React from 'react';
export interface ComplianceBriefItem {
    title: string;
    summary: string;
    sourceUrl?: string;
}
export interface KenyanComplianceBriefEmailProps {
    recipientFirstName?: string;
    editionLabel: string;
    intro?: string;
    items: ComplianceBriefItem[];
    unsubscribeUrl: string;
}
export default function KenyanComplianceBriefEmail({ recipientFirstName, editionLabel, intro, items, unsubscribeUrl, }: KenyanComplianceBriefEmailProps): React.JSX.Element;
//# sourceMappingURL=KenyanComplianceBriefEmail.d.ts.map