type DauRange = 'last7d' | 'last30d' | 'last90d';
type QpuRange = 'last7d' | 'last30d' | 'alltime';
type FeedbackRange = 'last7d' | 'last30d' | 'last90d';
declare class AnalyticsAdminService {
    private getNairobiToday;
    private buildNairobiDateRange;
    getDailyActiveUsers(input: {
        range: DauRange;
    }): Promise<{
        today: number;
        series: Array<{
            date: string;
            dau: number;
        }>;
    }>;
    getQueriesPerUser(input: {
        userId: string;
        range: QpuRange;
    }): Promise<{
        total: number;
        last30d: number;
        last7d: number;
        byStatus: {
            completed: number;
            processing: number;
            failed: number;
        };
        lastQueryAt: string | null;
    }>;
    getFeedbackSummary(input: {
        range: FeedbackRange;
        page: number;
        pageSize: number;
    }): Promise<{
        aggregate: {
            totalVotes: number;
            upVotes: number;
            downVotes: number;
            upPct: number;
        };
        rows: Array<{
            queryId: string;
            userId: string;
            userEmail: string;
            orgName: string | null;
            rating: 'up' | 'down';
            createdAt: string;
        }>;
        pagination: {
            page: number;
            pageSize: number;
            totalRows: number;
            totalPages: number;
        };
    }>;
}
export declare const analyticsAdminService: AnalyticsAdminService;
export {};
//# sourceMappingURL=analytics.service.d.ts.map