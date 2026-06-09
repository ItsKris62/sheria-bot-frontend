import * as React from 'react';
export interface PasswordResetEmailProps {
    userName: string;
    resetUrl: string;
    expiresInMinutes: number;
    ipAddress?: string;
}
export declare function PasswordResetEmail({ userName, resetUrl, expiresInMinutes, ipAddress, }: PasswordResetEmailProps): React.JSX.Element;
export declare const PasswordResetEmailSubject = "Reset your SheriaBot password";
//# sourceMappingURL=PasswordResetEmail.d.ts.map