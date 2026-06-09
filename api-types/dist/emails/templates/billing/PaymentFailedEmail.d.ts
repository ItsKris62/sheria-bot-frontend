import * as React from 'react';
export interface PaymentFailedEmailProps {
    userName: string;
    amount: string;
    planName: string;
    failureReason?: string;
    retryUrl: string;
    gracePeriodDays: number;
}
export declare function PaymentFailedEmail({ userName, amount, planName, failureReason, retryUrl, gracePeriodDays, }: PaymentFailedEmailProps): React.JSX.Element;
export declare const PaymentFailedEmailSubject = "Action Required \u2014 Payment Failed for SheriaBot";
//# sourceMappingURL=PaymentFailedEmail.d.ts.map