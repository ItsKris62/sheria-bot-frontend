/**
 * PilotInvitationEmail
 *
 * Sent to curated contacts (fintech founders, compliance officers, etc.)
 * inviting them to apply for the SheriaBot pilot programme.
 *
 * Subject suggestion:
 *   "Invitation to the SheriaBot Pilot — early access for {recipientCompanyName}"
 */
import * as React from 'react';
export interface PilotInvitationEmailProps {
    recipientFirstName?: string;
    recipientCompanyName?: string;
    applicationUrl: string;
    unsubscribeUrl: string;
    expiresInDays: number;
    inviterName?: string;
}
export default function PilotInvitationEmail({ recipientFirstName, recipientCompanyName, applicationUrl, unsubscribeUrl, expiresInDays, inviterName, }: PilotInvitationEmailProps): React.JSX.Element;
//# sourceMappingURL=PilotInvitationEmail.d.ts.map