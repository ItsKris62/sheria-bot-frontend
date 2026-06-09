import * as React from 'react';
export interface EmailSignatureProps {
    /**
     * @deprecated For transactional templates only. Marketing/bulk sends MUST use
     * MarketingBaseLayout, which generates a token-signed unsubscribe URL. The
     * email-based unsubscribe URL produced when this is true is insecure (anyone
     * who knows the email can unsubscribe anyone) and is RFC 8058 non-compliant.
     * Setting this to true on a marketing-context email may result in DPA 2019
     * compliance failures.
     */
    showUnsubscribe?: boolean;
    recipientEmail?: string;
}
/**
 * Reusable email footer / signature block.
 *
 * Renders:
 *   - Horizontal divider
 *   - Brand tagline
 *   - Contact info (support email)
 *   - Optional unsubscribe link
 *   - Copyright notice
 *
 * Used by BaseLayout so all 16 templates inherit it automatically.
 * Can also be imported directly into one-off transactional emails.
 */
export declare function EmailSignature({ showUnsubscribe, recipientEmail }: EmailSignatureProps): React.JSX.Element;
//# sourceMappingURL=EmailSignature.d.ts.map