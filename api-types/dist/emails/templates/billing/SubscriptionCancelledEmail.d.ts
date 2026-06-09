import * as React from 'react';
export interface SubscriptionCancelledEmailProps {
    userName: string;
    orgName: string;
    planName: string;
    gracePeriodEndsAt: string;
    reactivateUrl: string;
    dashboardUrl: string;
}
export declare function SubscriptionCancelledEmail({ userName, orgName, planName, gracePeriodEndsAt, reactivateUrl, dashboardUrl, }: SubscriptionCancelledEmailProps): React.JSX.Element;
export declare function getSubscriptionCancelledSubject(planName: string): string;
//# sourceMappingURL=SubscriptionCancelledEmail.d.ts.map