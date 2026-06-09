import * as React from 'react';
export interface FreeTrialExpiredEmailProps {
    userName: string;
    usage: {
        complianceQueries: number;
        gapAnalyses: number;
        checklists: number;
        vaultUploads: number;
    };
    upgradeUrl: string;
}
export declare function FreeTrialExpiredEmail({ userName, usage, upgradeUrl, }: FreeTrialExpiredEmailProps): React.JSX.Element;
export declare const FreeTrialExpiredEmailSubject = "Your SheriaBot free trial has ended";
//# sourceMappingURL=FreeTrialExpiredEmail.d.ts.map