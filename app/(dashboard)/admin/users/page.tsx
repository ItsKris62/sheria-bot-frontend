"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreVertical,
  Ban,
  Trash2,
  Eye,
  Users,
  Building2,
  Shield,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react"
import { AUDITED_JURISDICTIONS, type AuditedJurisdictionCode } from "@/lib/jurisdictions"
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
import { useAdminUsers, useAdminActions, useAdminStats } from "@/hooks/use-admin"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AdminDataPanel,
  AdminEmptyState,
  AdminFilterBar,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/portal"
import { PortalSurface } from "@/components/portal"

const roleColorMap: Record<string, string> = {
  STARTUP: "bg-primary/10 text-primary",
  REGULATOR: "bg-warning/10 text-warning",
  ADMIN: "bg-destructive/10 text-destructive",
  ENTERPRISE: "bg-primary/10 text-primary",
}

const roleLabel: Record<string, string> = {
  STARTUP: "Startup",
  REGULATOR: "Regulator",
  ADMIN: "Admin",
  ENTERPRISE: "Enterprise",
}

function UserRowSkeleton() {
  return (
    <PortalSurface variant="solid" className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </PortalSurface>
  )
}

type BulkAction = "suspend" | "activate" | "tier"
type TierValue = "REGULATOR" | "STARTUP" | "BUSINESS" | "ENTERPRISE"
type CreateUserRole = "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN"

const EMPTY_ORGANIZATION_VALUE = "__none__"

