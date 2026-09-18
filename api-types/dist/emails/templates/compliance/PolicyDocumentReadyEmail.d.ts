import * as React from 'react';
export interface PolicyDocumentReadyEmailProps {
    userName: string;
    documentTitle: string;
    documentType: string;
    documentUrl: string;
    generatedAt: string;
    complianceScore?: number;
    criticalGapCount?: number;
    advisoryFlagCount?: number;
    compliantCount?: number;
    frameworks?: string[];
}
export declare function PolicyDocumentReadyEmail({ userName, documentTitle, documentType, documentUrl, generatedAt, complianceScore, criticalGapCount, advisoryFlagCount, compliantCount, frameworks, }: PolicyDocumentReadyEmailProps): React.JSX.Element;
export declare const PolicyDocumentReadyEmailSubject = "Your Policy Document Has Been Generated";
//# sourceMappingURL=PolicyDocumentReadyEmail.d.ts.map