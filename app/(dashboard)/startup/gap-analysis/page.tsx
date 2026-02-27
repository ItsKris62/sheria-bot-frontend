"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useGenerateReport } from "@/hooks/use-analytics"
import { toast } from "@/hooks/use-toast"

function StatSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="pt-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  )
}

export default function GapAnalysisPage() {
  const { data, isLoading, refetch, isFetching } = trpc.compliance.getGapAnalysis.useQuery()
  const generateReport = useGenerateReport()

  const gapData = data as any
  const areas: any[] = gapData?.areas ?? []
  const overallScore: number = gapData?.overallScore ?? 0
  const totalGaps: number = gapData?.totalGaps ?? areas.reduce((acc: number, a: any) => acc + (a.gaps?.length ?? 0), 0)
  const highGaps: number = gapData?.highGaps ?? areas.reduce((acc: number, a: any) =>
    acc + (a.gaps?.filter((g: any) => g.severity === "high" || g.severity === "CRITICAL").length ?? 0), 0)
  const compliantCount: number = areas.filter((a) => a.status === "compliant" || (a.gaps?.length ?? 0) === 0).length

  async function handleGenerateReport() {
    try {
      await generateReport.mutateAsync({} as any)
      toast({ title: "Report generated", description: "Your compliance report is ready." })
    } catch {
      toast({ title: "Failed to generate report", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">Identify compliance gaps and get actionable recommendations</p>
        </div>
        <Button onClick={() => refetch()} disabled={isFetching} className="bg-primary text-primary-foreground">
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Analyzing..." : "Refresh Analysis"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="text-3xl font-bold text-foreground">{overallScore}%</p>
                  </div>
                  <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress value={overallScore} className="mt-4 h-2" />
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10"><CheckCircle2 className="h-6 w-6 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compliant Areas</p>
                    <p className="text-2xl font-bold text-foreground">{compliantCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-warning/10"><AlertTriangle className="h-6 w-6 text-warning" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Gaps</p>
                    <p className="text-2xl font-bold text-foreground">{totalGaps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-destructive/10"><XCircle className="h-6 w-6 text-destructive" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold text-foreground">{highGaps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap Details</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 space-y-3">
                    <Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-full" /><Skeleton className="h-2 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : areas.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No compliance data yet. Run your first analysis.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {areas.map((area: any) => (
                <Card key={area.id ?? area.name} className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">{area.name ?? area.area}</CardTitle>
                      <Badge className={(area.gaps?.length ?? 0) === 0 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                        {(area.gaps?.length ?? 0) === 0 ? "Compliant" : "Gaps Found"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-medium text-foreground">{area.score ?? 0}%</span>
                      </div>
                      <Progress value={area.score ?? 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">{area.gaps?.length ?? 0} gaps identified</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          {isLoading ? <Skeleton className="h-32 w-full" /> :
            areas.filter((a: any) => (a.gaps?.length ?? 0) > 0).map((area: any) => (
              <Card key={area.id ?? area.name} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg">{area.name ?? area.area}</CardTitle>
                  <CardDescription>{area.gaps?.length ?? 0} gaps identified</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(area.gaps ?? []).map((gap: any, i: number) => (
                      <div key={i} className={`p-4 rounded-lg border-l-4 ${gap.severity === "high" || gap.severity === "CRITICAL" ? "bg-destructive/5 border-l-destructive" : "bg-warning/5 border-l-warning"}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{gap.item ?? gap.description ?? gap.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{gap.recommendation}</p>
                          </div>
                          <Badge variant="outline" className={gap.severity === "high" || gap.severity === "CRITICAL" ? "border-destructive text-destructive" : "border-warning text-warning"}>
                            {gap.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Priority Action Items</CardTitle>
              <CardDescription>Address these items to improve your compliance posture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                ) : (
                  areas
                    .flatMap((area: any) => (area.gaps ?? []).map((gap: any) => ({ ...gap, areaName: area.name ?? area.area })))
                    .sort((a: any, b: any) => (a.severity === "high" || a.severity === "CRITICAL" ? -1 : 1))
                    .map((gap: any, index: number) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                        <div className={`p-2 rounded-full ${gap.severity === "high" || gap.severity === "CRITICAL" ? "bg-destructive/10" : "bg-warning/10"}`}>
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{gap.item ?? gap.description ?? gap.title}</p>
                            <Badge variant="outline" className="text-xs">{gap.areaName}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{gap.recommendation}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleGenerateReport} disabled={generateReport.isPending}>
              {generateReport.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              Generate Report
            </Button>
            <Button className="bg-primary text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Export Action Plan
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
