import * as React from 'react';
export interface RoleChangeEmailProps {
    userName: string;
    oldRole: string;
    newRole: string;
    changedBy: string;
    dashboardUrl: string;
}
export declare function RoleChangeEmail({ userName, oldRole, newRole, changedBy, dashboardUrl, }: RoleChangeEmailProps): React.JSX.Element;
export declare const RoleChangeEmailSubject = "Your SheriaBot Role Has Been Updated";
//# sourceMappingURL=RoleChangeEmail.d.ts.map