"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { AlertCircle, Archive, ArrowLeft, CheckCircle2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { getErrorMessage, trpc } from "@/lib/trpc"

export default function CustomFrameworkDetailPage() {
  const params = useParams<{ frameworkId: string }>()
  const frameworkId = params.frameworkId
  const [sectionTitle, setSectionTitle] = useState("")
  const [controlTitle, setControlTitle] = useState("")
  const [requirement, setRequirement] = useState("")
  const [severity, setSeverity] = useState("")

  const query = trpc.customFramework.get.useQuery({ id: frameworkId }, { enabled: Boolean(frameworkId) })
  const versions = trpc.customFramework.getVersionHistory.useQuery({ id: frameworkId }, { enabled: Boolean(frameworkId) })
  const createSection = trpc.customFramework.createSection.useMutation({
    onSuccess: async () => {
      toast.success("Section added")
      setSectionTitle("")
      await query.refetch()
    },
    onError: (error) => toast.error("Section failed", { description: getErrorMessage(error) }),
  })
  const createControl = trpc.customFramework.createControl.useMutation({
    onSuccess: async () => {
      toast.success("Control added")
      setControlTitle("")
      setRequirement("")
      setSeverity("")
      await query.refetch()
    },
    onError: (error) => toast.error("Control failed", { description: getErrorMessage(error) }),
  })
  const publish = trpc.customFramework.publish.useMutation({
    onSuccess: async () => {
      toast.success("Framework published")
      await query.refetch()
      await versions.refetch()
    },
    onError: (error) => toast.error("Publish failed", { description: getErrorMessage(error) }),
  })
  const archive = trpc.customFramework.archive.useMutation({
    onSuccess: async () => {
      toast.success("Framework archived")
      await query.refetch()
    },
    onError: (error) => toast.error("Archive failed", { description: getErrorMessage(error) }),
  })

  const framework = query.data as any
  const isDraft = framework?.status === "DRAFT"

  return (
    <FeatureGate
      feature="customFrameworks"
      fallback={<LockedFeatureCard feature="customFrameworks" title="Custom frameworks are available on Enterprise plans." />}
    >
      <div className="flex flex-col gap-6">
        <Link href="/startup/custom-frameworks" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Custom Frameworks
        </Link>

        {query.isLoading ? (
          <Card className="border-border/50">
            <CardContent className="p-6 text-sm text-muted-foreground">Loading framework...</CardContent>
          </Card>
        ) : query.isError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-muted-foreground">{getErrorMessage(query.error)}</p>
            </CardContent>
          </Card>
        ) : framework ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{framework.name}</h1>
                  <Badge variant="outline">{framework.status}</Badge>
                  <Badge variant="outline">v{framework.version}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {[framework.jurisdiction, framework.regulator, framework.category].filter(Boolean).join(" · ") || "Private organization framework"}
                </p>
              </div>
              <div className="flex gap-2">
                {isDraft && (
                  <Button onClick={() => publish.mutate({ id: framework.id })} disabled={publish.isPending}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                )}
                {framework.status !== "ARCHIVED" && (
                  <Button variant="outline" onClick={() => archive.mutate({ id: framework.id })} disabled={archive.isPending}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="flex flex-col gap-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Sections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(framework.sections ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sections yet.</p>
                    ) : (
                      framework.sections.map((section: any) => (
                        <div key={section.id} className="rounded-lg border border-border/50 p-3">
                          <p className="font-medium text-foreground">{section.title}</p>
                          {section.description && <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(framework.controls ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No controls yet.</p>
                    ) : (
                      framework.controls.map((control: any) => (
                        <div key={control.id} className="rounded-lg border border-border/50 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-foreground">{control.title}</p>
                            {control.severity && <Badge variant="outline">{control.severity}</Badge>}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{control.requirement}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4">
                {isDraft && (
                  <>
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base">Add Section</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input placeholder="Section title" value={sectionTitle} onChange={(event) => setSectionTitle(event.target.value)} />
                        <Button className="w-full" disabled={sectionTitle.trim().length < 2 || createSection.isPending} onClick={() => createSection.mutate({ frameworkId, title: sectionTitle, order: framework.sections?.length ?? 0 })}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Section
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="text-base">Add Control</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input value={controlTitle} onChange={(event) => setControlTitle(event.target.value)} />
                        </div>
                        <Textarea placeholder="Requirement" value={requirement} onChange={(event) => setRequirement(event.target.value)} />
                        <Input placeholder="Severity" value={severity} onChange={(event) => setSeverity(event.target.value)} />
                        <Button
                          className="w-full"
                          disabled={controlTitle.trim().length < 2 || requirement.trim().length < 2 || createControl.isPending}
                          onClick={() => createControl.mutate({
                            frameworkId,
                            title: controlTitle,
                            requirement,
                            severity: severity || null,
                            order: framework.controls?.length ?? 0,
                          })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Control
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Version History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(versions.data ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No published snapshots yet.</p>
                    ) : (
                      (versions.data ?? []).map((version: any) => (
                        <div key={version.id} className="flex items-center justify-between rounded-lg border border-border/50 p-2 text-sm">
                          <span>Version {version.version}</span>
                          <span className="text-muted-foreground">{new Date(version.createdAt).toLocaleDateString("en-KE")}</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </FeatureGate>
  )
}
