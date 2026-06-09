import { z } from 'zod';
export declare const dateRangeSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    days: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const getOrgDashboardSchema: z.ZodObject<{
    orgId: z.ZodOptional<z.ZodString>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        days: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const getComplianceTrendsSchema: z.ZodObject<{
    orgId: z.ZodOptional<z.ZodString>;
    periods: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const generateReportSchema: z.ZodObject<{
    orgId: z.ZodOptional<z.ZodString>;
    reportType: z.ZodDefault<z.ZodEnum<{
        compliance: "compliance";
        audit: "audit";
        executive: "executive";
    }>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        days: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    includeDetails: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const exportAnalyticsSchema: z.ZodObject<{
    format: z.ZodDefault<z.ZodEnum<{
        csv: "csv";
        json: "json";
    }>>;
    type: z.ZodDefault<z.ZodEnum<{
        policies: "policies";
        users: "users";
        documents: "documents";
        audit: "audit";
        queries: "queries";
    }>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        days: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    orgId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const getUserGrowthSchema: z.ZodObject<{
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        days: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=analytics.schema.d.ts.map