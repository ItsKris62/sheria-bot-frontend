"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"

const users = [
  {
    id: "USR-001",
    name: "John Kamau",
    email: "john@safaricom.co.ke",
    role: "startup",
    organization: "Safaricom PLC",
    plan: "enterprise",
    status: "active",
    lastLogin: "2024-01-28",
    createdAt: "2023-06-15",
  },
  {
    id: "USR-002",
    name: "Mary Wanjiku",
    email: "mary@mpesa.co.ke",
    role: "startup",
    organization: "M-Pesa Foundation",
    plan: "professional",
    status: "active",
    lastLogin: "2024-01-27",
    createdAt: "2023-08-20",
  },
  {
    id: "USR-003",
    name: "Dr. Peter Ochieng",
    email: "peter@cbk.go.ke",
    role: "regulator",
    organization: "Central Bank of Kenya",
    plan: "regulator",
    status: "active",
    lastLogin: "2024-01-28",
    createdAt: "2023-04-10",
  },
  {
    id: "USR-004",
    name: "Jane Akinyi",
    email: "jane@kcb.co.ke",
    role: "startup",
    organization: "KCB Group",
    plan: "starter",
    status: "inactive",
    lastLogin: "2024-01-15",
    createdAt: "2023-09-05",
  },
  {
    id: "USR-005",
    name: "David Mwangi",
    email: "david@odpc.go.ke",
    role: "regulator",
    organization: "ODPC Kenya",
    plan: "regulator",
    status: "active",
    lastLogin: "2024-01-26",
    createdAt: "2023-07-22",
  },
]

const roleConfig = {
  startup: { label: "Startup", color: "bg-primary/10 text-primary" },
  regulator: { label: "Regulator", color: "bg-warning/10 text-warning" },
  admin: { label: "Admin", color: "bg-destructive/10 text-destructive" },
}

const planConfig = {
  starter: { label: "Starter", color: "bg-muted text-muted-foreground" },
  professional: { label: "Professional", color: "bg-primary/10 text-primary" },
  enterprise: { label: "Enterprise", color: "bg-warning/10 text-warning" },
  regulator: { label: "Regulator", color: "bg-primary/10 text-primary" },
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users and their permissions
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Startups</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => u.role === "startup").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-warning/10">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Regulators</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => u.role === "regulator").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{filteredUsers.length} users</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[250px] bg-muted/50"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="regulator">Regulator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <Badge
                        variant="outline"
                        className={user.status === "active" ? "border-primary text-primary" : ""}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>{user.organization}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={roleConfig[user.role as keyof typeof roleConfig].color}>
                    {roleConfig[user.role as keyof typeof roleConfig].label}
                  </Badge>
                  <Badge className={planConfig[user.plan as keyof typeof planConfig].color}>
                    {planConfig[user.plan as keyof typeof planConfig].label}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
