import * as React from 'react';
export interface BaseLayoutProps {
    preheaderText: string;
    children: React.ReactNode;
    showUnsubscribe?: boolean;
    recipientEmail?: string;
}
export declare function BaseLayout({ preheaderText, children, showUnsubscribe, recipientEmail, }: BaseLayoutProps): React.JSX.Element;
//# sourceMappingURL=BaseLayout.d.ts.map