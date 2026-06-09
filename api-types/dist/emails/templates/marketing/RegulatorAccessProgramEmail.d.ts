/**
 * RegulatorAccessProgramEmail
 *
 * Sent to staff at regulatory bodies (CBK, ODPC, CMA, CA) offering
 * free institutional access. Tone is institutional, not commercial.
 *
 * Subject suggestion:
 *   "Complimentary SheriaBot access for {regulatorName}"
 */
import * as React from 'react';
export interface RegulatorAccessProgramEmailProps {
    recipientFirstName?: string;
    regulatorName: string;
    signupUrl: string;
    unsubscribeUrl: string;
}
export default function RegulatorAccessProgramEmail({ recipientFirstName, regulatorName, signupUrl, unsubscribeUrl, }: RegulatorAccessProgramEmailProps): React.JSX.Element;
//# sourceMappingURL=RegulatorAccessProgramEmail.d.ts.map