import * as React from 'react';
export interface PilotExpiredEmailProps {
    userName: string;
    organization: string;
    dashboardUrl: string;
    surveyUrl?: string;
}
export declare function PilotExpiredEmail({ userName, organization, dashboardUrl, surveyUrl, }: PilotExpiredEmailProps): React.JSX.Element;
export declare const PilotExpiredEmailSubject = "Your SheriaBot pilot has ended \u2014 thank you";
//# sourceMappingURL=PilotExpiredEmail.d.ts.map