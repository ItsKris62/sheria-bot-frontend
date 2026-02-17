"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Bell,
  Shield,
} from "lucide-react"

const complianceStatus = {
  overall: 78,
  categories: [
    { name: "Data Protection", score: 92, status: "compliant" },
    { name: "AML/KYC", score: 85, status: "compliant" },
    { name: "Consumer Protection", score: 68, status: "attention" },
    { name: "CBK Licensing", score: 100, status: "compliant" },
    { name: "Cybersecurity", score: 45, status: "critical" },
  ],
}

const upcomingDeadlines = [
  {
    title: "Monthly AML Report",
    date: "Feb 10, 2026",
    daysLeft: 5,
    type: "report",
    priority: "high",
  },
  {
    title: "License Renewal Application",
    date: "Feb 28, 2026",
    daysLeft: 23,
    type: "application",
    priority: "medium",
  },
  {
    title: "Annual Compliance Audit",
    date: "Mar 15, 2026",
    daysLeft: 38,
    type: "audit",
    priority: "high",
  },
]

const regulatoryAlerts = [
  {
    id: 1,
    title: "New CBK Digital Lending Regulations",
    description: "Updated requirements for digital credit providers effective March 2026",
    date: "Feb 3, 2026",
    impact: "high",
    read: false,
  },
  {
    id: 2,
    title: "Data Protection Act Amendment",
    description: "Changes to consent requirements for financial data processing",
    date: "Feb 1, 2026",
    impact: "medium",
    read: false,
  },
  {
    id: 3,
    title: "Mobile Money Interoperability Guidelines",
    description: "CBK publishes final guidelines for cross-platform transactions",
    date: "Jan 28, 2026",
    impact: "low",
    read: true,
  },
]

const recentQueries = [
  {
    id: 1,
    query: "What are the KYC requirements for digital lending?",
    date: "2 hours ago",
  },
  {
    id: 2,
    query: "Consumer data protection obligations",
    date: "Yesterday",
  },
  {
    id: 3,
    query: "CBK reporting requirements for payment providers",
    date: "3 days ago",
  },
]

export default function StartupDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "text-secondary"
      case "attention":
        return "text-warning"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-secondary/10"
      case "attention":
        return "bg-warning/10"
      case "critical":
        return "bg-destructive/10"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, James</h1>
          <p className="text-muted-foreground">Track your compliance status and stay ahead of regulations</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/startup/compliance-query">
            <Search className="mr-2 h-4 w-4" />
            Ask Compliance Question
          </Link>
        </Button>
      </div>

      {/* Compliance Overview */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Compliance Score</CardTitle>
              <CardDescription>Overall regulatory compliance status</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-foreground">{complianceStatus.overall}%</p>
              <Badge variant="outline" className="mt-1 border-secondary/50 text-secondary">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5% this month
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {complianceStatus.categories.map((category) => (
              <div
                key={category.name}
                className={`rounded-lg p-4 ${getStatusBg(category.status)}`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-bold ${getStatusColor(category.status)}`}>
                    {category.score}%
                  </p>
                  {category.status === "compliant" ? (
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                  ) : category.status === "attention" ? (
                    <AlertCircle className="h-5 w-5 text-warning" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
                <Progress value={category.score} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Deadlines */}
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Upcoming Deadlines</CardTitle>
              <CardDescription>Don&apos;t miss these important dates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/startup/calendar">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    deadline.priority === "high" ? "bg-destructive/10" : "bg-warning/10"
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      deadline.priority === "high" ? "text-destructive" : "text-warning"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <Badge variant={deadline.daysLeft <= 7 ? "destructive" : "outline"}>
                    {deadline.daysLeft}d left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Alerts */}
        <Card className="lg:col-span-2 border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Regulatory Alerts
              </CardTitle>
              <CardDescription>Recent regulatory changes affecting your business</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/startup/monitor">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regulatoryAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                    alert.read ? "border-border/50" : "border-primary/50 bg-primary/5"
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    alert.impact === "high"
                      ? "bg-destructive/10 text-destructive"
                      : alert.impact === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{alert.title}</p>
                      {!alert.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{alert.date}</p>
                  </div>
                  <Badge variant={
                    alert.impact === "high" ? "destructive" : 
                    alert.impact === "medium" ? "secondary" : "outline"
                  }>
                    {alert.impact} impact
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Queries */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Common compliance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/startup/compliance-query">
                  <Search className="mr-2 h-4 w-4 text-primary" />
                  Ask Compliance Question
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/startup/checklists">
                  <ClipboardCheck className="mr-2 h-4 w-4 text-secondary" />
                  Generate Checklist
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/startup/gap-analysis">
                  <AlertTriangle className="mr-2 h-4 w-4 text-warning" />
                  Run Gap Analysis
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/startup/documents">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  View Documents
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card className="lg:col-span-2 border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Queries</CardTitle>
              <CardDescription>Your recent compliance questions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/startup/compliance-query">
                New query
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQueries.map((query) => (
                <Link
                  key={query.id}
                  href={`/startup/compliance-query/${query.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{query.query}</p>
                    <p className="text-sm text-muted-foreground">{query.date}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
