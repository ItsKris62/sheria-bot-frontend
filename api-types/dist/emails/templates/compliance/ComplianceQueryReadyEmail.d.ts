import * as React from 'react';
export interface ComplianceQueryReadyEmailProps {
    userName: string;
    queryPreview: string;
    queryId: string;
    resultUrl: string;
    answeredAt: string;
}
export declare function ComplianceQueryReadyEmail({ userName, queryPreview, resultUrl, answeredAt, }: ComplianceQueryReadyEmailProps): React.JSX.Element;
export declare const ComplianceQueryReadyEmailSubject = "Your Compliance Query Results Are Ready";
//# sourceMappingURL=ComplianceQueryReadyEmail.d.ts.map