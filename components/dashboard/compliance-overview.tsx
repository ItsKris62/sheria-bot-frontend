import { AlertCircle, ShieldCheck } from "lucide-react"
import { PortalSectionHeader, PortalSkeleton, PortalSurface } from "@/components/portal"
import { ComplianceCategoryItem } from "./compliance-category-item"
import { ComplianceScoreGauge } from "./compliance-score-gauge"
import type { DashboardData } from "./dashboard-types"

export interface ComplianceOverviewProps {
  data?: DashboardData | null
  isLoading?: boolean
  isError?: boolean
}

export function ComplianceOverview({ data, isLoading, isError }: ComplianceOverviewProps) {
  if (isLoading) {
    return <PortalSurface variant="raised" className="p-6"><div className="flex flex-col gap-6"><div className="flex flex-col gap-2"><PortalSkeleton variant="text" className="h-6 w-48" /><PortalSkeleton variant="text" className="h-4 w-72" /></div><div className="grid gap-8 lg:grid-cols-[220px_1fr]"><PortalSkeleton variant="card" className="mx-auto size-44 rounded-full" /><div className="flex flex-col gap-3">{Array.from({ length: 5 }).map((_, i) => <PortalSkeleton key={i} variant="card" className="h-16" />)}</div></div></div></PortalSurface>
  }

  if (isError || !data) {
    return <PortalSurface variant="raised" className="border-red-500/30 p-8 text-center"><AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" aria-hidden="true" /><p className="font-semibold text-[var(--portal-text-primary)]">Unable to load compliance posture</p><p className="mt-1 text-sm text-[var(--portal-text-secondary)]">We could not load your regulatory score right now. Please refresh to try again.</p></PortalSurface>
  }

  return (
    <PortalSurface variant="raised" className="p-6 lg:p-7">
      <div className="flex flex-col gap-2 border-b border-[var(--portal-border)] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <PortalSectionHeader title="Compliance Posture" description="Your regulatory health across tracked requirements" icon={ShieldCheck} className="pb-0" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--portal-text-muted)]">Weighted view</span>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <ComplianceScoreGauge data={data} />
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-[var(--portal-text-primary)]">Regulatory areas</h3><p className="text-xs text-[var(--portal-text-muted)]">Compare posture and completion at a glance</p></div><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--portal-text-muted)]">{data.categories.length} tracked</span></div>
          <div>{data.categories.map((category) => <ComplianceCategoryItem key={category.key} category={category} />)}</div>
        </div>
      </div>
    </PortalSurface>
  )
}
