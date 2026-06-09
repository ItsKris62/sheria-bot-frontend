/**
 * WebinarInviteEmail
 *
 * Webinar and event invitations.
 *
 * Subject suggestion:
 *   "You're invited: {eventTitle} — {eventDate}"
 */
import * as React from 'react';
export interface WebinarInviteEmailProps {
    recipientFirstName?: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    speakerNames: string[];
    agenda: string[];
    registrationUrl: string;
    unsubscribeUrl: string;
}
export default function WebinarInviteEmail({ recipientFirstName, eventTitle, eventDate, eventTime, eventLocation, speakerNames, agenda, registrationUrl, unsubscribeUrl, }: WebinarInviteEmailProps): React.JSX.Element;
//# sourceMappingURL=WebinarInviteEmail.d.ts.map