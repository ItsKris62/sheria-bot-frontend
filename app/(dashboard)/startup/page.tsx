"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuthenticatedQueryEnabled, useAuthStore } from "@/lib/auth-store"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import { trackFeatureUsage } from "@/lib/analytics"
import {
  UserDashboardHeader,
  ComplianceOverview,
  PriorityAttention,
  RegulatoryAlertsCard,
  UpcomingDeadlinesCard,
  DashboardQuickActions,
  RecentComplianceQueries,
  DashboardMetricCard,
} from "@/components/dashboard"
import type { AlertItem, DeadlineItem, QueryItem } from "@/components/dashboard"
import { ShieldCheck, CheckCircle2, Calendar, Bell } from "lucide-react"

export default function StartupDashboard() {
  const user = useAuthStore((state) => state.user)
  const authQueryEnabled = useAuthenticatedQueryEnabled()
  const displayName = user?.name?.split(" ")[0] ?? "there"

  useEffect(() => {
    trackFeatureUsage({
      feature_name: "compliance_dashboard",
      status: "viewed",
    })
  }, [])

  // Derive calendar feature entitlement from plan context
  const { hasFeature } = usePlan()
  const calendarEnabled = hasFeature("complianceCalendar")

  // Query 1: Compliance score & category progress
  const {
    data: rawDashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = trpc.complianceDashboard.getComplianceDashboard.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: authQueryEnabled,
  })

  // Query 2: Upcoming deadlines
  const {
    data: rawDeadlines = [],
    isLoading: isDeadlinesLoading,
    isError: isDeadlinesError,
    dataUpdatedAt: deadlinesUpdatedAt,
  } = trpc.calendar.upcoming.useQuery(
    { daysAhead: 30 },
    { staleTime: 5 * 60 * 1000, enabled: calendarEnabled }
  )

  // Query 3: Regulatory alerts
  const {
    data: rawAlertsData,
    isLoading: isAlertsLoading,
    isError: isAlertsError,
  } = trpc.alert.getAlerts.useQuery(
    { page: 1, limit: 3 },
    { staleTime: 60 * 1000, enabled: authQueryEnabled }
  )

  // Query 4: Recent query history
  const {
    data: rawHistoryData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = trpc.compliance.history.useQuery(
    { page: 1, limit: 3 },
    { staleTime: 60 * 1000, enabled: authQueryEnabled }
  )

  const [fallbackReferenceTime] = useState(() => Date.now())
  const referenceTime = deadlinesUpdatedAt ?? fallbackReferenceTime

  // Format safely typed arrays from raw tRPC responses
  const regulatoryAlerts: AlertItem[] = useMemo(() => {
    return Array.isArray(rawAlertsData?.alerts)
      ? (rawAlertsData.alerts as unknown as AlertItem[])
      : []
  }, [rawAlertsData])

  const upcomingDeadlines: DeadlineItem[] = useMemo(() => {
    return Array.isArray(rawDeadlines)
      ? (rawDeadlines as unknown as DeadlineItem[])
      : []
  }, [rawDeadlines])

  const recentQueries: QueryItem[] = useMemo(() => {
    return Array.isArray(rawHistoryData?.queries)
      ? (rawHistoryData.queries as unknown as QueryItem[])
      : []
  }, [rawHistoryData])

  const dashboardData = useMemo(() => {
    return rawDashboardData
      ? {
          overallScore: rawDashboardData.overallScore,
          categories: rawDashboardData.categories,
          trend: (rawDashboardData as { trend?: unknown }).trend as any ?? null,
          lastUpdated: rawDashboardData.lastUpdated,
        }
      : null
  }, [rawDashboardData])

  // KPI calculations derived directly from real API responses
  const kpiData = useMemo(() => {
    const completedRequirements =
      dashboardData?.categories.reduce((acc, cat) => acc + (cat.completedItems || 0), 0) ?? 0
    const totalRequirements =
      dashboardData?.categories.reduce((acc, cat) => acc + (cat.totalItems || 0), 0) ?? 0

    const urgentDeadlinesCount = upcomingDeadlines.filter((item) => {
      const days = Math.ceil((new Date(item.dueDate).getTime() - referenceTime) / (1000 * 60 * 60 * 24))
      return days <= 3
    }).length

    const totalAlerts =
      typeof rawAlertsData?.total === "number" ? rawAlertsData.total : null
    const unreadAlertsCount = regulatoryAlerts.filter((a) => !a.isRead).length

    return {
      completedRequirements,
      totalRequirements,
      urgentDeadlinesCount,
      totalAlerts,
      unreadAlertsCount,
    }
  }, [dashboardData, upcomingDeadlines, rawAlertsData, regulatoryAlerts, referenceTime])

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12">
      {/* ROW 1: Page Context & Welcome Header */}
      <UserDashboardHeader displayName={displayName} />

      {/* ROW 2: Top KPI Metric Row */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Overall Compliance Score */}
        <DashboardMetricCard
          title="Compliance Score"
          value={dashboardData ? `${Math.round(dashboardData.overallScore)}%` : "—"}
          subtitle={
            dashboardData?.trend && dashboardData.trend.points !== null
              ? dashboardData.trend.points > 0
                ? `+${dashboardData.trend.points} pts vs 30+ days ago`
                : dashboardData.trend.points < 0
                ? `${dashboardData.trend.points} pts vs 30+ days ago`
                : "No change vs 30+ days ago"
              : "Weighted across 5 areas"
          }
          icon={ShieldCheck}
          variant="emphasized"
          isLoading={isDashboardLoading}
        />

        {/* KPI 2: Completed Requirements */}
        <DashboardMetricCard
          title="Requirements Met"
          value={dashboardData ? `${kpiData.completedRequirements} / ${kpiData.totalRequirements}` : "—"}
          subtitle={
            kpiData.totalRequirements > 0
              ? `${Math.round((kpiData.completedRequirements / kpiData.totalRequirements) * 100)}% requirements complete`
              : "Active compliance baseline"
          }
          icon={CheckCircle2}
          isLoading={isDashboardLoading}
        />

        {/* KPI 3: Upcoming Deadlines (30 Days) */}
        <DashboardMetricCard
          title="Upcoming Deadlines"
          value={upcomingDeadlines.length}
          subtitle={
            kpiData.urgentDeadlinesCount > 0
              ? `${kpiData.urgentDeadlinesCount} urgent (≤3 days)`
              : "Next 30 days window"
          }
          icon={Calendar}
          href="/startup/calendar"
          isLoading={isDeadlinesLoading}
        />

        {/* KPI 4: Active Regulatory Alerts */}
        <DashboardMetricCard
          title="Regulatory Alerts"
          value={kpiData.totalAlerts !== null ? kpiData.totalAlerts : "—"}
          subtitle={
            kpiData.unreadAlertsCount > 0
              ? `${kpiData.unreadAlertsCount} unread regulatory update${kpiData.unreadAlertsCount === 1 ? "" : "s"}`
              : "Active plan window"
          }
          icon={Bell}
          href="/dashboard/alerts"
          isLoading={isAlertsLoading}
        />
      </section>

      {/* ROW 3: Primary Analytical Anchor (Posture) & Priority Attention */}
      <section aria-label="Compliance Health & Attention" className="grid gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2">
          <ComplianceOverview
            data={dashboardData}
            isLoading={isDashboardLoading}
            isError={isDashboardError}
          />
        </div>
        <div className="lg:col-span-1">
          <PriorityAttention
            deadlines={upcomingDeadlines}
            alerts={regulatoryAlerts}
            deadlinesUpdatedAt={deadlinesUpdatedAt}
          />
        </div>
      </section>

      {/* ROW 4 & 5: Activity Feed, Deadlines & Quick Actions */}
      <section aria-label="Regulatory Intelligence & Actions" className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left 2 Columns: Alerts & History */}
        <div className="lg:col-span-2 space-y-6">
          <RegulatoryAlertsCard
            alerts={regulatoryAlerts}
            isLoading={isAlertsLoading}
            isError={isAlertsError}
          />

          <RecentComplianceQueries
            queries={recentQueries}
            isLoading={isHistoryLoading}
            isError={isHistoryError}
          />
        </div>

        {/* Right 1 Column: Deadlines & Quick Actions */}
        <div className="space-y-6">
          <UpcomingDeadlinesCard
            deadlines={upcomingDeadlines}
            isLoading={isDeadlinesLoading}
            isError={isDeadlinesError}
            deadlinesUpdatedAt={deadlinesUpdatedAt}
          />

          <DashboardQuickActions />
        </div>
      </section>
    </div>
  )
}
