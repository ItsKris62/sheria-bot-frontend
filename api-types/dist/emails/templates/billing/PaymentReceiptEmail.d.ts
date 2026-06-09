import * as React from 'react';
export interface PaymentReceiptEmailProps {
    userName: string;
    invoiceNumber: string;
    amount: string;
    currency: string;
    paymentDate: string;
    paymentMethod: string;
    planName: string;
    billingPeriod: string;
    receiptUrl?: string;
    items: Array<{
        description: string;
        amount: string;
    }>;
}
export declare function PaymentReceiptEmail({ userName, invoiceNumber, amount, currency, paymentDate, paymentMethod, planName, billingPeriod, receiptUrl, items, }: PaymentReceiptEmailProps): React.JSX.Element;
export declare function getPaymentReceiptSubject(amount: string, invoiceNumber: string): string;
//# sourceMappingURL=PaymentReceiptEmail.d.ts.map