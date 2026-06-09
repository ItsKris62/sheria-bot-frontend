import * as React from 'react';
export interface MarketingBaseLayoutProps {
    preheaderText: string;
    children: React.ReactNode;
    /** Already-tokenized unsubscribe URL — caller responsibility. REQUIRED. */
    unsubscribeUrl: string;
    /** Displayed near the unsubscribe link for transparency. */
    recipientEmail?: string;
    /** Displayed in footer: "You received this as part of: {campaignName}" */
    campaignName?: string;
}
export declare function MarketingBaseLayout({ preheaderText, children, unsubscribeUrl, recipientEmail, campaignName, }: MarketingBaseLayoutProps): React.JSX.Element;
//# sourceMappingURL=MarketingBaseLayout.d.ts.map