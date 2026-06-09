import * as React from 'react';
export interface EnterpriseInquiryEmailProps {
    /** Name of the person submitting the inquiry */
    contactName: string;
    /** Email of the person submitting the inquiry */
    contactEmail: string;
    /** Organization name */
    orgName: string;
    /** Current subscription plan of the org */
    currentPlan: string;
    /** Optional message from the contact */
    message?: string;
    /** ISO timestamp of when the inquiry was submitted */
    submittedAt: string;
}
export declare function getEnterpriseInquirySubject(orgName: string): string;
export declare function EnterpriseInquiryEmail({ contactName, contactEmail, orgName, currentPlan, message, submittedAt, }: EnterpriseInquiryEmailProps): React.JSX.Element;
//# sourceMappingURL=EnterpriseInquiryEmail.d.ts.map