"use client"

import { useAuthStore } from "@/lib/auth-store"
import { trpc } from "@/lib/trpc"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

type PolicyListItem = {
  id: string
  title: string | null
  status: string
  createdAt: Date | string
  user?: { fullName: string | null; email: string } | null
}

type QueryListItem = {
  id: string
  query: string
  createdAt: Date | string
  user?: { fullName: string | null; email: string } | null
}

export default function RegulatorDashboard() {
  const user = useAuthStore((state) => state.user)
  const displayName = user?.name?.split(" ")[0] ?? "there"

  const { data: policiesData, isLoading: policiesLoading, isError: policiesError } = trpc.policy.list.useQuery({
    page: 1,
    limit: 5,
  })
  const { data: historyData, isLoading: queriesLoading, isError: queriesError } = trpc.compliance.history.useQuery({
    page: 1,
    limit: 5,
  })

  const policies: PolicyListItem[] = Array.isArray(policiesData?.policies)
    ? (policiesData.policies as PolicyListItem[])
    : []
  const queries: QueryListItem[] = Array.isArray(historyData?.queries)
    ? (historyData.queries as QueryListItem[])
    : []

  const stats = [
    { title: "Policies", value: policiesData?.pagination?.total ?? 0, icon: FileText },
    { title: "Queries", value: historyData?.pagination?.total ?? 0, icon: Sparkles },
    { title: "Completed Policies", value: policies.filter((p) => p.status === "COMPLETED").length, icon: CheckCircle2 },
    { title: "Generating", value: policies.filter((p) => p.status === "GENERATING").length, icon: Clock },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}</h1>
          <p className="text-muted-foreground">Live regulatory workspace activity from SheriaBot</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/regulator/policy-generator">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Policy
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline">Live</Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Policy Queue</CardTitle>
              <CardDescription>Generated policies available to review or refine</CardDescription>
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
              {policiesLoading ? (
                <>
                  <Skeleton className="h-[74px] rounded-lg" />
                  <Skeleton className="h-[74px] rounded-lg" />
                  <Skeleton className="h-[74px] rounded-lg" />
                </>
              ) : policiesError ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Could not load policy queue.</p>
              ) : policies.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No generated policies yet.</p>
              ) : policies.map((policy) => (
                <Link
                  key={policy.id}
                  href={`/regulator/policy-generator/${policy.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground">{policy.title ?? "Untitled policy"}</p>
                    <p className="text-sm text-muted-foreground">
                      {policy.user?.fullName ?? policy.user?.email ?? "Policy user"}
                    </p>
                  </div>
                  <Badge variant={policy.status === "COMPLETED" ? "secondary" : "outline"}>
                    {policy.status.replace(/_/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Regulator Deadlines</CardTitle>
            <CardDescription>Connected deadline feed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-center">
              <Calendar className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No regulator deadline feed is connected yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Query Activity</CardTitle>
            <CardDescription>Recent compliance questions in this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {queriesLoading ? (
                <>
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                </>
              ) : queriesError ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Could not load query activity.
                </div>
              ) : queries.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No compliance query activity yet.</p>
              ) : queries.map((query) => (
                <Link key={query.id} href={`/startup/compliance-query/${query.id}`} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-sm text-foreground">
                      <span className="font-medium">Query:</span> {query.query}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {query.user?.fullName ?? query.user?.email ?? "Team member"} - {new Date(query.createdAt).toLocaleDateString("en-KE")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

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
