import * as React from 'react';
export interface NewTicketAdminEmailProps {
    ticketNumber: string;
    subject: string;
    userName: string;
    userEmail: string;
    category: string;
    priority: string;
    description: string;
}
export declare function NewTicketAdminEmail({ ticketNumber, subject, userName, userEmail, category, priority, description, }: NewTicketAdminEmailProps): React.JSX.Element;
export declare const getNewTicketAdminSubject: (ticketNumber: string, subject: string) => string;
//# sourceMappingURL=NewTicketAdminEmail.d.ts.map