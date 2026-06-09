import { z } from 'zod';
export declare const applicationStatusSchema: z.ZodEnum<{
    DRAFT: "DRAFT";
    IN_PROGRESS: "IN_PROGRESS";
    SUBMITTED: "SUBMITTED";
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
    AWAITING_FEEDBACK: "AWAITING_FEEDBACK";
    WITHDRAWN: "WITHDRAWN";
}>;
export declare const documentStatusSchema: z.ZodEnum<{
    APPROVED: "APPROVED";
    UPLOADED: "UPLOADED";
    REJECTED: "REJECTED";
    REQUIRED: "REQUIRED";
}>;
export declare const feeStatusSchema: z.ZodEnum<{
    PENDING: "PENDING";
    WAIVED: "WAIVED";
    PAID: "PAID";
}>;
export declare const listApplicationsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_PROGRESS: "IN_PROGRESS";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        AWAITING_FEEDBACK: "AWAITING_FEEDBACK";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const getApplicationSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const createApplicationSchema: z.ZodObject<{
    title: z.ZodString;
    regulator: z.ZodString;
    licenseType: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_PROGRESS: "IN_PROGRESS";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        AWAITING_FEEDBACK: "AWAITING_FEEDBACK";
        WITHDRAWN: "WITHDRAWN";
    }>>;
    progress: z.ZodDefault<z.ZodNumber>;
    referenceNumber: z.ZodOptional<z.ZodString>;
    nextAction: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export declare const updateApplicationSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    regulator: z.ZodOptional<z.ZodString>;
    licenseType: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        DRAFT: "DRAFT";
        IN_PROGRESS: "IN_PROGRESS";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        AWAITING_FEEDBACK: "AWAITING_FEEDBACK";
        WITHDRAWN: "WITHDRAWN";
    }>>>;
    progress: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    referenceNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    nextAction: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    id: z.ZodString;
    submittedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    decidedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
}, z.core.$strip>;
export declare const addTimelineEventSchema: z.ZodObject<{
    applicationId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    eventDate: z.ZodOptional<z.ZodDate>;
    completed: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const addApplicationDocumentSchema: z.ZodObject<{
    applicationId: z.ZodString;
    name: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        APPROVED: "APPROVED";
        UPLOADED: "UPLOADED";
        REJECTED: "REJECTED";
        REQUIRED: "REQUIRED";
    }>>;
    vaultDocumentId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    uploadedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
}, z.core.$strip>;
export declare const addApplicationFeeSchema: z.ZodObject<{
    applicationId: z.ZodString;
    description: z.ZodString;
    amount: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<{
        PENDING: "PENDING";
        WAIVED: "WAIVED";
        PAID: "PAID";
    }>>;
    paidAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
}, z.core.$strip>;
export declare const addRegulatorFeedbackSchema: z.ZodObject<{
    applicationId: z.ZodString;
    fromName: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    actionRequired: z.ZodDefault<z.ZodBoolean>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    receivedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
//# sourceMappingURL=application.schema.d.ts.map