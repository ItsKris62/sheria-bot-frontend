import * as React from 'react';
export interface FreeTrialExpiringEmailProps {
    userName: string;
    daysRemaining: number;
    usage: {
        complianceQueries: number;
        gapAnalyses: number;
        checklists: number;
        vaultUploads: number;
    };
    upgradeUrl: string;
}
export declare function FreeTrialExpiringEmail({ userName, daysRemaining, usage, upgradeUrl, }: FreeTrialExpiringEmailProps): React.JSX.Element;
export declare function getFreeTrialExpiringSubject(daysRemaining: number): string;
//# sourceMappingURL=FreeTrialExpiringEmail.d.ts.map