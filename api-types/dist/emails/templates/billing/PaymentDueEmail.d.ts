import * as React from 'react';
export interface PaymentDueEmailProps {
    userName: string;
    amount: string;
    dueDate: string;
    planName: string;
    paymentUrl: string;
    daysUntilDue: number;
}
export declare function PaymentDueEmail({ userName, amount, dueDate, planName, paymentUrl, daysUntilDue, }: PaymentDueEmailProps): React.JSX.Element;
export declare function getPaymentDueSubject(planName: string): string;
//# sourceMappingURL=PaymentDueEmail.d.ts.map