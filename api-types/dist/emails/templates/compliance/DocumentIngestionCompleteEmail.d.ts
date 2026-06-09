import * as React from 'react';
export interface DocumentIngestionCompleteEmailProps {
    userName: string;
    documentName: string;
    chunksProcessed: number;
    status: 'success' | 'partial' | 'failed';
    dashboardUrl: string;
    errorDetails?: string;
}
export declare function DocumentIngestionCompleteEmail({ userName, documentName, chunksProcessed, status, dashboardUrl, errorDetails, }: DocumentIngestionCompleteEmailProps): React.JSX.Element;
export declare const DocumentIngestionCompleteEmailSubject = "Regulatory Document Processing Complete";
//# sourceMappingURL=DocumentIngestionCompleteEmail.d.ts.map