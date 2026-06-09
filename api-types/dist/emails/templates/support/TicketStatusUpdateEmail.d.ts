import * as React from 'react';
export interface TicketStatusUpdateEmailProps {
    ticketNumber: string;
    subject: string;
    userName: string;
    oldStatus: string;
    newStatus: string;
}
export declare function TicketStatusUpdateEmail({ ticketNumber, subject, userName, oldStatus, newStatus, }: TicketStatusUpdateEmailProps): React.JSX.Element;
export declare const getTicketStatusUpdateSubject: (ticketNumber: string, newStatus: string) => string;
//# sourceMappingURL=TicketStatusUpdateEmail.d.ts.map