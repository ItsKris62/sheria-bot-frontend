"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Shield,
  CreditCard,
  Activity,
  Ban,
  Trash2,
} from "lucide-react"

const mockUser = {
  id: "USR-001",
  name: "John Kamau",
  email: "john@safaricom.co.ke",
  phone: "+254 712 345 678",
  role: "startup",
  organization: "Safaricom PLC",
  plan: "enterprise",
  status: "active",
  lastLogin: "2024-01-28T10:30:00Z",
  createdAt: "2023-06-15",
  queries: 156,
  checklists: 12,
  documents: 45,
  activity: [
    { action: "Generated PSP License Checklist", date: "2024-01-28T10:30:00Z" },
    { action: "Queried KYC requirements", date: "2024-01-27T14:20:00Z" },
    { action: "Uploaded audited financials", date: "2024-01-25T09:15:00Z" },
    { action: "Completed gap analysis", date: "2024-01-24T16:45:00Z" },
  ],
}

export default function UserDetailPage() {
  const params = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Details</h1>
            <p className="text-muted-foreground text-sm mt-1">
              View and manage user information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" className="text-destructive border-destructive bg-transparent">
            <Ban className="h-4 w-4 mr-2" />
            Suspend
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {mockUser.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold text-foreground">{mockUser.name}</h2>
                <p className="text-muted-foreground">{mockUser.organization}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-primary/10 text-primary">Startup</Badge>
                  <Badge variant="outline" className="border-primary text-primary">Active</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{mockUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{mockUser.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{mockUser.organization}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    Joined {new Date(mockUser.createdAt).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    Last login {new Date(mockUser.lastLogin).toLocaleString("en-KE")}
                  </span>
                </div>
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
                <Badge className="bg-warning/10 text-warning">Enterprise</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Fee</span>
                <span className="text-sm font-medium text-foreground">KES 50,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Billing</span>
                <span className="text-sm text-foreground">Feb 15, 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    <p className="text-3xl font-bold text-foreground">{mockUser.queries}</p>
                    <p className="text-sm text-muted-foreground">Total Queries</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-foreground">{mockUser.checklists}</p>
                    <p className="text-sm text-muted-foreground">Checklists</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-foreground">{mockUser.documents}</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.activity.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">{item.action}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleString("en-KE")}
                        </span>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-4">
                    {[...mockUser.activity, ...mockUser.activity].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">{item.action}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleString("en-KE")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>Manage what this user can access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Compliance Queries", enabled: true },
                    { name: "Generate Checklists", enabled: true },
                    { name: "Gap Analysis", enabled: true },
                    { name: "Document Vault", enabled: true },
                    { name: "API Access", enabled: false },
                    { name: "Export Reports", enabled: true },
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
