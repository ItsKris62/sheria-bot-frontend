import * as React from 'react';
export interface TrialEndingReminderEmailProps {
    userName: string;
    orgName: string;
    planName: string;
    trialEndsAt: string;
    daysRemaining: number;
    billingPortalUrl: string;
    dashboardUrl: string;
}
export declare function TrialEndingReminderEmail({ userName, orgName, planName, trialEndsAt, daysRemaining, billingPortalUrl, dashboardUrl, }: TrialEndingReminderEmailProps): React.JSX.Element;
export declare function getTrialEndingReminderSubject(planName: string, daysRemaining: number): string;
//# sourceMappingURL=TrialEndingReminderEmail.d.ts.map