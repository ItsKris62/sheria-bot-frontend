"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Building2,
  Calendar,
} from "lucide-react"

const applications = [
  {
    id: "APP-2024-001",
    title: "Payment Service Provider License",
    regulator: "Central Bank of Kenya",
    status: "in-progress",
    progress: 65,
    submittedDate: "2024-01-10",
    lastUpdate: "2024-01-25",
    nextAction: "Submit audited financials",
    dueDate: "2024-02-15",
  },
  {
    id: "APP-2024-002",
    title: "Data Controller Registration",
    regulator: "ODPC Kenya",
    status: "submitted",
    progress: 100,
    submittedDate: "2024-01-05",
    lastUpdate: "2024-01-20",
    nextAction: "Awaiting ODPC review",
    dueDate: null,
  },
  {
    id: "APP-2024-003",
    title: "Regulatory Sandbox Application",
    regulator: "Central Bank of Kenya",
    status: "approved",
    progress: 100,
    submittedDate: "2023-11-15",
    lastUpdate: "2024-01-02",
    nextAction: "Begin sandbox testing",
    dueDate: "2024-03-01",
  },
  {
    id: "APP-2023-004",
    title: "Foreign Exchange Bureau License",
    regulator: "Central Bank of Kenya",
    status: "rejected",
    progress: 100,
    submittedDate: "2023-09-20",
    lastUpdate: "2023-12-15",
    nextAction: "Address feedback and resubmit",
    dueDate: null,
  },
  {
    id: "APP-2024-005",
    title: "E-Money Issuer License",
    regulator: "Central Bank of Kenya",
    status: "draft",
    progress: 30,
    submittedDate: null,
    lastUpdate: "2024-01-28",
    nextAction: "Complete application form",
    dueDate: "2024-02-28",
  },
]

const statusConfig = {
  draft: { label: "Draft", icon: FileText, color: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In Progress", icon: Clock, color: "bg-primary/10 text-primary" },
  submitted: { label: "Submitted", icon: AlertCircle, color: "bg-warning/10 text-warning" },
  approved: { label: "Approved", icon: CheckCircle2, color: "bg-primary/10 text-primary" },
  rejected: { label: "Rejected", icon: XCircle, color: "bg-destructive/10 text-destructive" },
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: applications.length,
    inProgress: applications.filter((a) => a.status === "in-progress").length,
    approved: applications.filter((a) => a.status === "approved").length,
    pending: applications.filter((a) => a.status === "submitted").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">License Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your regulatory license applications
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>View and manage your license applications</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[250px] bg-muted/50"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const status = statusConfig[app.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              return (
                <Link key={app.id} href={`/startup/applications/${app.id}`}>
                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{app.title}</h3>
                            <Badge variant="outline" className="font-mono text-xs">
                              {app.id}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {app.regulator}
                            </span>
                            {app.submittedDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Submitted: {new Date(app.submittedDate).toLocaleDateString("en-KE")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary mt-2">Next: {app.nextAction}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        {app.status !== "approved" && app.status !== "rejected" && (
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-foreground">{app.progress}%</span>
                            </div>
                            <Progress value={app.progress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
