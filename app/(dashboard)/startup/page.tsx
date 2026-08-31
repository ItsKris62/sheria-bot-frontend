"use client"

import { useAuthenticatedQueryEnabled, useAuthStore } from "@/lib/auth-store"
import { trpc } from "@/lib/trpc"
import { usePlan } from "@/lib/plan-context"
import {
  UserDashboardHeader,
  ComplianceOverview,
  PriorityAttention,
  RegulatoryAlertsCard,
  UpcomingDeadlinesCard,
  DashboardQuickActions,
  RecentComplianceQueries,
} from "@/components/dashboard"
import type { AlertItem, DeadlineItem, QueryItem } from "@/components/dashboard"

export default function StartupDashboard() {
  const user = useAuthStore((state) => state.user)
  const authQueryEnabled = useAuthenticatedQueryEnabled()
  const displayName = user?.name?.split(" ")[0] ?? "there"

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

  // Format safely typed array arrays from raw tRPC responses
  const regulatoryAlerts: AlertItem[] = Array.isArray(rawAlertsData?.alerts)
    ? (rawAlertsData.alerts as unknown as AlertItem[])
    : []

  const upcomingDeadlines: DeadlineItem[] = Array.isArray(rawDeadlines)
    ? (rawDeadlines as unknown as DeadlineItem[])
    : []

  const recentQueries: QueryItem[] = Array.isArray(rawHistoryData?.queries)
    ? (rawHistoryData.queries as unknown as QueryItem[])
    : []

  const dashboardData = rawDashboardData
    ? {
        overallScore: rawDashboardData.overallScore,
        categories: rawDashboardData.categories,
        trend: (rawDashboardData as { trend?: unknown }).trend as any ?? null,
        lastUpdated: rawDashboardData.lastUpdated,
      }
    : null

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-10">
      {/* Welcome Header */}
      <UserDashboardHeader displayName={displayName} />

      {/* Compliance Overview */}
      <ComplianceOverview
        data={dashboardData}
        isLoading={isDashboardLoading}
        isError={isDashboardError}
      />

      {/* Priority Attention Strip (Urgent items from real data) */}
      <PriorityAttention
        deadlines={upcomingDeadlines}
        alerts={regulatoryAlerts}
        deadlinesUpdatedAt={deadlinesUpdatedAt}
      />

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
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
      </div>
    </div>
  )
}
