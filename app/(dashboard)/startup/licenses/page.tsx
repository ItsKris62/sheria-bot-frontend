"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { AlertTriangle, BadgeCheck, Building2, Calendar, Clock, FileText, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { usePlan } from "@/lib/plan-context"
import { getErrorMessage, trpc } from "@/lib/trpc"

type LicenseRow = {
  id: string
  licenseType: string
  regulator: string
  licenseNumber: string | null
  status: string
  expiryDate: string | Date | null
  renewalDueDate: string | Date | null
  assignedOwner?: { fullName: string; email: string } | null
  derived?: {
    daysUntilExpiry: number | null
    daysUntilRenewal: number | null
    isExpired: boolean
    isRenewalDueSoon: boolean
    isRenewalOverdue: boolean
  }
  _count?: { timelineEvents: number; documents: number; fees: number }
}

const statuses = ["DRAFT", "ACTIVE", "PENDING_RENEWAL", "SUBMITTED", "APPROVED", "EXPIRED", "SUSPENDED", "REVOKED", "ARCHIVED"]

const statusColor: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  ACTIVE: "bg-primary/10 text-primary",
  PENDING_RENEWAL: "bg-warning/10 text-warning",
  SUBMITTED: "bg-sky-500/10 text-sky-500",
  APPROVED: "bg-emerald-500/10 text-emerald-500",
  EXPIRED: "bg-destructive/10 text-destructive",
  SUSPENDED: "bg-warning/10 text-warning",
  REVOKED: "bg-destructive/10 text-destructive",
  ARCHIVED: "bg-muted text-muted-foreground",
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("en-KE", { dateStyle: "medium" })
}

function dateToIso(value: string) {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined
}

function deadlineLabel(license: LicenseRow) {
  if (license.derived?.isExpired) return "Expired"
  if (license.derived?.isRenewalOverdue) return "Renewal overdue"
  if (license.derived?.isRenewalDueSoon) return `${license.derived.daysUntilRenewal} days to renewal`
  if (license.derived?.daysUntilExpiry !== null && license.derived?.daysUntilExpiry !== undefined) {
    return `${license.derived.daysUntilExpiry} days to expiry`
  }
  return "No deadline"
}

