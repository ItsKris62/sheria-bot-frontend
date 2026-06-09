import * as React from 'react';
export interface WelcomeEmailProps {
    userName: string;
    role: string;
    organizationName?: string;
    dashboardUrl: string;
}
export declare function WelcomeEmail({ userName, role, organizationName, dashboardUrl, }: WelcomeEmailProps): React.JSX.Element;
export declare const WelcomeEmailSubject = "Welcome to SheriaBot \u2014 Your Compliance Journey Starts Here";
//# sourceMappingURL=WelcomeEmail.d.ts.map