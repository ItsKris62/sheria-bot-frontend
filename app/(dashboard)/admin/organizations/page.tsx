"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Search,
  MoreVertical,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const PLAN_COLORS: Record<string, string> = {
  REGULATOR: "bg-slate-100 text-slate-700",
  STARTUP: "bg-blue-100 text-blue-700",
  BUSINESS: "bg-purple-100 text-purple-700",
  ENTERPRISE: "bg-emerald-100 text-emerald-700",
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  GRACE_PERIOD: "bg-yellow-100 text-yellow-700",
  PAST_DUE: "bg-orange-100 text-orange-700",
  TRIALING: "bg-blue-100 text-blue-700",
  EXPIRED: "bg-gray-100 text-gray-500",
}

export default function AdminOrganizationsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [confirmOrg, setConfirmOrg] = useState<{ id: string; name: string; action: "suspend" | "reactivate" } | null>(null)

  const utils = trpc.useUtils()

  const { data: orgStats } = trpc.admin.getOrganizationStats.useQuery()

  const { data, isLoading, isError } = trpc.admin.getAllOrganizations.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    tier: tierFilter !== "all" ? tierFilter : undefined,
  })

  const suspendMutation = trpc.admin.suspendOrganization.useMutation({
    onSuccess: () => {
      toast.success("Organization suspended")
      void utils.admin.getAllOrganizations.invalidate()
      void utils.admin.getOrganizationStats.invalidate()
    },
    onError: (err) => toast.error(err.message),
  })

  const reactivateMutation = trpc.admin.reactivateOrganization.useMutation({
    onSuccess: () => {
      toast.success("Organization reactivated")
      void utils.admin.getAllOrganizations.invalidate()
      void utils.admin.getOrganizationStats.invalidate()
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  type OrgStats = { total: number; active: number; byTier: { REGULATOR: number; STARTUP: number; BUSINESS: number; ENTERPRISE: number } }
  const s = orgStats as OrgStats | undefined

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2B4A]">Organizations</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all organizations on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: s?.total?.toLocaleString() ?? "—", icon: Building2, color: "text-blue-600" },
          { label: "Active", value: s?.active?.toLocaleString() ?? "—", icon: CheckCircle, color: "text-green-600" },
          { label: "Startups", value: s?.byTier?.STARTUP?.toLocaleString() ?? "—", icon: TrendingUp, color: "text-purple-600" },
          { label: "Enterprise", value: s?.byTier?.ENTERPRISE?.toLocaleString() ?? "—", icon: Users, color: "text-emerald-600" },
        ].map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-[#1A2B4A]">{card.value}</p>
                </div>
                <card.icon className={`w-8 h-8 ${card.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Search by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-xs"
              />
              <Button variant="outline" size="icon" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="REGULATOR">Regulator</SelectItem>
                <SelectItem value="STARTUP">Startup</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">Failed to load organizations. Please refresh.</div>
          ) : !data?.items.length ? (
            <div className="text-center py-12 text-gray-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No organizations found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Organization</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Members</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Created</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.items.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1A2B4A] flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {org.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-[#1A2B4A] truncate max-w-[200px]">{org.name}</p>
                              {org.registrationNumber && (
                                <p className="text-xs text-gray-400">Reg: {org.registrationNumber}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-600 capitalize">
                          {org.type}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PLAN_COLORS[org.subscriptionTier] ?? "bg-gray-100 text-gray-600"}`}>
                            {org.subscriptionTier}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                          {org.memberCount}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[org.subscriptionStatus] ?? "bg-gray-100 text-gray-600"}`}>
                            {org.subscriptionStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell text-gray-500 text-xs">
                          {new Date(org.createdAt).toLocaleDateString("en-KE")}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/organizations/${org.id}`}>
                                  <Eye className="w-4 h-4 mr-2" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              {org.subscriptionStatus === "ACTIVE" ? (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setConfirmOrg({ id: org.id, name: org.name, action: "suspend" })}
                                >
                                  <Ban className="w-4 h-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => setConfirmOrg({ id: org.id, name: org.name, action: "reactivate" })}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" /> Reactivate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && data.total > 20 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} ({data.total} total)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmOrg} onOpenChange={() => setConfirmOrg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmOrg?.action === "suspend" ? "Suspend Organization" : "Reactivate Organization"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmOrg?.action === "suspend"
                ? `This will suspend "${confirmOrg?.name}" and all its members. They will lose access immediately.`
                : `This will reactivate "${confirmOrg?.name}" and restore member access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirmOrg?.action === "suspend" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              onClick={() => {
                if (!confirmOrg) return
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