const initialCreateForm = {
  email: "",
  fullName: "",
  password: "",
  role: "STARTUP" as CreateUserRole,
  organizationId: "",
  organizationName: "",
  homeJurisdictionCode: "" as "" | AuditedJurisdictionCode,
  isPilot: false,
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(initialCreateForm)
  const limit = 20

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkConfirmAction, setBulkConfirmAction] = useState<BulkAction | null>(null)
  const [bulkTier, setBulkTier] = useState<TierValue>("STARTUP")

  const { data, isLoading } = useAdminUsers({
    page,
    limit,
    role: roleFilter === "all" ? undefined : roleFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search || undefined,
  })
  const { data: statsData, isLoading: statsLoading } = useAdminStats()
  const { disableUser, enableUser, isDisabling, isEnabling } = useAdminActions()

  const utils = trpc.useUtils()
  const { data: organizationOptions, isLoading: organizationsLoading } = trpc.admin.listOrganizations.useQuery(
    undefined,
    { enabled: createOpen }
  )

  const bulkStatusMutation = trpc.admin.bulkUpdateUserStatus.useMutation({
    onSuccess: (result) => {
      toast.success(`${result.count} user${result.count !== 1 ? "s" : ""} updated`)
      setSelectedIds(new Set())
      setBulkConfirmAction(null)
      void utils.admin.listUsers.invalidate()
    },
    onError: (err) => toast.error(err.message ?? "Bulk action failed"),
  })

  const bulkTierMutation = trpc.admin.bulkUpdateUserTier.useMutation({
    onSuccess: (result) => {
      toast.success(`Tier updated for ${result.count} user${result.count !== 1 ? "s" : ""}`)
      setSelectedIds(new Set())
      setBulkConfirmAction(null)
      void utils.admin.listUsers.invalidate()
    },
    onError: (err) => toast.error(err.message ?? "Tier update failed"),
  })

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("User created successfully")
      setCreateOpen(false)
      setCreateForm(initialCreateForm)
      void utils.admin.listUsers.invalidate()
      void utils.admin.listOrganizations.invalidate()
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate()
      utils.admin.getStats.invalidate()
      toast.success("User deleted")
    },
    onError: (err) => toast.error("Delete failed", { description: err.message }),
  })

  type StatsShape = { users?: { total?: number; active?: number }; organizations?: { total?: number } }
  const s = statsData as StatsShape | undefined

  type UserRow = {
    id: string; fullName: string; email: string; role: string;
    status: string; emailVerified: boolean; lastLoginAt: Date | string | null
    organization?: { name: string } | null
  }
  const users = ((data as unknown as { users?: UserRow[] })?.users ?? []) as UserRow[]
  const total: number = (data as { pagination?: { total?: number } })?.pagination?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const allPageIds = users.map((u) => u.id)
  const allPageSelected = allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id))
  const organizations = organizationOptions ?? []
  const createUserDisabled =
    !createForm.email ||
    !createForm.fullName ||
    createForm.password.length < 8 ||
    (createForm.isPilot && (createForm.organizationName.trim().length < 2 || !createForm.homeJurisdictionCode)) ||
    createUserMutation.isPending

  function submitCreateUser() {
    createUserMutation.mutate({
      email: createForm.email,
      fullName: createForm.fullName,
      password: createForm.password,
      role: createForm.role,
      organizationId: createForm.isPilot ? undefined : createForm.organizationId || undefined,
      organizationName: createForm.isPilot ? createForm.organizationName.trim() || undefined : undefined,
      homeJurisdictionCode: createForm.isPilot ? createForm.homeJurisdictionCode || undefined : undefined,
      isPilot: createForm.isPilot,
      sendWelcomeEmail: false,
    })
  }

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        allPageIds.forEach((id) => next.delete(id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        allPageIds.forEach((id) => next.add(id))
        return next
      })
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function executeBulkAction() {
    const ids = [...selectedIds]
    if (bulkConfirmAction === "suspend") {
      bulkStatusMutation.mutate({ userIds: ids, status: "SUSPENDED" })
    } else if (bulkConfirmAction === "activate") {
      bulkStatusMutation.mutate({ userIds: ids, status: "ACTIVE" })
    } else if (bulkConfirmAction === "tier") {
      bulkTierMutation.mutate({ userIds: ids, tier: bulkTier })
    }
  }

  const bulkIsPending = bulkStatusMutation.isPending || bulkTierMutation.isPending

  async function handleSuspend(userId: string, isSuspended: boolean) {
    setPendingUserId(userId)
    try {
      if (isSuspended) {
        await enableUser({ userId })
        toast.success("User reactivated")
      } else {
        await disableUser({ userId, reason: "Suspended by administrator" })
        toast("User suspended")
      }
    } catch (err: unknown) {
      toast.error("Action failed", { description: (err as Error).message })
    } finally {
      setPendingUserId(null)
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    deleteUserMutation.mutate({ userId })
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-8">
      <AdminPageHeader
        title="User Management"
        description="Manage platform users and their permissions."
        icon={Users}
        action={
          <Button className="bg-secondary hover:bg-[#007a50] text-white" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add User
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <AdminStatCard key={i} label="Loading user metric" isLoading />)
        ) : (
          <>
            <AdminStatCard label="Total Users" value={s?.users?.total?.toLocaleString() ?? "Not available"} icon={Users} status="info" />
            <AdminStatCard label="Organizations" value={s?.organizations?.total?.toLocaleString() ?? "Not available"} icon={Building2} status="info" />
            <AdminStatCard label="Active Users (30d)" value={s?.users?.active?.toLocaleString() ?? "Not available"} icon={Shield} status="warning" />
          </>
        )}
      </div>

      {/* Bulk action toolbar */}
      {selectedIds.size > 0 && (
        <PortalSurface variant="solid" className="flex flex-col gap-3 border-[var(--portal-accent-border)] bg-[var(--portal-accent-muted)]/30 p-3 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-[var(--portal-text-primary)]">{selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""} selected</span>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <Button size="sm" variant="outline" onClick={() => setBulkConfirmAction("activate")} disabled={bulkIsPending}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Activate
            </Button>
            <Button size="sm" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => setBulkConfirmAction("suspend")} disabled={bulkIsPending}>
              <Ban className="h-3.5 w-3.5 mr-1.5" />Suspend
            </Button>
            <div className="flex items-center gap-1.5">
              <Select value={bulkTier} onValueChange={(v) => setBulkTier(v as TierValue)}>
                <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULATOR">Regulator</SelectItem>
                  <SelectItem value="STARTUP">Startup</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => setBulkConfirmAction("tier")} disabled={bulkIsPending}>
                Change Tier
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} disabled={bulkIsPending}>
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear selected users</span>
            </Button>
          </div>
        </PortalSurface>
      )}

      {/* User list */}
      <AdminDataPanel
        title="All Users"
        description={isLoading ? "Loading..." : `${total} users`}
      >
        <AdminFilterBar className="mb-4">
          <div className="relative min-w-0 lg:w-[250px]">
            <label htmlFor="admin-users-search" className="sr-only">Search users</label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="admin-users-search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full bg-[var(--portal-surface)] pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
            <SelectTrigger aria-label="Filter users by role" className="w-full bg-[var(--portal-surface)] lg:w-[150px]"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="STARTUP">Startup</SelectItem>
              <SelectItem value="REGULATOR">Regulator</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger aria-label="Filter users by status" className="w-full bg-[var(--portal-surface)] lg:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </AdminFilterBar>

        {!isLoading && users.length > 0 && (
          <div className="mb-3 flex items-center gap-3 border-b border-[var(--portal-border)] px-1 pb-2">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
              checked={allPageSelected}
              onChange={toggleSelectAll}
              aria-label="Select all users on this page"
            />
            <span className="text-xs text-[var(--portal-text-secondary)]">Select all on this page</span>
          </div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={i} />)
          ) : users.length === 0 ? (
            <AdminEmptyState
              title={search || roleFilter !== "all" || statusFilter !== "all" ? "No users match the current filters" : "No users are currently available"}
              description={search || roleFilter !== "all" || statusFilter !== "all" ? "Adjust the search, role, or status filters to broaden the result set." : "Users will appear here as accounts are created."}
              icon={Users}
            />
          ) : (
            users.map((user) => {
              const isSuspended = user.status === "SUSPENDED"
              const isPending = pendingUserId === user.id || (deleteUserMutation.isPending && deleteUserMutation.variables?.userId === user.id)
              const initials = (user.fullName ?? user.email ?? "?")
                .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
              const isSelected = selectedIds.has(user.id)

              return (
                <div
                  key={user.id}
                  className={`flex flex-col gap-4 rounded-lg border p-4 transition-colors lg:flex-row lg:items-center lg:justify-between ${isSelected ? "border-[var(--portal-accent-border)] bg-[var(--portal-accent-muted)]/30" : "border-[var(--portal-border)] bg-[var(--portal-surface-solid)] hover:bg-[var(--portal-surface-hover)]"} ${isSuspended ? "opacity-70" : ""}`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 flex-shrink-0 cursor-pointer rounded border-border accent-primary"
                      checked={isSelected}
                      onChange={() => toggleSelect(user.id)}
                      aria-label={`Select ${user.fullName ?? user.email}`}
                    />
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words font-medium text-[var(--portal-text-primary)]">{user.fullName ?? user.email}</p>
                        {isSuspended ? (
                          <Badge variant="outline" className="border-destructive/50 text-destructive text-xs">Suspended</Badge>
                        ) : (
                          <Badge variant="outline" className="border-primary/50 text-primary text-xs">Active</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--portal-text-secondary)]">
                        <span className="break-all">{user.email}</span>
                        {user.organization?.name && <span className="break-words">{user.organization.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={roleColorMap[user.role] ?? "bg-muted text-muted-foreground"}>
                        {roleLabel[user.role] ?? user.role}
                      </Badge>
                      <Badge variant="outline" className={user.emailVerified ? "border-green-400 text-green-600 text-xs" : "border-orange-400 text-orange-600 text-xs"}>
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="User action in progress" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Open actions for ${user.fullName ?? user.email}`}><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="h-4 w-4 mr-2" />View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspend(user.id, isSuspended)}>
                            {isSuspended ? (
                              <><CheckCircle2 className="h-4 w-4 mr-2" />Reactivate User</>
                            ) : (
                              <><Ban className="h-4 w-4 mr-2" />Suspend User</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-[var(--portal-border)] pt-4">
            <p className="text-sm text-[var(--portal-text-secondary)]">Page {page} of {totalPages} - {total} users</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous users page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next users page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </AdminDataPanel>

      {/* Bulk Action Confirmation Dialog */}
      <AlertDialog open={bulkConfirmAction !== null} onOpenChange={(open) => { if (!open) setBulkConfirmAction(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkConfirmAction === "suspend" && "Suspend selected users?"}
              {bulkConfirmAction === "activate" && "Activate selected users?"}
              {bulkConfirmAction === "tier" && `Change tier to ${bulkTier}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will affect {selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""}.
              {bulkConfirmAction === "tier" && " Their organizations' subscription tier will be updated and plan cache will be invalidated."}
              {" "}This action is logged to the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkIsPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              disabled={bulkIsPending}
              className={bulkConfirmAction === "suspend" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {bulkIsPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user directly without an invitation email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                placeholder="Jane Doe"
                value={createForm.fullName}
                onChange={(e) => setCreateForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="jane@example.com"
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 8 characters"
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={createForm.role} onValueChange={(v) => setCreateForm((f) => ({ ...f, role: v as CreateUserRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULATOR">Regulator</SelectItem>
                  <SelectItem value="STARTUP">Startup</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="pilotTester">Pilot tester</Label>
                <p className="text-xs text-muted-foreground">Auto-create an organization for this pilot account.</p>
              </div>
              <Switch
                id="pilotTester"
                checked={createForm.isPilot}
                onCheckedChange={(checked) =>
                  setCreateForm((f) => ({
                    ...f,
                    isPilot: checked,
                    organizationId: checked ? "" : f.organizationId,
                    organizationName: checked ? f.organizationName : "",
                  }))
                }
              />
            </div>
            {createForm.isPilot ? (
              <>
                <div className="space-y-1">
                  <Label>Organization Name</Label>
                  <Input
                    placeholder="Acme Pilot Org"
                    value={createForm.organizationName}
                    onChange={(e) => setCreateForm((f) => ({ ...f, organizationName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Home Jurisdiction</Label>
                  <Select
                    value={createForm.homeJurisdictionCode}
                    onValueChange={(value) => setCreateForm((f) => ({ ...f, homeJurisdictionCode: value as AuditedJurisdictionCode }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select jurisdiction" /></SelectTrigger>
                    <SelectContent>
                      {AUDITED_JURISDICTIONS.map((jurisdiction) => (
                        <SelectItem key={jurisdiction.code} value={jurisdiction.code}>{jurisdiction.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <Label>Organization</Label>
                <Select
                  value={createForm.organizationId || EMPTY_ORGANIZATION_VALUE}
                  onValueChange={(value) =>
                    setCreateForm((f) => ({
                      ...f,
                      organizationId: value === EMPTY_ORGANIZATION_VALUE ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={organizationsLoading ? "Loading organizations..." : "Select organization"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY_ORGANIZATION_VALUE}>No organization</SelectItem>
                    {organizations.map((organization) => (
                      <SelectItem key={organization.id} value={organization.id}>
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!organizationsLoading && organizations.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No organizations exist yet. Create one before adding a user, or toggle Pilot tester to auto-create.
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              className="bg-secondary hover:bg-[#007a50]"
              disabled={createUserDisabled}
              onClick={submitCreateUser}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
