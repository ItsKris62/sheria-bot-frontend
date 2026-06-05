"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { AlertCircle, ArrowLeft, BookOpen, Clock, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getErrorMessage, trpc } from "@/lib/trpc"

const tierBadgeClass: Record<string, string> = {
  STARTUP: "border-secondary/50 text-secondary bg-secondary/10",
  BUSINESS: "border-primary/50 text-primary bg-primary/10",
  ENTERPRISE: "border-accent/50 text-accent bg-accent/10",
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-KE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function FrameworkDetailPage() {
  const params = useParams<{ frameworkId: string }>()
  const slug = decodeURIComponent(params.frameworkId)
  const frameworkQuery = trpc.framework.getBySlug.useQuery({ slug }, { enabled: Boolean(slug) })
  const framework = frameworkQuery.data

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/regulator/frameworks"
          className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Frameworks
        </Link>
      </div>

      {frameworkQuery.isLoading ? (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="h-6 w-2/3 rounded bg-muted" />
            <div className="mt-4 h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
          </CardContent>
        </Card>
      ) : frameworkQuery.isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h1 className="font-semibold text-foreground">Unable to load framework</h1>
              <p className="mt-1 text-sm text-muted-foreground">{getErrorMessage(frameworkQuery.error)}</p>
            </div>
          </CardContent>
        </Card>
      ) : framework ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{framework.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={tierBadgeClass[framework.tier] ?? "text-xs"}>
                    {framework.tier}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {framework.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {framework.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {framework.description && (
                  <p className="mt-4 max-w-2xl text-muted-foreground">{framework.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Updated {formatDate(framework.updatedAt)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {framework.documentCount} corpus documents
            </span>
            <span>{framework.isCustom ? "Organization custom" : "SheriaBot global framework"}</span>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground">Framework Detail</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Detailed modules, requirements, version history, and private framework documents are not exposed from this library yet.
                Use this framework in Gap Analysis where your plan permits it.
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
