import * as React from 'react';
export interface InvitationEmailProps {
    inviterName: string;
    organizationName?: string;
    role: string;
    inviteUrl: string;
    expiresInDays: number;
}
export declare function InvitationEmail({ inviterName, organizationName, role, inviteUrl, expiresInDays, }: InvitationEmailProps): React.JSX.Element;
export declare const InvitationEmailSubject = "You've been invited to join SheriaBot";
//# sourceMappingURL=InvitationEmail.d.ts.map