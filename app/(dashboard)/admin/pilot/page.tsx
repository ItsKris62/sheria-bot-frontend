"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Rocket,
  CheckCircle2,
  Clock,
  Activity,
  TrendingUp,
  Mail,
  Building2,
  CalendarDays,
} from "lucide-react"
import { trpc } from "@/lib/trpc"

// ─── Local types (tRPC inference returns `any` due to @/ path aliases) ────────

interface PilotTester {
  id:               string
  email:            string
  fullName:         string | null
  organization:     string | null
  cohort:           string | null
  pilotStartedAt:   string | null
  pilotExpiresAt:   string | null
  pilotConvertedAt: string | null
  status:           "active" | "expired" | "converted"
  daysRemaining:    number
  daysSinceStart:   number
  engagementScore:  number
  engagementPercent: number
  totalEvents:      number
  lastEventAt:      string | null
  eventsByAction:   Record<string, number>
}

interface PilotStats {
  total:       number
  active:      number
  expired:     number
  converted:   number
  totalEvents: number
  cohorts:     string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
}

function fmtRelative(iso: string | null): string {
  if (!iso) return "—"
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PilotTester["status"] }) {
  if (status === "active")
    return <Badge className="bg-primary/10 text-primary border-0">Active</Badge>
  if (status === "converted")
    return <Badge className="bg-emerald-500/10 text-emerald-600 border-0">Converted</Badge>
  return <Badge className="bg-muted text-muted-foreground border-0">Expired</Badge>
}

// ─── Engagement bar ───────────────────────────────────────────────────────────

function EngagementBar({ score, percent }: { score: number; percent: number }) {
  const color =
    percent >= 60 ? "bg-primary" :
    percent >= 30 ? "bg-amber-500" :
    "bg-muted-foreground/40"

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
        {score}/10
      </span>
    </div>
  )
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function TesterRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title:     string
  value:     number | string | undefined
  icon:      React.ComponentType<{ className?: string }>
  loading:   boolean
  sub?:      string
  highlight?: boolean
}

function StatCard({ title, value, icon: Icon, loading, sub, highlight }: StatCardProps) {
  return (
    <Card className={highlight ? "border-primary/30" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <div className="text-2xl font-bold">{value ?? "—"}</div>
        )}
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PilotDashboardPage() {
  const { data: rawStats,   isLoading: statsLoading }   = trpc.pilot.getStats.useQuery()
  const { data: rawTesters, isLoading: testersLoading } = trpc.pilot.listTesters.useQuery()

  const stats   = rawStats   as PilotStats   | undefined
  const testers = rawTesters as PilotTester[] | undefined

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Pilot Programme
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            14-day Enterprise-tier pilot — engagement and lifecycle overview
          </p>
        </div>
        {stats?.cohorts && stats.cohorts.length > 0 && (
          <div className="flex items-center gap-2">
            {stats.cohorts.map((c) => (
              <Badge key={c} variant="outline" className="font-mono text-xs">
                {c}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Testers" value={stats?.total}       icon={Users}       loading={statsLoading} highlight />
        <StatCard title="Active"         value={stats?.active}      icon={Rocket}      loading={statsLoading} sub="Pilot running" />
        <StatCard title="Expired"        value={stats?.expired}     icon={Clock}       loading={statsLoading} sub="Pilot ended" />
        <StatCard title="Converted"      value={stats?.converted}   icon={CheckCircle2} loading={statsLoading} sub="Subscribed" />
        <StatCard title="Total Events"   value={stats?.totalEvents} icon={Activity}    loading={statsLoading} sub="Logged actions" />
      </div>

      {/* ── Tester table ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilot Testers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {testersLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => <TesterRowSkeleton key={i} />)}
            </div>
          ) : !testers || testers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Rocket className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No pilot testers provisioned yet</p>
              <p className="text-sm mt-1">
                Run <code className="text-xs bg-muted px-1.5 py-0.5 rounded">pnpm pilot:provision:execute</code> to provision testers
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-medium">Tester</th>
                    <th className="text-left px-4 py-3 font-medium">Organization</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Day</th>
                    <th className="text-left px-4 py-3 font-medium">Remaining</th>
                    <th className="text-left px-4 py-3 font-medium">Engagement</th>
                    <th className="text-left px-4 py-3 font-medium">Events</th>
                    <th className="text-left px-4 py-3 font-medium">Last Active</th>
                    <th className="text-left px-4 py-3 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testers.map((tester) => (
                    <TesterRow key={tester.id} tester={tester} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Tester row ───────────────────────────────────────────────────────────────

function TesterRow({ tester }: { tester: PilotTester }) {
  const initials = tester.fullName
    ? tester.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : tester.email.slice(0, 2).toUpperCase()

  return (
    <tr className="hover:bg-muted/20 transition-colors">
      {/* Tester */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate max-w-[160px]">{tester.fullName ?? tester.email}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[160px]">
              <Mail className="h-3 w-3 shrink-0" />
              {tester.email}
            </p>
          </div>
        </div>
      </td>

      {/* Organization */}
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[140px]">{tester.organization ?? "—"}</span>
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={tester.status} />
      </td>

      {/* Day in pilot */}
      <td className="px-4 py-3 tabular-nums text-muted-foreground">
        Day {tester.daysSinceStart}
      </td>

      {/* Days remaining */}
      <td className="px-4 py-3 tabular-nums">
        {tester.status === "active" ? (
          <span className={tester.daysRemaining <= 2 ? "text-destructive font-medium" : "text-muted-foreground"}>
            {tester.daysRemaining}d left
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>

      {/* Engagement */}
      <td className="px-4 py-3">
        <EngagementBar score={tester.engagementScore} percent={tester.engagementPercent} />
      </td>

      {/* Total events */}
      <td className="px-4 py-3 tabular-nums text-muted-foreground">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          {tester.totalEvents}
        </span>
      </td>

      {/* Last active */}
      <td className="px-4 py-3 text-muted-foreground">
        <span className="flex items-center gap-1">
          <Activity className="h-3.5 w-3.5" />
          {fmtRelative(tester.lastEventAt)}
        </span>
      </td>

      {/* Expiry date */}
      <td className="px-4 py-3 text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {fmtDate(tester.pilotExpiresAt)}
        </span>
      </td>
    </tr>
  )
}
