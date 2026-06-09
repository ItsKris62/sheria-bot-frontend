import { z } from 'zod';
export declare const EVENT_PRIORITIES: readonly ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export declare const EVENT_STATUSES: readonly ["UPCOMING", "IN_PROGRESS", "COMPLETED", "OVERDUE"];
export declare const EVENT_CATEGORIES: readonly ["CUSTOM", "FILING", "AUDIT", "RENEWAL", "REVIEW", "REGULATORY_DEADLINE", "DOCUMENT_EXPIRY", "COMPLIANCE_TASK"];
export declare const EVENT_RECURRENCES: readonly ["NONE", "MONTHLY", "QUARTERLY", "ANNUALLY"];
export type EventPriority = typeof EVENT_PRIORITIES[number];
export type EventStatus = typeof EVENT_STATUSES[number];
export type EventCategory = typeof EVENT_CATEGORIES[number];
export type EventRecurrence = typeof EVENT_RECURRENCES[number];
export declare const createComplianceEventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    category: z.ZodDefault<z.ZodEnum<{
        CUSTOM: "CUSTOM";
        FILING: "FILING";
        AUDIT: "AUDIT";
        RENEWAL: "RENEWAL";
        REVIEW: "REVIEW";
        REGULATORY_DEADLINE: "REGULATORY_DEADLINE";
        DOCUMENT_EXPIRY: "DOCUMENT_EXPIRY";
        COMPLIANCE_TASK: "COMPLIANCE_TASK";
    }>>;
    regulation: z.ZodOptional<z.ZodString>;
    recurrence: z.ZodDefault<z.ZodEnum<{
        NONE: "NONE";
        MONTHLY: "MONTHLY";
        QUARTERLY: "QUARTERLY";
        ANNUALLY: "ANNUALLY";
    }>>;
    assigneeId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateComplianceEventInput = z.infer<typeof createComplianceEventSchema>;
export declare const updateComplianceEventSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        OVERDUE: "OVERDUE";
        UPCOMING: "UPCOMING";
    }>>;
    category: z.ZodOptional<z.ZodEnum<{
        CUSTOM: "CUSTOM";
        FILING: "FILING";
        AUDIT: "AUDIT";
        RENEWAL: "RENEWAL";
        REVIEW: "REVIEW";
        REGULATORY_DEADLINE: "REGULATORY_DEADLINE";
        DOCUMENT_EXPIRY: "DOCUMENT_EXPIRY";
        COMPLIANCE_TASK: "COMPLIANCE_TASK";
    }>>;
    regulation: z.ZodOptional<z.ZodString>;
    recurrence: z.ZodOptional<z.ZodEnum<{
        NONE: "NONE";
        MONTHLY: "MONTHLY";
        QUARTERLY: "QUARTERLY";
        ANNUALLY: "ANNUALLY";
    }>>;
    assigneeId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateComplianceEventInput = z.infer<typeof updateComplianceEventSchema>;
export declare const listComplianceEventsSchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodNumber>;
    year: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        OVERDUE: "OVERDUE";
        UPCOMING: "UPCOMING";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
}, z.core.$strip>;
export type ListComplianceEventsInput = z.infer<typeof listComplianceEventsSchema>;
export declare const getComplianceEventSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const deleteComplianceEventSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const upcomingEventsSchema: z.ZodObject<{
    daysAhead: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
//# sourceMappingURL=calendar.schema.d.ts.map