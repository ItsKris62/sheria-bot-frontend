"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
import { JurisdictionSelector } from "@/components/dashboard/jurisdiction-selector"
import { ComplianceReviewDrawer } from "@/components/dashboard/compliance-review-drawer"
import type { AlertItem, DeadlineItem, QueryItem } from "@/components/dashboard"
import { ShieldCheck, CheckCircle2, Calendar, Bell, Lock, AlertCircle, Info } from "lucide-react"
import { PortalSurface } from "@/components/portal"

export default function StartupDashboard() {
  const user = useAuthStore((state) => state.user)
  const authQueryEnabled = useAuthenticatedQueryEnabled()
  const displayName = user?.name?.split(" ")[0] ?? "there"
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackFeatureUsage({
      feature_name: "compliance_dashboard",
      status: "viewed",
    })
  }, [])

  // Check server rollout gate for V2
  const { data: rolloutData } = (trpc.complianceDashboard as any).getV2RolloutStatus?.useQuery(
    undefined,
    { staleTime: 60 * 1000, enabled: authQueryEnabled }
  ) ?? { data: { isEnabled: false } }
  const isV2Enabled = Boolean(rolloutData?.isEnabled)

  // Jurisdiction selection via URL param
  const countryParam = searchParams.get("country") || searchParams.get("jurisdiction")
  const selectedCountryCode = countryParam ? countryParam.toUpperCase() : undefined

  // Derive calendar feature entitlement from plan context
  const { hasFeature } = usePlan()
  const calendarEnabled = hasFeature("complianceCalendar")

  // V1 Query (Legacy)
  const v1Query = trpc.complianceDashboard.getComplianceDashboard.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: authQueryEnabled && !isV2Enabled,
  })

  // V2 Query (Jurisdiction-First)
  const v2Query = (trpc.complianceDashboard as any).getComplianceDashboardV2?.useQuery(
    { jurisdictionCode: selectedCountryCode },
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: authQueryEnabled && isV2Enabled,
    }
  ) ?? { data: null, isLoading: false, isError: false }

  // Calendar queries:
  // 1. upcoming preview items (preserved for UpcomingDeadlinesCard)
  const {
    data: rawDeadlines = [],
    isLoading: isDeadlinesLoading,
    dataUpdatedAt: deadlinesUpdatedAt,
  } = trpc.calendar.upcoming.useQuery(
    { daysAhead: 30 },
    { staleTime: 5 * 60 * 1000, enabled: calendarEnabled }
  )

  // 2. upcomingSummary (authoritative total and urgent counts for KPI 3)
  const { data: deadlineSummary } = (trpc.calendar as any).upcomingSummary?.useQuery(
    { daysAhead: 30 },
    { staleTime: 5 * 60 * 1000, enabled: calendarEnabled }
  ) ?? { data: null }

  // Regulatory alerts query (scoped by selected jurisdiction if in V2)
  const {
    data: rawAlertsData,
    isLoading: isAlertsLoading,
  } = trpc.alert.getAlerts.useQuery(
    {
      page: 1,
      limit: 3,
      jurisdictionCode: isV2Enabled && selectedCountryCode ? (selectedCountryCode as "KE" | "RW" | "MW" | "NG") : undefined,
    },
    { staleTime: 60 * 1000, enabled: authQueryEnabled }
  )

  // Recent query history
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

  // Review drawer state
  const [activeReviewCategory, setActiveReviewCategory] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Format safely typed arrays
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

  // Handle country switch
  const handleSelectCountry = (code: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("country", code)
    router.push(`/startup?${params.toString()}`)
  }

  // Determine active view data based on V1 vs V2
  const v2Data = v2Query.data
  const isV2Ready = isV2Enabled && v2Data?.availabilityStatus === "READY"
  const v2ActiveDashboard = isV2Ready ? v2Data.dashboard : null

  const isDashboardLoading = isV2Enabled ? v2Query.isLoading : v1Query.isLoading
  const isDashboardError = isV2Enabled ? v2Query.isError : v1Query.isError

  const dashboardData = useMemo(() => {
    if (isV2Enabled) {
      if (isV2Ready && v2ActiveDashboard) {
        return {
          overallScore: v2ActiveDashboard.overallScore,
          scoreType: v2ActiveDashboard.scoreType,
          assessmentStatus: v2ActiveDashboard.assessmentStatus,
          coveragePercent: v2ActiveDashboard.coveragePercent,
          categories: v2ActiveDashboard.categories.map((c: any) => ({
            key: c.category,
            label: c.categoryName,
            score: c.score,
            completedItems: c.compliantItems,
            totalItems: c.totalItems,
            assessedItems: c.assessedItems,
            reviewStatus: c.reviewStatus,
          })),
          trend: v2ActiveDashboard.trend
            ? {
                points: v2ActiveDashboard.trend.delta,
                label:
                  v2ActiveDashboard.trend.direction === "UP"
                    ? "increase"
                    : v2ActiveDashboard.trend.direction === "DOWN"
                    ? "decrease"
                    : "no_change",
                comparedAt: null,
                windowDays: 30,
              }
            : null,
          lastUpdated: null,
        }
      }
      return null
    }

    // Legacy V1 data fallback
    return v1Query.data
      ? {
          overallScore: v1Query.data.overallScore,
          categories: v1Query.data.categories,
          trend: (v1Query.data as any).trend ?? null,
          lastUpdated: v1Query.data.lastUpdated,
        }
      : null
  }, [isV2Enabled, isV2Ready, v2ActiveDashboard, v1Query.data])

  // KPI calculations
  const kpiData = useMemo(() => {
    const completedRequirements = isV2Ready && v2ActiveDashboard
      ? v2ActiveDashboard.compliantRequirements
      : dashboardData?.categories.reduce((acc: number, cat: any) => acc + (cat.completedItems || 0), 0) ?? 0

    const totalRequirements = isV2Ready && v2ActiveDashboard
      ? v2ActiveDashboard.totalRequirements
      : dashboardData?.categories.reduce((acc: number, cat: any) => acc + (cat.totalItems || 0), 0) ?? 0

    const totalAlerts = typeof rawAlertsData?.total === "number" ? rawAlertsData.total : null
    const unreadAlertsCount = regulatoryAlerts.filter((a) => !a.isRead).length

    // KPI 3: Authoritative deadline count from upcomingSummary or fallback
    const totalDeadlines = calendarEnabled
      ? (deadlineSummary?.total ?? upcomingDeadlines.length)
      : null
    const urgentDeadlinesCount = calendarEnabled
      ? (deadlineSummary?.urgentCount ?? 0)
      : 0

    return {
      completedRequirements,
      totalRequirements,
      totalDeadlines,
      urgentDeadlinesCount,
      totalAlerts,
      unreadAlertsCount,
    }
  }, [
    isV2Ready,
    v2ActiveDashboard,
    dashboardData,
    rawAlertsData,
    regulatoryAlerts,
    calendarEnabled,
    deadlineSummary,
    upcomingDeadlines.length,
  ])

  // Active category requirements for the drawer
  const activeRequirements = v2ActiveDashboard?.requirements ?? []
  const activeCategoryName = useMemo(() => {
    if (!activeReviewCategory || !v2ActiveDashboard) return "Category"
    const cat = v2ActiveDashboard.categories.find((c: any) => c.category === activeReviewCategory)
    return cat?.categoryName ?? activeReviewCategory
  }, [activeReviewCategory, v2ActiveDashboard])

  const handleOpenReview = (categoryKey: string) => {
    setActiveReviewCategory(categoryKey)
    setIsDrawerOpen(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12">
      {/* ROW 1: Page Context & Welcome Header with Jurisdiction Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <UserDashboardHeader displayName={displayName} />

        {isV2Enabled && v2Data && (
          <JurisdictionSelector
            selectedJurisdiction={v2Data.context.selectedJurisdiction}
            homeJurisdiction={v2Data.context.homeJurisdiction}
            enabledJurisdictions={v2Data.context.enabledJurisdictions}
            onSelectJurisdiction={handleSelectCountry}
          />
        )}
      </div>

      {/* Discrete State Handling for Non-READY Jurisdictions (V2) */}
      {isV2Enabled && v2Data && v2Data.availabilityStatus !== "READY" && (
        <PortalSurface variant="raised" className="border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-start gap-3">
            <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                {v2Data.availabilityStatus === "BASELINE_UNAVAILABLE"
                  ? `Baseline Requirement Set Pending: ${v2Data.context.selectedJurisdiction}`
                  : v2Data.availabilityStatus === "JURISDICTION_NOT_ENTITLED"
                  ? `Jurisdiction Not Enabled: ${v2Data.context.selectedJurisdiction}`
                  : v2Data.availabilityStatus === "JURISDICTION_NOT_CONFIGURED"
                  ? "Primary Jurisdiction Not Configured"
                  : "Unsupported Jurisdiction"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {v2Data.dashboard.message}
              </p>
            </div>
          </div>
        </PortalSurface>
      )}

      {/* ROW 2: Top KPI Metric Row */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Overall Compliance Score */}
        <DashboardMetricCard
          title="Compliance Score"
          value={
            dashboardData?.overallScore !== null && dashboardData?.overallScore !== undefined
              ? `${Math.round(dashboardData.overallScore)}%`
              : "—"
          }
          subtitle={
            dashboardData?.scoreType === "PROVISIONAL"
              ? `Provisional (${dashboardData.coveragePercent}% assessed)`
              : dashboardData?.trend && dashboardData.trend.points !== null
              ? dashboardData.trend.points > 0
                ? `+${dashboardData.trend.points} pts vs history`
                : dashboardData.trend.points < 0
                ? `${dashboardData.trend.points} pts vs history`
                : "No change vs history"
              : isV2Ready
              ? "Weighted baseline posture"
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

        {/* KPI 3: Upcoming Deadlines (30 Days) - Labeled Organization-Wide */}
        <DashboardMetricCard
          title="Upcoming Deadlines"
          value={!calendarEnabled ? "Locked" : kpiData.totalDeadlines !== null ? kpiData.totalDeadlines : "—"}
          subtitle={
            !calendarEnabled
              ? "Upgrade plan to unlock calendar"
              : kpiData.urgentDeadlinesCount > 0
              ? `${kpiData.urgentDeadlinesCount} urgent (Organization-wide)`
              : "Next 30 days (Organization-wide)"
          }
          icon={!calendarEnabled ? Lock : Calendar}
          href={calendarEnabled ? "/startup/calendar" : undefined}
          isLoading={isDeadlinesLoading}
        />

        {/* KPI 4: Active Regulatory Alerts */}
        <DashboardMetricCard
          title="Regulatory Alerts"
          value={kpiData.totalAlerts !== null ? kpiData.totalAlerts : "—"}
          subtitle={
            kpiData.unreadAlertsCount > 0
              ? `${kpiData.unreadAlertsCount} unread alert${kpiData.unreadAlertsCount === 1 ? "" : "s"}`
              : selectedCountryCode
              ? `Filtered for ${selectedCountryCode}`
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
            onReviewCategory={isV2Ready ? handleOpenReview : undefined}
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
            deadlinesUpdatedAt={deadlinesUpdatedAt}
          />

          <DashboardQuickActions />
        </div>
      </section>

      {/* Baseline Review Drawer (Phase 1 Customer Assessment UI) */}
      {isV2Ready && (
        <ComplianceReviewDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          categoryKey={activeReviewCategory}
          categoryName={activeCategoryName}
          requirements={activeRequirements}
        />
      )}
    </div>
  )
}
