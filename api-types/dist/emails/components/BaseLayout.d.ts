import * as React from 'react';
export interface BaseLayoutProps {
    preheaderText: string;
    children?: React.ReactNode;
    showUnsubscribe?: boolean;
    recipientEmail?: string;
    headerBadgeText?: string;
    unsubscribeUrl?: string;
}
/**
 * SheriaBot Master Email Layout Blueprint
 *
 * Provides:
 *   - Obsidian brand header with 3px Emerald top rule
 *   - Zero-width whitespace hack protecting mailbox preview snippets
 *   - Dark mode and mobile-responsive viewport meta tags
 *   - Seamless white card container with subtle Zinc border
 *   - Institutional footer with Kenya DPA 2019 data sovereignty disclaimers
 */
export declare function BaseLayout({ preheaderText, children, showUnsubscribe, recipientEmail, headerBadgeText, unsubscribeUrl, }: BaseLayoutProps): React.JSX.Element;
//# sourceMappingURL=BaseLayout.d.ts.map