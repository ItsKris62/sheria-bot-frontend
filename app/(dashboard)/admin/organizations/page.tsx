"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  MoreVertical,
  Building2,
  Users,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle2,
  Radio,
  Layers3,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const PAGE_SIZE = 20
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

function formatPlanLabel(plan: string) {
  return plan.charAt(0) + plan.slice(1).toLowerCase()
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

type OrgSortField = "name" | "organizationType" | "subscriptionTier" | "subscriptionStatus" | "memberCount" | "createdAt"

const DEFAULT_SORT_ORDER: Record<OrgSortField, "asc" | "desc"> = {
  name: "asc",
  organizationType: "asc",
  subscriptionTier: "asc",
  subscriptionStatus: "asc",
  memberCount: "desc",
  createdAt: "desc",
}

export default function AdminOrganizationsPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<{ field: OrgSortField; order: "asc" | "desc" }>({
    field: "createdAt",
    order: "desc",
  })
  const [confirmOrg, setConfirmOrg] = useState<{ id: string; name: string; action: "suspend" | "reactivate" } | null>(null)

  const utils = trpc.useUtils()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const { data: orgStats } = trpc.admin.getOrganizationStats.useQuery(undefined, {
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  const { data, isLoading, isError, isFetching } = trpc.admin.getAllOrganizations.useQuery(
    {
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      tier: tierFilter !== "all" ? tierFilter : undefined,
      sortBy: sorting.field,
      sortOrder: sorting.order,
    },
    { refetchInterval: REFRESH_INTERVAL_MS }
  )

  const suspendMutation = trpc.admin.suspendOrganization.useMutation({
    onSuccess: async () => {
      toast.success("Organization suspended")
      await Promise.all([
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
        utils.admin.getAllOrganizations.invalidate(),
        utils.admin.getOrganizationStats.invalidate(),
      ])
    },
    onError: (err) => toast.error(err.message),
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
  const hasActiveFilters = Boolean(search || tierFilter !== "all")

  const cards = useMemo(
    () => [
      { label: "Total organizations", value: orgStats?.total ?? 0, icon: Building2, token: 1 },
      { label: "Active subscriptions", value: orgStats?.active ?? 0, icon: CheckCircle2, token: 2 },
      { label: "Startup accounts", value: orgStats?.byTier?.STARTUP ?? 0, icon: Layers3, token: 3 },
      { label: "Enterprise accounts", value: orgStats?.byTier?.ENTERPRISE ?? 0, icon: Users, token: 4 },
    ],
    [orgStats]
  )

  function toggleSort(field: OrgSortField) {
    setSorting((current) => {
      if (current.field === field) {
        return {
          field,
          order: current.order === "asc" ? "desc" : "asc",
        }
      }

      return {
        field,
        order: DEFAULT_SORT_ORDER[field],
      }
    })
    setPage(1)
  }

  function resetFilters() {
    setSearchInput("")
    setSearch("")
    setTierFilter("all")
    setSorting({ field: "createdAt", order: "desc" })
    setPage(1)
  }

  function renderSortIcon(field: OrgSortField) {
    if (sorting.field !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
    }

    return sorting.order === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />
  }

  function renderSortableHead(label: string, field: OrgSortField, className?: string) {
    return (
      <TableHead
        className={className}
        aria-sort={sorting.field === field ? (sorting.order === "asc" ? "ascending" : "descending") : "none"}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>{label}</span>
          {renderSortIcon(field)}
        </button>
      </TableHead>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Organizations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live oversight of customer organizations, membership health, and plan distribution.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
          <Radio className={`h-3.5 w-3.5 ${isFetching ? "animate-pulse text-primary" : "text-primary"}`} />
          Auto-refreshing every 10 seconds
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
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

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="gap-4 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">All organizations</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Search, sort, and filter organizations from the server in real time.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search organization name"
                className="pl-9"
              />
            </div>

            <Select
              value={tierFilter}
              onValueChange={(value) => {
                setTierFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="REGULATOR">Regulator</SelectItem>
                <SelectItem value="STARTUP">Startup</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-12 text-center text-sm text-destructive">
              Failed to load organizations. Please retry.
            </div>
          ) : !data?.items.length ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/10 px-6 py-14 text-center">
              <Building2 className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {hasActiveFilters ? "No organizations matched your view" : "No organizations yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your search, plan filter, or sorting preference. Live refresh remains active and new matches will appear automatically."
                  : "Organizations will appear here as customers onboard to the platform. This live table will start populating automatically once records are available."}
              </p>
              {hasActiveFilters ? (
                <div className="mt-5 flex justify-center">
                  <Button variant="outline" onClick={resetFilters}>
                    Clear filters and reset sorting
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {renderSortableHead("Organization", "name")}
                      {renderSortableHead("Type", "organizationType", "hidden md:table-cell")}
                      {renderSortableHead("Plan", "subscriptionTier")}
                      {renderSortableHead("Members", "memberCount", "hidden lg:table-cell")}
                      {renderSortableHead("Status", "subscriptionStatus")}
                      {renderSortableHead("Created", "createdAt", "hidden xl:table-cell")}
                      <TableHead className="w-[56px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((org) => {
                      const planStyle = getToneStyle(PLAN_TOKENS[org.subscriptionTier] ?? 1)
                      const statusStyle = getToneStyle(STATUS_TOKENS[org.subscriptionStatus] ?? 5)

                      return (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                                {org.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">{org.name}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {org.registrationNumber ? `Reg. ${org.registrationNumber}` : "Registration not provided"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell capitalize text-muted-foreground">
                            {formatLabel(org.organizationType ?? org.type)}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" style={planStyle}>
                              {formatPlanLabel(org.subscriptionTier)}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {org.memberCount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium" style={statusStyle}>
                              {formatLabel(org.subscriptionStatus)}
                            </span>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-muted-foreground">
                            {new Date(org.createdAt).toLocaleDateString("en-KE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/organizations/${org.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View details
                                  </Link>
                                </DropdownMenuItem>

                                {org.subscriptionStatus === "ACTIVE" ? (
                                  <DropdownMenuItem
                                    onClick={() => setConfirmOrg({ id: org.id, name: org.name, action: "suspend" })}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Ban className="mr-2 h-4 w-4" /> Suspend
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => setConfirmOrg({ id: org.id, name: org.name, action: "reactivate" })}
                                    className="text-primary focus:text-primary"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Reactivate
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing page {page} of {totalPages} · {data.total.toLocaleString()} organizations · Sorted by {formatLabel(sorting.field)} ({sorting.order})
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!confirmOrg} onOpenChange={() => setConfirmOrg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmOrg?.action === "suspend" ? "Suspend organization" : "Reactivate organization"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmOrg?.action === "suspend"
                ? `This will immediately suspend ${confirmOrg.name} and block member access.`
                : `This will restore access for ${confirmOrg?.name} and its members.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmOrg) {
                  return
                }

                if (confirmOrg.action === "suspend") {
                  suspendMutation.mutate({ orgId: confirmOrg.id, reason: "Suspended by administrator" })
                } else {
                  reactivateMutation.mutate({ orgId: confirmOrg.id })
                }

                setConfirmOrg(null)
              }}
            >
              {confirmOrg?.action === "suspend" ? "Suspend" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
