"use client"

import { useState } from "react"
import { toast } from "sonner"
import { BadgeCheck, Building2, Calendar, Search, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage, trpc } from "@/lib/trpc"

type AdminLicenseRow = {
  id: string
  licenseType: string
  regulator: string
  licenseNumber: string | null
  status: string
  expiryDate: string | Date | null
  renewalDueDate: string | Date | null
  organization: { id: string; name: string; plan: string }
  assignedOwner?: { fullName: string; email: string } | null
  derived?: {
    isExpired: boolean
    isRenewalDueSoon: boolean
    isRenewalOverdue: boolean
    daysUntilRenewal: number | null
  }
}

const statuses = ["DRAFT", "ACTIVE", "PENDING_RENEWAL", "SUBMITTED", "APPROVED", "EXPIRED", "SUSPENDED", "REVOKED", "ARCHIVED"]

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("en-KE", { dateStyle: "medium" })
}

function riskLabel(license: AdminLicenseRow) {
  if (license.derived?.isExpired) return "Expired"
  if (license.derived?.isRenewalOverdue) return "Renewal overdue"
  if (license.derived?.isRenewalDueSoon) return "Renewal due soon"
  return "Normal"
}

export default function AdminLicensesPage() {
  const utils = trpc.useUtils()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  const { data, isLoading, isError } = trpc.license.adminList.useQuery({
    page: 1,
    limit: 100,
    status: status === "all" ? undefined : status as never,
    search: search.trim() || undefined,
  })

  const overrideUpdate = trpc.license.adminOverrideUpdate.useMutation({
    onSuccess: () => {
      void utils.license.adminList.invalidate()
      toast.success("Admin override recorded")
    },
    onError: (error) => toast.error("Override failed", { description: getErrorMessage(error) }),
  })

  const licenses: AdminLicenseRow[] = Array.isArray((data as any)?.licenses) ? (data as any).licenses : []

  function overrideStatus(license: AdminLicenseRow, nextStatus: string) {
    const reason = window.prompt(`Reason for overriding ${license.organization.name}'s license status?`)
    if (!reason || reason.trim().length < 10) {
      toast.error("Override reason must be at least 10 characters.")
      return
    }
    overrideUpdate.mutate({ id: license.id, status: nextStatus as never, reason: reason.trim() })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">License Support</h1>
          <p className="mt-1 text-muted-foreground">Platform support visibility and controlled audited overrides.</p>
        </div>
        <Badge className="w-fit bg-warning/10 text-warning">
          <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
          Override requires reason
        </Badge>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Organization License Records</CardTitle>
              <CardDescription>Read across tenants for support; use override only with customer/support justification.</CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search organization or license..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-muted/50 pl-9 sm:w-[280px]" />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-muted/50 sm:w-[190px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map((item) => <SelectItem key={item} value={item}>{item.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </>
            ) : isError ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Could not load license records.</p>
            ) : licenses.length === 0 ? (
              <div className="py-12 text-center">
                <BadgeCheck className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No license records found.</p>
              </div>
            ) : licenses.map((license) => (
              <div key={license.id} className="rounded-lg bg-muted/30 p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-foreground">{license.licenseType}</h3>
                        {license.licenseNumber ? <Badge variant="outline" className="font-mono text-xs">{license.licenseNumber}</Badge> : null}
                        <Badge variant="outline">{license.status.replace(/_/g, " ")}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{license.organization.name}</span>
                        <span>{license.regulator}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Renewal {formatDate(license.renewalDueDate)}</span>
                        <span>Expiry {formatDate(license.expiryDate)}</span>
                      </div>
                      <p className="mt-2 text-sm text-primary">{riskLabel(license)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Select value={license.status} onValueChange={(nextStatus) => overrideStatus(license, nextStatus)}>
                      <SelectTrigger className="w-[190px] bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((item) => <SelectItem key={item} value={item}>{item.replace(/_/g, " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => overrideStatus(license, "ARCHIVED")} disabled={overrideUpdate.isPending}>
                      Archive Override
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
