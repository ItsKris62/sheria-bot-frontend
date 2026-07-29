export interface BlogEditorialMetric {
    postId: string;
    uniqueReaders: number;
    impressions: number;
    opens: number;
    engagedReaders: number;
    completedReaders: number;
    averageActiveReadSeconds: number;
    completionRate: number | null;
    helpfulCount: number;
    notHelpfulCount: number;
    newsletterConversions: number;
    productCtaConversions: number;
    sourceClicks: number;
    periodStart: Date;
    periodEnd: Date;
}
export type BlogEditorialMetricField = keyof BlogEditorialMetric;
export interface BlogEditorialMetricSource {
    field: BlogEditorialMetricField;
    source: 'posthog_event' | 'application_table' | 'scheduled_aggregation';
    eventName?: string;
    tableName?: string;
    notes: string;
}
export declare const BLOG_EDITORIAL_METRIC_SOURCES: BlogEditorialMetricSource[];
//# sourceMappingURL=editorial-metrics.d.ts.map