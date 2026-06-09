import * as React from 'react';
/**
 * MarketingEmailButton
 *
 * Sibling to EmailButton — do NOT modify EmailButton.
 * Used exclusively in marketing templates (Phase B2+).
 *
 * Variants:
 *   primary — filled green (#15803D), white text
 *   outline — transparent background, green border + text
 */
export interface MarketingEmailButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: 'primary' | 'outline';
}
export declare function MarketingEmailButton({ href, children, variant, }: MarketingEmailButtonProps): React.JSX.Element;
//# sourceMappingURL=MarketingEmailButton.d.ts.map