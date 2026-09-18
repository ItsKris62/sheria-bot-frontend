import * as React from 'react';
export interface EmailSignatureProps {
    /**
     * @deprecated For transactional templates only. Marketing/bulk sends MUST use
     * MarketingBaseLayout, which generates a token-signed unsubscribe URL.
     */
    showUnsubscribe?: boolean;
    recipientEmail?: string;
    unsubscribeUrl?: string;
}
/**
 * Modernized Institutional Email Signature & Footer Block
 *
 * Lightweight, email-safe HTML lockup replacing raster images with:
 *   - Institutional RegTech wordmark & credentials
 *   - Support, notification preferences, & website links
 *   - Kenya DPA 2019 data sovereignty certification notice
 *   - Mandatory statutory non-counsel legal disclaimer
 *   - Registered business address in Nairobi, Kenya
 */
export declare function EmailSignature({ showUnsubscribe, recipientEmail, unsubscribeUrl, }: EmailSignatureProps): React.JSX.Element;
//# sourceMappingURL=EmailSignature.d.ts.map