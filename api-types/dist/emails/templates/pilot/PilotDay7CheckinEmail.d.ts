import * as React from 'react';
export interface PilotDay7CheckinEmailProps {
    userName: string;
    daysRemaining: number;
    dashboardUrl: string;
    surveyUrl?: string;
}
export declare function PilotDay7CheckinEmail({ userName, daysRemaining, dashboardUrl, surveyUrl, }: PilotDay7CheckinEmailProps): React.JSX.Element;
export declare function getPilotDay7CheckinSubject(daysRemaining: number): string;
//# sourceMappingURL=PilotDay7CheckinEmail.d.ts.map