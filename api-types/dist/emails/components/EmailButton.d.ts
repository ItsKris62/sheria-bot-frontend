import * as React from 'react';
export interface EmailButtonProps {
    href: string;
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'gold' | 'navy';
    align?: 'left' | 'center' | 'right';
    style?: React.CSSProperties;
}
/**
 * Bulletproof MSO/VML + HTML Email CTA Button
 * Ensures pixel-perfect rendering across Outlook (MS Word engine), Apple Mail, and Gmail.
 */
export declare function EmailButton({ href, children, variant, align, style, }: EmailButtonProps): React.JSX.Element;
//# sourceMappingURL=EmailButton.d.ts.map