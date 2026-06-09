/**
 * GenericMarketingEmail
 *
 * Admin-fillable template for ad-hoc sends that don't fit the other 6 templates.
 * All copy is supplied via variables — no rich text, no HTML in body paragraphs.
 *
 * SECURITY: bodyParagraphs are plain text only. HTML characters are escaped
 * as defense-in-depth (React's JSX already escapes by default, but we apply
 * an explicit escaper to make the intent clear and guard against future
 * refactors that might use dangerouslySetInnerHTML).
 *
 * Subject suggestion: set by the admin when creating the campaign.
 */
import * as React from 'react';
export interface GenericMarketingEmailProps {
    recipientFirstName?: string;
    headline: string;
    bodyParagraphs: string[];
    ctaUrl?: string;
    ctaText?: string;
    unsubscribeUrl: string;
}
export default function GenericMarketingEmail({ recipientFirstName, headline, bodyParagraphs, ctaUrl, ctaText, unsubscribeUrl, }: GenericMarketingEmailProps): React.JSX.Element;
//# sourceMappingURL=GenericMarketingEmail.d.ts.map