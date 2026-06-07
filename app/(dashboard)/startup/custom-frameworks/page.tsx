"use client"

import Link from "next/link"
import { useState } from "react"
import { AlertCircle, ArrowRight, Layers3, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { getErrorMessage, trpc } from "@/lib/trpc"

type FrameworkStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })
}

export default function CustomFrameworksPage() {
  const [status, setStatus] = useState<FrameworkStatus | "ALL">("ALL")
  const [name, setName] = useState("")
  const [jurisdiction, setJurisdiction] = useState("")
  const [regulator, setRegulator] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  const query = trpc.customFramework.list.useQuery(status === "ALL" ? undefined : { status })
  const create = trpc.customFramework.create.useMutation({
    onSuccess: async () => {
      toast.success("Custom framework created")
      setName("")
      setJurisdiction("")
      setRegulator("")
      setCategory("")
      setDescription("")
      await query.refetch()
    },
    onError: (error) => toast.error("Create failed", { description: getErrorMessage(error) }),
  })

  const frameworks = query.data ?? []

  return (
    <FeatureGate
      feature="customFrameworks"
      fallback={<LockedFeatureCard feature="customFrameworks" title="Custom frameworks are available on Enterprise plans." />}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Custom Frameworks</h1>
            <p className="mt-1 text-muted-foreground">Build private organization-scoped controls and compliance checklists.</p>
          </div>
          <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-4">
            <div className="flex w-full max-w-xs">
              <Select value={status} onValueChange={(value) => setStatus(value as FrameworkStatus | "ALL")}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {query.isLoading ? (
              <Card className="border-border/50">
                <CardContent className="p-6 text-sm text-muted-foreground">Loading frameworks...</CardContent>
              </Card>
            ) : query.isError ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="flex gap-3 p-6">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-muted-foreground">{getErrorMessage(query.error)}</p>
                </CardContent>
              </Card>
            ) : frameworks.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-6 text-sm text-muted-foreground">No custom frameworks match this filter.</CardContent>
              </Card>
            ) : (
              frameworks.map((framework: any) => (
                <Card key={framework.id} className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Layers3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold text-foreground">{framework.name}</h2>
                            <Badge variant="outline">{framework.status}</Badge>
                            <Badge variant="outline">v{framework.version}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {[framework.jurisdiction, framework.regulator, framework.category].filter(Boolean).join(" · ") || "No metadata set"}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {framework._count?.sections ?? 0} sections · {framework._count?.controls ?? 0} controls · Updated {formatDate(framework.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/startup/custom-frameworks/${framework.id}`}>
                          Open
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Create Draft</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="framework-name">Name</Label>
                <Input id="framework-name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Input placeholder="Jurisdiction" value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)} />
                <Input placeholder="Regulator" value={regulator} onChange={(event) => setRegulator(event.target.value)} />
                <Input placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
              </div>
              <Textarea placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
              <Button
                className="w-full"
                disabled={create.isPending || name.trim().length < 2}
                onClick={() => create.mutate({
                  name,
                  jurisdiction: jurisdiction || null,
                  regulator: regulator || null,
                  category: category || null,
                  description: description || null,
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Framework
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </FeatureGate>
  )
}
