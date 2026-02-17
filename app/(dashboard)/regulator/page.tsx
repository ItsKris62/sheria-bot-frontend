"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Calendar,
} from "lucide-react"

const stats = [
  {
    title: "Policies Generated",
    value: "124",
    change: "+12%",
    trend: "up",
    description: "This month",
    icon: FileText,
  },
  {
    title: "AI Queries",
    value: "1,847",
    change: "+23%",
    trend: "up",
    description: "This month",
    icon: Sparkles,
  },
  {
    title: "Active Users",
    value: "89",
    change: "+5%",
    trend: "up",
    description: "Across departments",
    icon: Users,
  },
  {
    title: "Avg Response Time",
    value: "2.3s",
    change: "-15%",
    trend: "down",
    description: "Per query",
    icon: Clock,
  },
]

const pendingReviews = [
  {
    id: 1,
    title: "Digital Credit Provider Licensing Framework",
    status: "pending",
    assignee: "Policy Team",
    deadline: "Feb 10, 2026",
    priority: "high",
  },
  {
    id: 2,
    title: "Cryptocurrency Trading Guidelines",
    status: "in_review",
    assignee: "Dr. Grace Mutua",
    deadline: "Feb 15, 2026",
    priority: "medium",
  },
  {
    id: 3,
    title: "Consumer Protection Amendments",
    status: "pending",
    assignee: "Legal Affairs",
    deadline: "Feb 20, 2026",
    priority: "low",
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Policy generated",
    title: "Mobile Money Interoperability Guidelines",
    time: "2 hours ago",
    user: "James Kimani",
    type: "success",
  },
  {
    id: 2,
    action: "Document uploaded",
    title: "CBK Prudential Guidelines 2026",
    time: "4 hours ago",
    user: "System",
    type: "info",
  },
  {
    id: 3,
    action: "Review completed",
    title: "AML/KYC Requirements Update",
    time: "Yesterday",
    user: "Dr. Grace Mutua",
    type: "success",
  },
  {
    id: 4,
    action: "Alert triggered",
    title: "International regulation change detected",
    time: "Yesterday",
    user: "AI Monitor",
    type: "warning",
  },
]

const upcomingDeadlines = [
  { title: "Quarterly Compliance Report", date: "Feb 28, 2026", type: "report" },
  { title: "Stakeholder Consultation", date: "Mar 5, 2026", type: "meeting" },
  { title: "Policy Review Cycle", date: "Mar 15, 2026", type: "review" },
]

export default function RegulatorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Dr. Mutua</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your regulatory work</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/regulator/policy-generator">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Policy
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="outline" 
                  className={stat.trend === "up" ? "border-secondary/50 text-secondary" : "border-primary/50 text-primary"}
                >
                  <TrendingUp className={`mr-1 h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Reviews */}
        <Card className="lg:col-span-2 border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Pending Reviews</CardTitle>
              <CardDescription>Policy documents awaiting your review</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/regulator/policy-generator/history">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    review.priority === "high"
                      ? "bg-destructive/10 text-destructive"
                      : review.priority === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{review.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned to {review.assignee} • Due {review.deadline}
                    </p>
                  </div>
                  <Badge variant={review.status === "in_review" ? "secondary" : "outline"}>
                    {review.status === "in_review" ? "In Review" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Deadlines</CardTitle>
            <CardDescription>Important dates to remember</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    activity.type === "success"
                      ? "bg-secondary/10 text-secondary"
                      : activity.type === "warning"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {activity.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : activity.type === "warning" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.action}:</span> {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/regulator/policy-generator">
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  Generate New Policy
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/regulator/legal-corpus">
                  <BookOpen className="mr-2 h-4 w-4 text-secondary" />
                  Browse Legal Corpus
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/regulator/analytics">
                  <TrendingUp className="mr-2 h-4 w-4 text-accent" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start bg-transparent">
                <Link href="/regulator/collaboration">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  Team Workspace
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