export default function LicensesPage() {
  const utils = trpc.useUtils()
  const { hasFeature } = usePlan()
  const enabled = hasFeature("licenseManagement")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({
    licenseType: "",
    regulator: "",
    licenseNumber: "",
    issueDate: "",
    expiryDate: "",
    renewalDueDate: "",
    notes: "",
  })

  const { data, isLoading, isError } = trpc.license.list.useQuery(
    {
      page: 1,
      limit: 50,
      status: status === "all" ? undefined : status as never,
      search: search.trim() || undefined,
    },
    { enabled },
  )
  const { data: summary } = trpc.license.getDashboardSummary.useQuery(undefined, { enabled })

  const createLicense = trpc.license.create.useMutation({
    onSuccess: () => {
      setForm({ licenseType: "", regulator: "", licenseNumber: "", issueDate: "", expiryDate: "", renewalDueDate: "", notes: "" })
      setFormOpen(false)
      void utils.license.list.invalidate()
      void utils.license.getDashboardSummary.invalidate()
      toast.success("License record created")
    },
    onError: (error) => toast.error("Could not create license", { description: getErrorMessage(error) }),
  })

  const licenses: LicenseRow[] = Array.isArray((data as any)?.licenses) ? (data as any).licenses : []
  const stats = summary ?? { total: 0, active: 0, renewalDueSoon: 0, expired: 0 }

  function submit() {
    createLicense.mutate({
      licenseType: form.licenseType,
      regulator: form.regulator,
      licenseNumber: form.licenseNumber || undefined,
      issueDate: dateToIso(form.issueDate),
      expiryDate: dateToIso(form.expiryDate),
      renewalDueDate: dateToIso(form.renewalDueDate),
      notes: form.notes || undefined,
      status: "ACTIVE",
    })
  }

  return (
    <FeatureGate
      feature="licenseManagement"
      fallback={
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">License Management</h1>
            <p className="mt-1 text-muted-foreground">Track licenses, renewals, owners, fees, evidence, and calendar obligations.</p>
          </div>
          <LockedFeatureCard
            feature="licenseManagement"
            title="License Management"
            description="Manage organization licenses, renewal dates, owners, evidence links, fees, and license-generated calendar events. Available on the Business plan and above."
            requiredPlan="BUSINESS"
            className="max-w-lg"
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">License Management</h1>
            <p className="mt-1 text-muted-foreground">Track licenses, renewals, owners, fees, evidence, and calendar obligations.</p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={() => setFormOpen((value) => !value)}>
            <Plus className="mr-2 h-4 w-4" />
            New License
          </Button>
        </div>

        {formOpen ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Create License Record</CardTitle>
              <CardDescription>License dates will create linked compliance calendar events.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Payment Service Provider License" value={form.licenseType} onChange={(e) => setForm((prev) => ({ ...prev, licenseType: e.target.value }))} />
              <Input placeholder="Central Bank of Kenya" value={form.regulator} onChange={(e) => setForm((prev) => ({ ...prev, regulator: e.target.value }))} />
              <Input placeholder="License number" value={form.licenseNumber} onChange={(e) => setForm((prev) => ({ ...prev, licenseNumber: e.target.value }))} />
              <Input type="date" value={form.issueDate} onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))} />
              <Input type="date" value={form.expiryDate} onChange={(e) => setForm((prev) => ({ ...prev, expiryDate: e.target.value }))} />
              <Input type="date" value={form.renewalDueDate} onChange={(e) => setForm((prev) => ({ ...prev, renewalDueDate: e.target.value }))} />
              <Textarea className="md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
              <div className="flex gap-2 md:col-span-2">
                <Button onClick={submit} disabled={createLicense.isPending || !form.licenseType || !form.regulator}>
                  {createLicense.isPending ? "Creating..." : "Create License"}
                </Button>
                <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Licenses", value: stats.total, Icon: BadgeCheck },
            { label: "Active", value: stats.active, Icon: FileText },
            { label: "Renewal Due Soon", value: stats.renewalDueSoon, Icon: Clock },
            { label: "Expired / Overdue", value: stats.expired, Icon: AlertTriangle },
          ].map(({ label, value, Icon }) => (
            <Card key={label} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Organization Licenses</CardTitle>
                <CardDescription>Tenant-scoped license records with renewal and expiry intelligence.</CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search licenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-muted/50 pl-9 sm:w-[250px]" />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-muted/50 sm:w-[190px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((item) => (
                      <SelectItem key={item} value={item}>{item.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-[112px] rounded-lg" />
                  <Skeleton className="h-[112px] rounded-lg" />
                  <Skeleton className="h-[112px] rounded-lg" />
                </>
              ) : isError ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Could not load license records.</p>
              ) : licenses.length === 0 ? (
                <div className="py-12 text-center">
                  <BadgeCheck className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">No license records yet.</p>
                </div>
              ) : licenses.map((license) => (
                <Link key={license.id} href={`/startup/licenses/${license.id}`}>
                  <div className="rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <BadgeCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-foreground">{license.licenseType}</h3>
                            {license.licenseNumber ? <Badge variant="outline" className="font-mono text-xs">{license.licenseNumber}</Badge> : null}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{license.regulator}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Renewal {formatDate(license.renewalDueDate)}</span>
                            <span>Expiry {formatDate(license.expiryDate)}</span>
                          </div>
                          <p className="mt-2 text-sm text-primary">{deadlineLabel(license)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 lg:items-end">
                        <Badge className={statusColor[license.status] ?? "bg-muted text-muted-foreground"}>{license.status.replace(/_/g, " ")}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {(license._count?.timelineEvents ?? 0)} events - {(license._count?.documents ?? 0)} docs - {(license._count?.fees ?? 0)} fees
                        </span>
                        {license.assignedOwner ? <span className="text-xs text-muted-foreground">Owner: {license.assignedOwner.fullName}</span> : null}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  )
}
