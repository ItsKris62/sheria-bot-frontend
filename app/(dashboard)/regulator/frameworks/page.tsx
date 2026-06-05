"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getErrorMessage, trpc } from "@/lib/trpc"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
} from "lucide-react"

const tierBadgeClass: Record<string, string> = {
  STARTUP: "border-secondary/50 text-secondary bg-secondary/10",
  BUSINESS: "border-primary/50 text-primary bg-primary/10",
  ENTERPRISE: "border-accent/50 text-accent bg-accent/10",
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function FrameworksPage() {
  const frameworksQuery = trpc.framework.list.useQuery()
  const frameworks = frameworksQuery.data ?? []
  const activeCount = frameworks.filter((framework) => framework.isActive).length
  const enterpriseCount = frameworks.filter((framework) => framework.tier === "ENTERPRISE").length
  const documentCount = frameworks.reduce((sum, framework) => sum + framework.documentCount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Framework Library</h1>
          <p className="mt-1 text-muted-foreground">
            Browse the regulatory frameworks available to your organization based on your plan.
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/regulator/frameworks/new">
            <Plus className="mr-2 h-4 w-4" />
            Custom Framework
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{frameworks.length}</p>
                <p className="text-sm text-muted-foreground">Visible Frameworks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{enterpriseCount}</p>
                <p className="text-sm text-muted-foreground">Enterprise</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documentCount}</p>
                <p className="text-sm text-muted-foreground">Corpus Docs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {frameworksQuery.isLoading ? (
        <div className="grid gap-4">
          {[0, 1, 2].map((item) => (
            <Card key={item} className="border-border/50">
              <CardContent className="p-6">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : frameworksQuery.isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h2 className="font-semibold text-foreground">Unable to load frameworks</h2>
              <p className="mt-1 text-sm text-muted-foreground">{getErrorMessage(frameworksQuery.error)}</p>
            </div>
          </CardContent>
        </Card>
      ) : frameworks.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="font-semibold text-foreground">No frameworks available</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Frameworks will appear here when they are active and available to your current plan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {frameworks.map((framework) => (
            <Card key={framework.id} className="group border-border/50 transition-all hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/regulator/frameworks/${framework.slug}`}
                            className="text-lg font-semibold text-foreground hover:text-primary"
                          >
                            {framework.name}
                          </Link>
                          <Badge variant="outline" className={tierBadgeClass[framework.tier] ?? "text-xs"}>
                            {framework.tier}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {framework.category}
                          </Badge>
                          {framework.version && (
                            <Badge variant="outline" className="text-xs">
                              v{framework.version}
                            </Badge>
                          )}
                        </div>
                        {framework.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{framework.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{framework.documentCount} corpus documents</span>
                          <span>{framework.isCustom ? "Custom" : "SheriaBot global"}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {formatDate(framework.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:justify-end">
                    <Button variant="outline" size="sm" className="bg-transparent" asChild>
                      <Link href={`/regulator/frameworks/${framework.slug}`}>
                        View
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed border-border/70 bg-muted/20">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">
            Custom frameworks are available on Enterprise plans. Custom framework creation is coming soon.
            Enterprise customers can contact SheriaBot to configure private frameworks.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
