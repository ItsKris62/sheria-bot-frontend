"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Building2,
  Calendar,
  Clock,
  Shield,
  CreditCard,
  Activity,
  Ban,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useAdminActions } from "@/hooks/use-admin"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

const roleColorMap: Record<string, string> = {
  STARTUP: "bg-primary/10 text-primary",
  REGULATOR: "bg-warning/10 text-warning",
  ADMIN: "bg-destructive/10 text-destructive",
  ENTERPRISE: "bg-primary/10 text-primary",
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.userId as string
  const [actionPending, setActionPending] = useState(false)

  const { data: userData, isLoading, refetch } = trpc.admin.getUser.useQuery({ userId })
  const { data: activityData, isLoading: activityLoading } = trpc.admin.getUserActivityLog.useQuery({ userId })
  const { disableUser, enableUser } = useAdminActions()

  const user = userData as any
  const activity: any[] = (activityData as any) ?? []

  const isSuspended = !!user?.deletedAt || user?.status === "SUSPENDED" || user?.status === "INACTIVE"
  const initials = (user?.fullName ?? user?.name ?? user?.email ?? "?")
    .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

  async function handleToggleSuspend() {
    if (!user) return
    setActionPending(true)
    try {
      if (isSuspended) {
        await enableUser({ userId } as any)
        toast({ title: "User reactivated successfully" })
      } else {
        await disableUser({ userId, reason: "Suspended by administrator" } as any)
        toast({ title: "User suspended" })
      }
      refetch()
    } catch (err: any) {
      toast({ title: "Action failed", description: err.message, variant: "destructive" })
    } finally {
      setActionPending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6 space-y-4 flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <p className="text-muted-foreground text-center py-12">User not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Details</h1>
            <p className="text-muted-foreground text-sm mt-1">View and manage user information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={isSuspended ? "text-primary border-primary bg-transparent" : "text-destructive border-destructive bg-transparent"}
            onClick={handleToggleSuspend}
            disabled={actionPending}
          >
            {actionPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isSuspended ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <Ban className="h-4 w-4 mr-2" />
            )}
            {isSuspended ? "Reactivate" : "Suspend"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — profile card */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold text-foreground">{user.fullName ?? user.name}</h2>
                {user.organizationName && (
                  <p className="text-muted-foreground">{user.organizationName}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={roleColorMap[user.role] ?? "bg-muted text-muted-foreground"}>
                    {user.role}
                  </Badge>
                  {isSuspended ? (
                    <Badge variant="outline" className="border-destructive text-destructive">Suspended</Badge>
                  ) : (
                    <Badge variant="outline" className="border-primary text-primary">Active</Badge>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground break-all">{user.email}</span>
                </div>
                {user.organizationName && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{user.organizationName}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString("en-KE")}
                    </span>
                  </div>
                )}
                {user.lastLoginAt && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Last login {new Date(user.lastLoginAt).toLocaleString("en-KE")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge className="bg-warning/10 text-warning">{user.subscriptionTier ?? "Free"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <Badge className={user.emailVerified ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-foreground">{user.queryCount ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Total Queries</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-foreground">{user.policyCount ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Policies</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-foreground">{user.sessionCount ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))}
                    </div>
                  ) : activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
                  ) : (
                    <div className="space-y-4">
                      {activity.slice(0, 5).map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">{item.action}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Complete activity history for this user</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
                          <Skeleton className="h-4 w-52" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      ))}
                    </div>
                  ) : activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity recorded</p>
                  ) : (
                    <div className="space-y-1">
                      {activity.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm text-foreground">{item.action}</span>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 ml-4">
                            {new Date(item.createdAt).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>User Role & Permissions</CardTitle>
                  <CardDescription>Current access level for this user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Role</span>
                    </div>
                    <Badge className={roleColorMap[user.role] ?? "bg-muted text-muted-foreground"}>{user.role}</Badge>
                  </div>
                  {[
                    { name: "Compliance Queries", enabled: true },
                    { name: "Policy Generation", enabled: ["STARTUP", "REGULATOR", "ENTERPRISE", "ADMIN"].includes(user.role) },
                    { name: "Gap Analysis", enabled: ["STARTUP", "ENTERPRISE", "ADMIN"].includes(user.role) },
                    { name: "Document Vault", enabled: true },
                    { name: "Admin Panel", enabled: user.role === "ADMIN" },
                    { name: "Export Reports", enabled: ["STARTUP", "REGULATOR", "ENTERPRISE", "ADMIN"].includes(user.role) },
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{permission.name}</span>
                      </div>
                      <Badge className={permission.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                        {permission.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
