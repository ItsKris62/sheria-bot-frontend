"use client";

import { trpc } from "@/lib/trpc";

type DateRange = { from?: string; to?: string; days?: number };

/** Organization-level analytics dashboard */
export function useOrgDashboard(orgId?: string, dateRange?: DateRange) {
  return trpc.analytics.getOrgDashboard.useQuery({ orgId, dateRange });
}

/** Organization compliance score */
export function useOrgComplianceScore() {
  return trpc.analytics.getOrgComplianceScore.useQuery();
}

/** Compliance trend data over recent periods */
export function useComplianceTrends(options?: {
  orgId?: string;
  periods?: number;
}) {
  return trpc.analytics.getComplianceTrends.useQuery({
    orgId: options?.orgId,
    periods: options?.periods ?? 6,
  });
}

/** Gap analysis for the current user's organization */
export function useGapAnalysis() {
  return trpc.analytics.getGapAnalysis.useQuery();
}

/** Upcoming deadline alerts */
export function useDeadlineAlerts() {
  return trpc.analytics.getDeadlineAlerts.useQuery();
}

/** Document usage statistics */
export function useDocumentStats() {
  return trpc.analytics.getDocumentStats.useQuery();
}

/** Platform-wide overview — admin only */
export function usePlatformOverview(dateRange?: DateRange) {
  return trpc.analytics.getPlatformOverview.useQuery({ dateRange });
}

/** User growth metrics — admin only */
export function useUserGrowth(dateRange?: DateRange) {
  return trpc.analytics.getUserGrowth.useQuery({ dateRange });
}

/** Organization growth metrics — admin only */
export function useOrgGrowth(dateRange?: DateRange) {
  return trpc.analytics.getOrgGrowth.useQuery({ dateRange });
}

/** Generate a compliance report */
export function useGenerateReport() {
  const utils = trpc.useUtils();

  return trpc.analytics.generateReport.useMutation({
    onSuccess: () => {
      utils.analytics.getOrgDashboard.invalidate();
    },
  });
}

/** Export analytics data as CSV or JSON */
export function useExportAnalytics() {
  return trpc.analytics.exportData.useMutation();
}
