"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeft,
  Building2,
  Users,
  FileText,
  Mail,
  Phone,
  Globe,
  Ban,
  CheckCircle2,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Radio,
  CalendarClock,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const REFRESH_INTERVAL_MS = 10_000

const PLAN_TOKENS: Record<string, number> = {
  REGULATOR: 1,
  STARTUP: 2,
  BUSINESS: 3,
  ENTERPRISE: 4,
}

const STATUS_TOKENS: Record<string, number> = {
  ACTIVE: 2,
  TRIALING: 1,
  GRACE_PERIOD: 3,
  PAST_DUE: 4,
  CANCELLED: 5,
  EXPIRED: 5,
}

function getToneStyle(token: number) {
  return {
    color: `hsl(var(--chart-${token}))`,
    backgroundColor: `hsl(var(--chart-${token}) / 0.14)`,
    borderColor: `hsl(var(--chart-${token}) / 0.26)`,
  }
}

function formatLabel(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string | Date | null | undefined, withLongMonth = false) {
  if (!value) {
    return "—"
  }

  return new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: withLongMonth ? "long" : "short",
    day: "numeric",
  })
}

export default function OrgDetailPage() {
  const params = useParams()
  const orgId = params.orgId as string

  const [confirmAction, setConfirmAction] = useState<"suspend" | "reactivate" | null>(null)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  const utils = trpc.useUtils()

  const { data: org, isLoading, isError, isFetching } = trpc.admin.getOrgDetails.useQuery(
    { orgId },
    { refetchInterval: REFRESH_INTERVAL_MS }
  )

  const suspendMutation = trpc.admin.suspendOrganization.useMutation({
    onSuccess: async () => {
      toast.success("Organization suspended")
      await Promise.all([
        utils.admin.getOrgDetails.invalidate({ orgId }),
        utils.admin.getAllOrganizations.invalidate(),
        utils.admin.getOrganizationStats.invalidate(),
      ])
    },
    onError: (err) => toast.error(err.message),
  })

  const reactivateMutation = trpc.admin.reactivateOrganization.useMutation({
    onSuccess: async () => {
      toast.success("Organization reactivated")
      await Promise.all([
        utils.admin.getOrgDetails.invalidate({ orgId }),
        utils.admin.getAllOrganizations.invalidate(),
        utils.admin.getOrganizationStats.invalidate(),
      ])
    },
    onError: (err) => toast.error(err.message),
  })

  const updatePlanMutation = trpc.admin.updateOrganizationPlan.useMutation({
    onSuccess: async () => {
      toast.success("Plan updated successfully")
      setPlanDialogOpen(false)
      await Promise.all([
        utils.admin.getOrgDetails.invalidate({ orgId }),
        utils.admin.getAllOrganizations.invalidate(),
        utils.admin.getOrganizationStats.invalidate(),
      ])
    },
    onError: (err) => toast.error(err.message),
  })

  const overviewCards = useMemo(
    () => [
      { label: "Registered users", value: org?.memberCount ?? 0, icon: Users, token: 2 },
      { label: "Documents", value: org?.documentCount ?? 0, icon: FileText, token: 3 },
      { label: "Policies", value: org?.policyCount ?? 0, icon: ShieldCheck, token: 4 },
      { label: "Seat capacity", value: org?.maxSeats ?? 0, icon: CreditCard, token: 1 },
    ],
    [org]
  )

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-52" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !org) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-16 text-center text-destructive">
          <AlertTriangle className="mx-auto h-10 w-10" />
          <p className="mt-3 text-sm">
            Failed to load organization details. <Link href="/admin/organizations" className="underline">Return to organizations</Link>
          </p>
        </div>
      </div>
    )
  }

  const planStyle = getToneStyle(PLAN_TOKENS[org.plan ?? org.subscriptionTier] ?? 1)
  const statusStyle = getToneStyle(STATUS_TOKENS[org.subscriptionStatus] ?? 5)
  const isSuspended = org.subscriptionStatus !== "ACTIVE"

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" asChild className="w-fit px-0 text-muted-foreground hover:text-foreground">
            <Link href="/admin/organizations">
              <ChevronLeft className="mr-1 h-4 w-4" /> Organizations
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{org.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {(org.organizationType ?? org.type).toString()} · {org.registrationNumber ?? "Registration pending"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
            <Radio className={`h-3.5 w-3.5 ${isFetching ? "animate-pulse text-primary" : "text-primary"}`} />
            Live refresh every 10 seconds
          </span>
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium" style={planStyle}>
            {formatLabel(org.plan ?? org.subscriptionTier)}
          </span>
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium" style={statusStyle}>
            {formatLabel(org.subscriptionStatus)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const toneStyle = getToneStyle(card.token)

          return (
            <Card key={card.label} className="border-border/70 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{card.value.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border p-3" style={toneStyle}>
                  <card.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Building2 className="h-4 w-4" /> Organization profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Organization type", value: formatLabel(org.organizationType ?? org.type) },
                { label: "Verification", value: formatLabel(org.verificationStatus) },
                { label: "CBK license", value: org.cbkLicenseNumber ?? "—" },
                { label: "Industry", value: org.industry ?? "—" },
                { label: "Company size", value: org.size ?? "—" },
                { label: "Website", value: org.website ?? "—" },
                { label: "Created", value: formatDate(org.createdAt, true) },
                { label: "Last updated", value: formatDate(org.updatedAt, true) },
                { label: "Plan start", value: formatDate(org.planStartDate) },
                { label: "Plan end", value: formatDate(org.planEndDate ?? org.subscriptionEndsAt) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-foreground break-words">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Users className="h-4 w-4" /> Registered users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!org.users.length ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                  No users are currently linked to this organization.
                </div>
              ) : (
                <div className="rounded-2xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden xl:table-cell">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {org.users.map((member) => {
                        const roleStyle = getToneStyle(PLAN_TOKENS[member.role] ?? 1)
                        const memberStatusStyle = getToneStyle(member.status === "ACTIVE" ? 2 : 5)

                        return (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                                  {(member.fullName || member.email).charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">{member.fullName || "Unnamed user"}</p>
                                  <p className="truncate text-xs text-muted-foreground">{member.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{member.email}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" style={roleStyle}>
                                {formatLabel(member.role)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" style={memberStatusStyle}>
                                {formatLabel(member.status)}
                              </span>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell text-muted-foreground">
                              {formatDate(member.createdAt)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setSelectedPlan(org.plan ?? org.subscriptionTier)
                  setPlanDialogOpen(true)
                }}
              >
                <CreditCard className="h-4 w-4" /> Change plan
              </Button>

              {isSuspended ? (
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setConfirmAction("reactivate") }>
                  <CheckCircle2 className="h-4 w-4" /> Reactivate organization
                </Button>
              ) : (
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setConfirmAction("suspend") }>
                  <Ban className="h-4 w-4" /> Suspend organization
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CreditCard className="h-4 w-4" /> Subscription health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Current plan</span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" style={planStyle}>
                  {formatLabel(org.plan ?? org.subscriptionTier)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Lifecycle status</span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" style={statusStyle}>
                  {formatLabel(org.subscriptionStatus)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Trial ends</span>
                <span className="text-right text-foreground">{formatDate(org.trialEndsAt)}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Grace period ends</span>
                <span className="text-right text-foreground">{formatDate(org.gracePeriodEndsAt)}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Cancelled at</span>
                <span className="text-right text-foreground">{formatDate(org.cancelledAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CalendarClock className="h-4 w-4" /> Contact points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Contact email</p>
                  <p className="font-medium text-foreground break-all">{org.contactEmail ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Contact phone</p>
                  <p className="font-medium text-foreground">{org.contactPhone ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Website</p>
                  <p className="font-medium text-foreground break-all">{org.website ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Primary contact</p>
                  <p className="font-medium text-foreground">{org.contactPerson ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{org.contactPosition ?? "No role recorded"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "suspend" ? "Suspend organization" : "Reactivate organization"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "suspend"
                ? `This action will immediately suspend ${org.name} and revoke access for all associated users.`
                : `This action will restore ${org.name} and allow associated users back into the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction === "suspend") {
                  suspendMutation.mutate({ orgId, reason: "Suspended by administrator" })
                } else {
                  reactivateMutation.mutate({ orgId })
                }

                setConfirmAction(null)
              }}
            >
              {confirmAction === "suspend" ? "Suspend" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change subscription plan</DialogTitle>
            <DialogDescription>
              Plan changes update the organization immediately and refresh the live admin view.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULATOR">Regulator</SelectItem>
                <SelectItem value="STARTUP">Startup</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedPlan || updatePlanMutation.isPending}
              onClick={() => {
                if (!selectedPlan) {
                  return
                }

                updatePlanMutation.mutate({
                  orgId,
                  plan: selectedPlan as "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE",
                })
              }}
            >
              {updatePlanMutation.isPending ? "Updating..." : "Update plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
