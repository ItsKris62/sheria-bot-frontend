import * as React from 'react';
export interface PlanDowngradedEmailProps {
    userName: string;
    orgName: string;
    previousPlanName: string;
    reactivateUrl: string;
    dashboardUrl: string;
}
export declare function PlanDowngradedEmail({ userName, orgName, previousPlanName, reactivateUrl, dashboardUrl, }: PlanDowngradedEmailProps): React.JSX.Element;
export declare function getPlanDowngradedSubject(previousPlanName: string): string;
//# sourceMappingURL=PlanDowngradedEmail.d.ts.map