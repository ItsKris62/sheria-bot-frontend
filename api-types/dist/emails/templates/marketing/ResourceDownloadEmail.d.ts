/**
 * ResourceDownloadEmail
 *
 * Lead-magnet delivery. E.g., "Here's the Kenya Fintech Compliance Whitepaper
 * you requested."
 *
 * Subject suggestion:
 *   "Your download: {resourceTitle}"
 */
import * as React from 'react';
export interface ResourceDownloadEmailProps {
    recipientFirstName?: string;
    resourceTitle: string;
    resourceDescription: string;
    downloadUrl: string;
    pageCount?: number;
    fileFormat?: string;
    unsubscribeUrl: string;
}
export default function ResourceDownloadEmail({ recipientFirstName, resourceTitle, resourceDescription, downloadUrl, pageCount, fileFormat, unsubscribeUrl, }: ResourceDownloadEmailProps): React.JSX.Element;
//# sourceMappingURL=ResourceDownloadEmail.d.ts.map