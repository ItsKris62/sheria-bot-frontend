"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/lib/trpc"
import { AlertTriangle, Bell, Clock, ExternalLink, Filter, Newspaper, Search, TrendingUp } from "lucide-react"

type AlertItem = {
  id: string
  title: string
  summary: string
  sourceUrl: string | null
  regulatoryBody: string
  category: string
  severity: string
  publishedAt: Date | string | null
}

const severityClass: Record<string, string> = {
  CRITICAL: "border-destructive/50 text-destructive",
  HIGH: "border-destructive/50 text-destructive",
  MEDIUM: "border-accent/50 text-accent",
  LOW: "border-muted-foreground/50 text-muted-foreground",
}

export default function IntelligenceFeedPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const { data, isLoading, isError } = trpc.alert.getAlerts.useQuery({
    page: 1,
    limit: 50,
  })

  const alerts: AlertItem[] = Array.isArray(data?.alerts) ? (data.alerts as AlertItem[]) : []
  const categories = useMemo(
    () => Array.from(new Set(alerts.map((item) => item.category).filter(Boolean))).sort(),
    [alerts],
  )

  const filteredAlerts = alerts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regulatoryBody.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesSeverity = severityFilter === "all" || item.severity === severityFilter
    return matchesSearch && matchesCategory && matchesSeverity
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Intelligence Feed</h1>
          <p className="mt-1 text-muted-foreground">Published regulatory alerts from the live alert service</p>
        </div>
        <Button variant="outline" className="bg-transparent" asChild>
          <Link href="/dashboard/alerts">
            <Bell className="mr-2 h-4 w-4" />
            Alert Inbox
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                <p className="text-sm text-muted-foreground">Published Updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {alerts.filter((item) => item.severity === "HIGH" || item.severity === "CRITICAL").length}
                </p>
                <p className="text-sm text-muted-foreground">High Impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search regulatory updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-[220px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[152px] rounded-lg" />
            <Skeleton className="h-[152px] rounded-lg" />
            <Skeleton className="h-[152px] rounded-lg" />
          </>
        ) : isError ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive/60" />
              <p className="mt-4 text-muted-foreground">Could not load intelligence updates.</p>
            </CardContent>
          </Card>
        ) : filteredAlerts.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No live updates match your criteria.</p>
            </CardContent>
          </Card>
        ) : filteredAlerts.map((item) => (
          <Card key={item.id} className="border-border/50 transition-all hover:border-primary/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{item.category.replace(/_/g, " ")}</Badge>
                    <Badge variant="outline" className={severityClass[item.severity] ?? severityClass.LOW}>
                      {item.severity.toLowerCase()} impact
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.summary}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.regulatoryBody}</span>
                    {item.publishedAt ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.publishedAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                      </span>
                    ) : null}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 bg-transparent" asChild>
                  <Link href={item.sourceUrl || `/dashboard/alerts/${item.id}`} target={item.sourceUrl ? "_blank" : undefined}>
                    Read More
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
