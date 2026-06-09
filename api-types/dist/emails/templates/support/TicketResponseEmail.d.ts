import * as React from 'react';
export interface TicketResponseEmailProps {
    ticketNumber: string;
    subject: string;
    userName: string;
    responseMessage: string;
    responderName: string;
}
export declare function TicketResponseEmail({ ticketNumber, subject, userName, responseMessage, responderName, }: TicketResponseEmailProps): React.JSX.Element;
export declare const getTicketResponseSubject: (ticketNumber: string) => string;
//# sourceMappingURL=TicketResponseEmail.d.ts.map