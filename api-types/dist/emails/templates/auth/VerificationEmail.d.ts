import * as React from 'react';
export interface VerificationEmailProps {
    userName: string;
    verificationUrl: string;
    expiresInHours: number;
}
export declare function VerificationEmail({ userName, verificationUrl, expiresInHours, }: VerificationEmailProps): React.JSX.Element;
export declare const VerificationEmailSubject = "Verify your email to get started with SheriaBot";
//# sourceMappingURL=VerificationEmail.d.ts.map