/**
 * Analytics Module
 * Tracks platform usage, generates compliance reports, and powers dashboards.
 *
 * Integrations:
 * - Prisma  -  aggregation queries (policies, queries, documents, audit logs)
 * - Redis   -  dashboard caching + report job store
 */
import { type DateRange, type TrackEventParams, type PageViewParams, type QueryMetadata, type PolicyMetadata, type UserActivitySummary, type UserEngagementMetrics, type ComplianceHistory, type OrgDashboard, type ComplianceScoreReport, type DocumentStats, type MemberActivityReport, type ComplianceTrend, type ComplianceOverview, type RequirementStats, type RiskSummary, type DeadlineAlert, type GapAnalysis, type DocumentUsageStats, type DocumentAccessStats, type SearchAnalytics, type PlatformOverview, type GrowthMetrics, type SystemHealthMetrics, type APIUsageMetrics, type RevenueMetrics, type ReportParams, type GeneratedReport, type AuditReport, type ExecutiveSummary, type ScheduleReportParams, type ScheduledReport, type ExportParams, type ExportResult, type DocumentAction } from './analytics.types';
declare class AnalyticsModule {
    trackEvent(params: TrackEventParams): Promise<void>;
    trackPageView(params: PageViewParams): Promise<void>;
    trackDocumentAccess(documentId: string, userId: string, action: DocumentAction): Promise<void>;
    trackComplianceQuery(queryId: string, userId: string, metadata: QueryMetadata): Promise<void>;
    trackPolicyGeneration(policyId: string, orgId: string, metadata: PolicyMetadata): Promise<void>;
    getUserActivitySummary(userId: string, dateRange?: DateRange): Promise<UserActivitySummary>;
    getUserEngagementMetrics(userId: string): Promise<UserEngagementMetrics>;
    getUserComplianceHistory(userId: string, dateRange?: DateRange): Promise<ComplianceHistory>;
    getOrganizationDashboard(orgId: string, dateRange?: DateRange): Promise<OrgDashboard>;
    getOrganizationComplianceScore(orgId: string): Promise<ComplianceScoreReport>;
    getOrganizationDocumentStats(orgId: string): Promise<DocumentStats>;
    getOrganizationMemberActivity(orgId: string, dateRange?: DateRange): Promise<MemberActivityReport>;
    getComplianceTrends(orgId: string, months?: number): Promise<ComplianceTrend[]>;
    getComplianceOverview(orgId: string): Promise<ComplianceOverview>;
    getRequirementCompletionRates(orgId: string): Promise<RequirementStats>;
    getRiskAssessmentSummary(orgId: string): Promise<RiskSummary>;
    getDeadlineAlerts(orgId: string): Promise<DeadlineAlert[]>;
    getComplianceGapAnalysis(orgId: string): Promise<GapAnalysis>;
    getDocumentUsageStats(orgId: string, dateRange?: DateRange): Promise<DocumentUsageStats>;
    getMostAccessedDocuments(orgId: string, limit?: number): Promise<DocumentAccessStats[]>;
    getSearchAnalytics(orgId: string, dateRange?: DateRange): Promise<SearchAnalytics>;
    getPlatformOverview(dateRange?: DateRange): Promise<PlatformOverview>;
    getUserGrowthMetrics(dateRange?: DateRange): Promise<GrowthMetrics>;
    getOrganizationGrowthMetrics(dateRange?: DateRange): Promise<GrowthMetrics>;
    getSystemHealthMetrics(): Promise<SystemHealthMetrics>;
    getAPIUsageMetrics(_dateRange?: DateRange): Promise<APIUsageMetrics>;
    getRevenueMetrics(_dateRange?: DateRange): Promise<RevenueMetrics>;
    /**
     * Generate a compliance report asynchronously. Returns a job ID immediately.
     */
    generateComplianceReport(orgId: string, params: ReportParams): Promise<GeneratedReport>;
    private buildComplianceReport;
    generateAuditReport(orgId: string, dateRange?: DateRange): Promise<AuditReport>;
    generateExecutiveSummary(orgId: string): Promise<ExecutiveSummary>;
    scheduleReport(params: ScheduleReportParams): Promise<ScheduledReport>;
    exportAnalytics(params: ExportParams): Promise<ExportResult>;
    private upsertDailyMetric;
    private nextRunDate;
}
export declare const analyticsModule: AnalyticsModule;
export { AnalyticsModule };
//# sourceMappingURL=analytics.module.d.ts.map