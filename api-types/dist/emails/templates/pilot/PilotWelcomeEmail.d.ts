import * as React from 'react';
export interface PilotWelcomeEmailProps {
    userName: string;
    organization: string;
    pilotExpiresAt: string;
    dashboardUrl: string;
    temporaryPassword?: string;
    temporaryPasswordExpiresAt?: string;
}
export declare function PilotWelcomeEmail({ userName, organization, pilotExpiresAt, dashboardUrl, temporaryPassword, temporaryPasswordExpiresAt, }: PilotWelcomeEmailProps): React.JSX.Element;
export declare const PilotWelcomeEmailSubject = "Your SheriaBot AI Pilot Access";
//# sourceMappingURL=PilotWelcomeEmail.d.ts.map