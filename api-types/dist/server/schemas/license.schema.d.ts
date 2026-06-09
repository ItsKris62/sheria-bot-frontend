import { z } from 'zod';
export declare const LICENSE_STATUSES: readonly ["DRAFT", "ACTIVE", "PENDING_RENEWAL", "SUBMITTED", "APPROVED", "EXPIRED", "SUSPENDED", "REVOKED", "ARCHIVED"];
export declare const LICENSE_TIMELINE_STATUSES: readonly ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"];
export declare const LICENSE_FEE_STATUSES: readonly ["PENDING", "PAID", "WAIVED", "OVERDUE"];
export declare const listLicensesSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        SUSPENDED: "SUSPENDED";
        ACTIVE: "ACTIVE";
        EXPIRED: "EXPIRED";
        REVOKED: "REVOKED";
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PENDING_RENEWAL: "PENDING_RENEWAL";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    includeArchived: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const getLicenseSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const createLicenseSchema: z.ZodObject<{
    licenseType: z.ZodString;
    regulator: z.ZodString;
    licenseNumber: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        SUSPENDED: "SUSPENDED";
        ACTIVE: "ACTIVE";
        EXPIRED: "EXPIRED";
        REVOKED: "REVOKED";
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PENDING_RENEWAL: "PENDING_RENEWAL";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
    }>>>;
    issueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    expiryDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    renewalDueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    submittedAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    approvedAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    assignedOwnerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateLicenseSchema: z.ZodObject<{
    licenseType: z.ZodOptional<z.ZodString>;
    regulator: z.ZodOptional<z.ZodString>;
    licenseNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        SUSPENDED: "SUSPENDED";
        ACTIVE: "ACTIVE";
        EXPIRED: "EXPIRED";
        REVOKED: "REVOKED";
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PENDING_RENEWAL: "PENDING_RENEWAL";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
    }>>>>;
    issueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    expiryDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    renewalDueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    submittedAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    approvedAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    assignedOwnerId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    id: z.ZodString;
}, z.core.$strip>;
export declare const archiveLicenseSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const addTimelineEventSchema: z.ZodObject<{
    licenseId: z.ZodString;
    eventType: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        PENDING: "PENDING";
        BLOCKED: "BLOCKED";
    }>>>;
    assignedToUserId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    evidenceDocumentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    createCalendarEvent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const updateTimelineEventSchema: z.ZodObject<{
    licenseId: z.ZodOptional<z.ZodString>;
    eventType: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        PENDING: "PENDING";
        BLOCKED: "BLOCKED";
    }>>>>;
    assignedToUserId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    evidenceDocumentId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    createCalendarEvent: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    id: z.ZodString;
}, z.core.$strip>;
export declare const completeTimelineEventSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const addDocumentSchema: z.ZodObject<{
    licenseId: z.ZodString;
    vaultDocumentId: z.ZodString;
    documentType: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const removeDocumentSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const addFeeSchema: z.ZodObject<{
    licenseId: z.ZodString;
    amount: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    currency: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    paidAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        OVERDUE: "OVERDUE";
        WAIVED: "WAIVED";
        PAID: "PAID";
    }>>>;
}, z.core.$strip>;
export declare const updateFeeSchema: z.ZodObject<{
    licenseId: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    paidAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        OVERDUE: "OVERDUE";
        WAIVED: "WAIVED";
        PAID: "PAID";
    }>>>>;
    id: z.ZodString;
}, z.core.$strip>;
export declare const upcomingLicensesSchema: z.ZodObject<{
    daysAhead: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const adminListLicensesSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        SUSPENDED: "SUSPENDED";
        ACTIVE: "ACTIVE";
        EXPIRED: "EXPIRED";
        REVOKED: "REVOKED";
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PENDING_RENEWAL: "PENDING_RENEWAL";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    includeArchived: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    organizationId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const adminGetLicenseSchema: z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const adminOverrideUpdateLicenseSchema: z.ZodObject<{
    licenseType: z.ZodOptional<z.ZodString>;
    regulator: z.ZodOptional<z.ZodString>;
    licenseNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        SUSPENDED: "SUSPENDED";
        ACTIVE: "ACTIVE";
        EXPIRED: "EXPIRED";
        REVOKED: "REVOKED";
        DRAFT: "DRAFT";
        ARCHIVED: "ARCHIVED";
        PENDING_RENEWAL: "PENDING_RENEWAL";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
    }>>>>;
    issueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    expiryDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    renewalDueDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    submittedAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    approvedAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    assignedOwnerId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    id: z.ZodString;
    reason: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=license.schema.d.ts.map