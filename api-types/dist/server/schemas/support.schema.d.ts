import { z } from 'zod';
export declare const createTicketSchema: z.ZodObject<{
    subject: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<{
        BILLING: "BILLING";
        TECHNICAL: "TECHNICAL";
        COMPLIANCE_QUERY: "COMPLIANCE_QUERY";
        ACCOUNT: "ACCOUNT";
        FEATURE_REQUEST: "FEATURE_REQUEST";
        OTHER: "OTHER";
    }>;
    priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>>;
}, z.core.$strip>;
export declare const listTicketsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        AWAITING_USER: "AWAITING_USER";
        RESOLVED: "RESOLVED";
        CLOSED: "CLOSED";
    }>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const getTicketByNumberSchema: z.ZodObject<{
    ticketNumber: z.ZodString;
}, z.core.$strip>;
export declare const addCommentSchema: z.ZodObject<{
    ticketId: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export declare const adminListTicketsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        AWAITING_USER: "AWAITING_USER";
        RESOLVED: "RESOLVED";
        CLOSED: "CLOSED";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    category: z.ZodOptional<z.ZodEnum<{
        BILLING: "BILLING";
        TECHNICAL: "TECHNICAL";
        COMPLIANCE_QUERY: "COMPLIANCE_QUERY";
        ACCOUNT: "ACCOUNT";
        FEATURE_REQUEST: "FEATURE_REQUEST";
        OTHER: "OTHER";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const adminUpdateStatusSchema: z.ZodObject<{
    ticketId: z.ZodString;
    status: z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        AWAITING_USER: "AWAITING_USER";
        RESOLVED: "RESOLVED";
        CLOSED: "CLOSED";
    }>;
}, z.core.$strip>;
export declare const adminAddResponseSchema: z.ZodObject<{
    ticketId: z.ZodString;
    message: z.ZodString;
    updateStatusTo: z.ZodOptional<z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        AWAITING_USER: "AWAITING_USER";
        RESOLVED: "RESOLVED";
        CLOSED: "CLOSED";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=support.schema.d.ts.map