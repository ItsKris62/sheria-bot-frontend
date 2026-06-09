/**
 * ProductLaunchEmail
 *
 * Sent when a major new feature ships.
 * E.g., "Regulatory Alerts is now live."
 *
 * Subject suggestion:
 *   "{featureName} is now live in SheriaBot"
 */
import * as React from 'react';
export interface ProductLaunchEmailProps {
    recipientFirstName?: string;
    featureName: string;
    featureTagline: string;
    ctaUrl: string;
    ctaText: string;
    whatsNew: string[];
    unsubscribeUrl: string;
}
export default function ProductLaunchEmail({ recipientFirstName, featureName, featureTagline, ctaUrl, ctaText, whatsNew, unsubscribeUrl, }: ProductLaunchEmailProps): React.JSX.Element;
//# sourceMappingURL=ProductLaunchEmail.d.ts.map