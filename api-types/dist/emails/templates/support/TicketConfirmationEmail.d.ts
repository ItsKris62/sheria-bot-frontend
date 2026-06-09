import * as React from 'react';
export interface TicketConfirmationEmailProps {
    ticketNumber: string;
    subject: string;
    userName: string;
    category: string;
    priority: string;
}
export declare function TicketConfirmationEmail({ ticketNumber, subject, userName, category, priority, }: TicketConfirmationEmailProps): React.JSX.Element;
export declare const getTicketConfirmationSubject: (ticketNumber: string) => string;
//# sourceMappingURL=TicketConfirmationEmail.d.ts.map