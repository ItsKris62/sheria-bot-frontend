/**
 * Analytics Module Utilities
 */
import { z } from 'zod';
import type { DateRange } from './analytics.types';
export declare const dateRangeSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const trackEventSchema: z.ZodObject<{
    event: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    orgId: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const reportParamsSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    includeScoring: z.ZodDefault<z.ZodBoolean>;
    includeGaps: z.ZodDefault<z.ZodBoolean>;
    includeRisks: z.ZodDefault<z.ZodBoolean>;
    includeTimeline: z.ZodDefault<z.ZodBoolean>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const scheduleReportSchema: z.ZodObject<{
    orgId: z.ZodString;
    reportType: z.ZodEnum<{
        compliance: "compliance";
        audit: "audit";
        executive: "executive";
    }>;
    frequency: z.ZodEnum<{
        monthly: "monthly";
        daily: "daily";
        weekly: "weekly";
    }>;
    recipientUserIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const exportParamsSchema: z.ZodObject<{
    orgId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    reportType: z.ZodEnum<{
        usage: "usage";
        compliance: "compliance";
        audit: "audit";
        platform: "platform";
    }>;
    format: z.ZodEnum<{
        pdf: "pdf";
        csv: "csv";
        json: "json";
    }>;
}, z.core.$strip>;
/**
 * Build default date range (last N days)
 */
export declare function defaultDateRange(days?: number): DateRange;
/**
 * Parse date range from optional input, defaulting to last 30 days
 */
export declare function parseDateRange(from?: string | Date, to?: string | Date, defaultDays?: number): DateRange;
/**
 * Split a date range into daily buckets for trend charts
 */
export declare function splitIntoDailyBuckets(range: DateRange): Date[];
export declare function gradeFromScore(score: number): string;
export declare function calculatePercentChange(current: number, previous: number): number;
export declare function determineTrend(values: number[]): 'improving' | 'declining' | 'stable';
export declare function orgDashboardKey(orgId: string): string;
export declare function platformOverviewKey(): string;
export declare function systemHealthKey(): string;
export declare function reportJobKey(jobId: string): string;
export declare function reportResultKey(jobId: string): string;
export declare function toCSV(rows: Record<string, unknown>[]): string;
//# sourceMappingURL=analytics.utils.d.ts.map