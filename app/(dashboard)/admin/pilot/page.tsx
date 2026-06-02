"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  UserPlus,
  Loader2,
  KeyRound,
  CalendarPlus,
  Ban,
} from "lucide-react"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { toast } from "sonner"

// ─── Local types ──────────────────────────────────────────────────────────────

interface PilotTester {
  id:               string
  email:            string
  fullName:         string | null
  organization:     string | null
  cohort:           string | null
  pilotStartedAt:   string | null
  pilotExpiresAt:   string | null
  pilotConvertedAt: string | null
  status:           "active" | "expired" | "converted" | "revoked"
  pilotExtensionCount: number
  pilotFirstExtensionGrantedAt: string | null
  pilotSecondExtensionGrantedAt: string | null
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
  if (status === "revoked")
    return <Badge className="bg-destructive/10 text-destructive border-0">Revoked</Badge>
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

// ─── Create User Profile Dialog ───────────────────────────────────────────────

const NEW_ORGANIZATION_VALUE = "__new__"

function CreateUserProfileDialog({ onSuccess }: { onSuccess: () => void }) {
  const utils = trpc.useUtils()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    role: "STARTUP" as "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN",
    organizationId: "",
    organizationName: "",
  })
  const { data: organizationOptions, isLoading: organizationsLoading } = trpc.admin.listOrganizations.useQuery(
    undefined,
    { enabled: open }
  )
  const organizations = organizationOptions ?? []
  const creatingNewOrganization = !form.organizationId

  const createUserMutation = trpc.pilot.createPilotTester.useMutation({
    onSuccess: (result) => {
      toast.success(`Pilot tester created. Email ${result.emailDeliveryStatus.toLowerCase()}.`)
      setOpen(false)
      setForm({
        email: "",
        fullName: "",
        role: "STARTUP",
        organizationId: "",
        organizationName: "",
      })
      void utils.admin.listOrganizations.invalidate()
      void utils.pilot.getStats.invalidate()
      void utils.pilot.listTesters.invalidate()
      onSuccess()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.fullName) {
      toast.error("Please fill in all required fields")
      return
    }
    if (creatingNewOrganization && form.organizationName.trim().length < 2) {
      toast.error("Organization name must be at least 2 characters")
      return
    }
    createUserMutation.mutate({
      email: form.email,
      fullName: form.fullName,
      role: form.role === "ENTERPRISE" ? "ENTERPRISE" : "STARTUP",
      organizationId: form.organizationId || undefined,
      organizationName: creatingNewOrganization ? form.organizationName.trim() || undefined : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Create User Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create User Profile</DialogTitle>
          <DialogDescription>
            Create a new user account for the pilot programme. The user will receive login credentials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="fullName"
                placeholder="e.g. Jane Wanjiku"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@company.co.ke"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="col-span-2 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
              A strong temporary password will be generated, emailed to the pilot tester, and expire after 1 hour.
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v as typeof form.role }))}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STARTUP">Startup</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="REGULATOR" disabled>Regulator</SelectItem>
                  <SelectItem value="ADMIN" disabled>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orgId">Organization</Label>
              <Select
                value={form.organizationId || NEW_ORGANIZATION_VALUE}
                onValueChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    organizationId: value === NEW_ORGANIZATION_VALUE ? "" : value,
                  }))
                }
              >
                <SelectTrigger id="orgId">
                  <SelectValue placeholder={organizationsLoading ? "Loading organizations..." : "Select organization"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NEW_ORGANIZATION_VALUE}>Create new organization</SelectItem>
                  {organizations.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {creatingNewOrganization && (
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="orgName">New Organization Name <span className="text-destructive">*</span></Label>
                <Input
                  id="orgName"
                  placeholder="Acme Pilot Org"
                  value={form.organizationName}
                  onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                />
                {!organizationsLoading && organizations.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No organizations exist yet. Enter a name to auto-create one for this pilot tester.
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={createUserMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUserMutation.isPending || (creatingNewOrganization && form.organizationName.trim().length < 2)}
              className="gap-2"
            >
              {createUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {createUserMutation.isPending ? "Creating..." : "Create Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tester row ───────────────────────────────────────────────────────────────

function TesterRow({ tester, onChanged }: { tester: PilotTester; onChanged: () => void }) {
  const utils = trpc.useUtils()
  const reissueMutation = trpc.pilot.reissueTemporaryPassword.useMutation({
    onSuccess: (result) => {
      toast.success(`Temporary password reissued. Email ${result.emailDeliveryStatus.toLowerCase()}.`)
      void utils.pilot.listTesters.invalidate()
      onChanged()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
  const extendMutation = trpc.pilot.extendPilotAccess.useMutation({
    onSuccess: (result) => {
      toast.success(`Pilot extended to ${fmtDate(result.pilotAccessExpiresAt)}`)
      void utils.pilot.getStats.invalidate()
      void utils.pilot.listTesters.invalidate()
      onChanged()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
  const revokeMutation = trpc.pilot.revokePilotAccess.useMutation({
    onSuccess: () => {
      toast.success("Pilot access revoked")
      void utils.pilot.getStats.invalidate()
      void utils.pilot.listTesters.invalidate()
      onChanged()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
  const initials = tester.fullName
    ? tester.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : tester.email.slice(0, 2).toUpperCase()
  const nextExtensionDays = tester.pilotExtensionCount === 0 ? 10 : tester.pilotExtensionCount === 1 ? 5 : null

  return (
    <tr className="hover:bg-muted/20 transition-colors">
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
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[140px]">{tester.organization ?? "—"}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={tester.status} />
      </td>
      <td className="px-4 py-3 tabular-nums text-muted-foreground">
        Day {tester.daysSinceStart}
      </td>
      <td className="px-4 py-3 tabular-nums">
        {tester.status === "active" ? (
          <span className={tester.daysRemaining <= 2 ? "text-destructive font-medium" : "text-muted-foreground"}>
            {tester.daysRemaining}d left
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <EngagementBar score={tester.engagementScore} percent={tester.engagementPercent} />
      </td>
      <td className="px-4 py-3 tabular-nums text-muted-foreground">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          {tester.totalEvents}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <span className="flex items-center gap-1">
          <Activity className="h-3.5 w-3.5" />
          {fmtRelative(tester.lastEventAt)}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {fmtDate(tester.pilotExpiresAt)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            disabled={reissueMutation.isPending}
            onClick={() => reissueMutation.mutate({ userId: tester.id })}
          >
            {reissueMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
            Reissue
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            disabled={extendMutation.isPending || nextExtensionDays === null || tester.status === "converted" || tester.status === "revoked"}
            onClick={() => nextExtensionDays && extendMutation.mutate({ userId: tester.id, extensionDays: nextExtensionDays })}
          >
            {extendMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CalendarPlus className="h-3.5 w-3.5" />}
            {nextExtensionDays ? `+${nextExtensionDays}d` : "No extension"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-destructive hover:text-destructive"
            disabled={revokeMutation.isPending || tester.status === "converted" || tester.status === "revoked"}
            onClick={() => revokeMutation.mutate({ userId: tester.id })}
          >
            {revokeMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
            Revoke
          </Button>
        </div>
      </td>
    </tr>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PilotDashboardPage() {
  const utils = trpc.useUtils()
  const { data: rawStats,   isLoading: statsLoading }   = trpc.pilot.getStats.useQuery()
  const { data: rawTesters, isLoading: testersLoading } = trpc.pilot.listTesters.useQuery()

  const stats   = rawStats   as PilotStats   | undefined
  const testers = rawTesters as PilotTester[] | undefined

  function handleUserCreated() {
    utils.pilot.getStats.invalidate()
    utils.pilot.listTesters.invalidate()
  }

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Pilot Programme
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            14-day Enterprise-tier pilot — engagement and lifecycle overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats?.cohorts && stats.cohorts.length > 0 && (
            <div className="flex items-center gap-2">
              {stats.cohorts.map((c) => (
                <Badge key={c} variant="outline" className="font-mono text-xs">
                  {c}
                </Badge>
              ))}
            </div>
          )}
          <CreateUserProfileDialog onSuccess={handleUserCreated} />
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Testers" value={stats?.total}       icon={Users}       loading={statsLoading} highlight />
        <StatCard title="Active"         value={stats?.active}      icon={Rocket}      loading={statsLoading} sub="Pilot running" />
        <StatCard title="Expired"        value={stats?.expired}     icon={Clock}       loading={statsLoading} sub="Pilot ended" />
        <StatCard title="Converted"      value={stats?.converted}   icon={CheckCircle2} loading={statsLoading} sub="Subscribed" />
        <StatCard title="Total Events"   value={stats?.totalEvents} icon={Activity}    loading={statsLoading} sub="Logged actions" />
      </div>

      {/* ── Create User Profile Section ── */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Onboard a Pilot User
          </CardTitle>
          <CardDescription>
            Create a user profile directly from the admin panel to onboard pilot testers without requiring self-registration.
            The user will receive an email with their login credentials if the welcome email option is enabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">Quick onboarding</p>
              <p className="text-xs text-muted-foreground">
                Set up email, full name, password, and role. Optionally link to an existing organization.
              </p>
            </div>
            <CreateUserProfileDialog onSuccess={handleUserCreated} />
          </div>
        </CardContent>
      </Card>

      {/* ── Tester table ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilot Testers</CardTitle>
          <CardDescription>
            All users currently enrolled in the pilot programme with engagement metrics.
          </CardDescription>
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
              <p className="text-sm mt-1 mb-4">
                Use the &ldquo;Create User Profile&rdquo; button above to onboard your first pilot tester.
              </p>
              <CreateUserProfileDialog onSuccess={handleUserCreated} />
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
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testers.map((tester) => (
                    <TesterRow key={tester.id} tester={tester} onChanged={handleUserCreated} />
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
