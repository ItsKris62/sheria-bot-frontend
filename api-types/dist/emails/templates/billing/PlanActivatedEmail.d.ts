import * as React from 'react';
export interface PlanActivatedEmailProps {
    userName: string;
    orgName: string;
    planName: string;
    trialEndsAt?: string;
    billingPortalUrl: string;
    dashboardUrl: string;
    features: string[];
}
export declare function PlanActivatedEmail({ userName, orgName, planName, trialEndsAt, billingPortalUrl, dashboardUrl, features, }: PlanActivatedEmailProps): React.JSX.Element;
export declare function getPlanActivatedSubject(planName: string, isTrial: boolean): string;
//# sourceMappingURL=PlanActivatedEmail.d.ts.map