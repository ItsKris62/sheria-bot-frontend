"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Mail,
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
} from "lucide-react"
import { useAdminUsers, useAdminActions, useAdminStats } from "@/hooks/use-admin"
import { trpc } from "@/lib/trpc"
import { toast } from "@/hooks/use-toast"
import { toast as sonnerToast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const roleColorMap: Record<string, string> = {
  STARTUP: "bg-primary/10 text-primary",
  REGULATOR: "bg-warning/10 text-warning",
  ADMIN: "bg-destructive/10 text-destructive",
  ENTERPRISE: "bg-primary/10 text-primary",
  FINTECH_USER: "bg-muted text-muted-foreground",
}

const roleLabel: Record<string, string> = {
  STARTUP: "Startup",
  REGULATOR: "Regulator",
  ADMIN: "Admin",
  ENTERPRISE: "Enterprise",
  FINTECH_USER: "User",
}

function UserRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
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
    </div>
  )
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ email: "", fullName: "", password: "", role: "STARTUP" })
  const limit = 20

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

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      sonnerToast.success("User created successfully")
      setCreateOpen(false)
      setCreateForm({ email: "", fullName: "", password: "", role: "STARTUP" })
      void utils.admin.listUsers.invalidate()
    },
    onError: (err) => sonnerToast.error(err.message),
  })

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate()
      utils.admin.getStats.invalidate()
      toast({ title: "User deleted" })
    },
    onError: (err) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  })

  type StatsShape = { users?: { total?: number; active?: number }; organizations?: { total?: number } }
  const s = statsData as StatsShape | undefined

  type UserRow = {
    id: string; fullName: string; email: string; role: string;
    status: string; emailVerified: boolean; lastLoginAt: Date | string | null
    organization?: { name: string } | null
  }
  const users = ((data as { users?: UserRow[] })?.users ?? []) as UserRow[]
  const total: number = (data as { pagination?: { total?: number } })?.pagination?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  async function handleSuspend(userId: string, isSuspended: boolean) {
    setPendingUserId(userId)
    try {
      if (isSuspended) {
        await enableUser({ userId })
        toast({ title: "User reactivated" })
      } else {
        await disableUser({ userId, reason: "Suspended by administrator" })
        toast({ title: "User suspended" })
      }
    } catch (err: any) {
      toast({ title: "Action failed", description: err.message, variant: "destructive" })
    } finally {
      setPendingUserId(null)
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    deleteUserMutation.mutate({ userId })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform users and their permissions</p>
        </div>
        <Button className="bg-secondary hover:bg-[#007a50] text-white" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{s?.users?.total?.toLocaleString() ?? "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organizations</p>
                    <p className="text-2xl font-bold text-foreground">{s?.organizations?.total?.toLocaleString() ?? "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-warning/10"><Shield className="h-5 w-5 text-warning" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users (30d)</p>
                    <p className="text-2xl font-bold text-foreground">{s?.users?.active?.toLocaleString() ?? "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* User list */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{isLoading ? "Loading…" : `${total} users`}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="pl-9 w-[250px] bg-muted/50"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
                <SelectTrigger className="w-[150px] bg-muted/50"><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="STARTUP">Startup</SelectItem>
                  <SelectItem value="REGULATOR">Regulator</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
                <SelectTrigger className="w-[140px] bg-muted/50"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={i} />)
            ) : users.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No users found</p>
            ) : (
              users.map((user) => {
                const isSuspended = user.status === "SUSPENDED"
                const isPending = pendingUserId === user.id || (deleteUserMutation.isPending && deleteUserMutation.variables?.userId === user.id)
                const initials = (user.fullName ?? user.email ?? "?")
                  .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors ${isSuspended ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{user.fullName ?? user.email}</p>
                          {isSuspended ? (
                            <Badge variant="outline" className="border-destructive/50 text-destructive text-xs">Suspended</Badge>
                          ) : (
                            <Badge variant="outline" className="border-primary/50 text-primary text-xs">Active</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{user.email}</span>
                          {user.organization?.name && <span>{user.organization.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={roleColorMap[user.role] ?? "bg-muted text-muted-foreground"}>
                          {roleLabel[user.role] ?? user.role}
                        </Badge>
                        <Badge variant="outline" className={user.emailVerified ? "border-green-400 text-green-600 text-xs" : "border-orange-400 text-orange-600 text-xs"}>
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
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
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {total} users</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
              <Select value={createForm.role} onValueChange={(v) => setCreateForm((f) => ({ ...f, role: v }))}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              className="bg-secondary hover:bg-[#007a50]"
              disabled={!createForm.email || !createForm.fullName || createForm.password.length < 8 || createUserMutation.isPending}
              onClick={() => createUserMutation.mutate({
                  ...createForm,
                  role: createForm.role as "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN",
                })}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
