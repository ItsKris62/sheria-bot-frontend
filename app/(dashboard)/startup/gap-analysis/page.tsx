"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Download,
  RefreshCw,
  Shield,
  Database,
  Users,
  Lock,
  Banknote,
} from "lucide-react"

const complianceAreas = [
  {
    id: "kyc-aml",
    name: "KYC/AML Compliance",
    icon: Users,
    score: 78,
    status: "partial",
    gaps: [
      { item: "Enhanced Due Diligence procedures", severity: "high", recommendation: "Implement EDD for high-risk customers" },
      { item: "PEP screening automation", severity: "medium", recommendation: "Integrate automated PEP database" },
    ],
    compliant: ["Customer identification", "Record keeping", "Suspicious transaction reporting"],
  },
  {
    id: "data-protection",
    name: "Data Protection",
    icon: Lock,
    score: 65,
    status: "partial",
    gaps: [
      { item: "Data Protection Impact Assessment", severity: "high", recommendation: "Conduct DPIA for all data processing" },
      { item: "Cross-border transfer safeguards", severity: "high", recommendation: "Implement SCCs for international transfers" },
      { item: "Data retention policy", severity: "medium", recommendation: "Define clear retention periods" },
    ],
    compliant: ["Privacy policy", "Consent management"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: Shield,
    score: 82,
    status: "partial",
    gaps: [
      { item: "Penetration testing frequency", severity: "medium", recommendation: "Increase to quarterly testing" },
    ],
    compliant: ["Encryption at rest", "Encryption in transit", "Access controls", "Incident response plan"],
  },
  {
    id: "capital-requirements",
    name: "Capital Requirements",
    icon: Banknote,
    score: 100,
    status: "compliant",
    gaps: [],
    compliant: ["Minimum capital KES 50M", "Capital adequacy ratio", "Liquidity requirements"],
  },
  {
    id: "operational",
    name: "Operational Compliance",
    icon: Database,
    score: 70,
    status: "partial",
    gaps: [
      { item: "Business continuity testing", severity: "medium", recommendation: "Conduct annual BCP drills" },
      { item: "Vendor risk assessment", severity: "high", recommendation: "Implement third-party risk framework" },
    ],
    compliant: ["Operational procedures", "Staff training records"],
  },
]

export default function GapAnalysisPage() {
  const [selectedFramework, setSelectedFramework] = useState("cbk-psp")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const overallScore = Math.round(
    complianceAreas.reduce((acc, area) => acc + area.score, 0) / complianceAreas.length
  )

  const totalGaps = complianceAreas.reduce((acc, area) => acc + area.gaps.length, 0)
  const highPriorityGaps = complianceAreas.reduce(
    (acc, area) => acc + area.gaps.filter((g) => g.severity === "high").length,
    0
  )

  const handleRunAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Identify compliance gaps and get actionable recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
            <SelectTrigger className="w-[200px] bg-muted/50">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cbk-psp">CBK PSP Guidelines</SelectItem>
              <SelectItem value="cbk-mobile-money">CBK Mobile Money</SelectItem>
              <SelectItem value="dpa-2019">Data Protection Act 2019</SelectItem>
              <SelectItem value="pocamla">POCAMLA</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRunAnalysis} disabled={isAnalyzing} className="bg-primary text-primary-foreground">
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
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
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliant Areas</p>
                <p className="text-2xl font-bold text-foreground">
                  {complianceAreas.filter((a) => a.status === "compliant").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
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
              <div className="p-3 rounded-lg bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-foreground">{highPriorityGaps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap Details</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {complianceAreas.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.id} className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base font-medium">{area.name}</CardTitle>
                      </div>
                      <Badge
                        variant={area.status === "compliant" ? "default" : "secondary"}
                        className={
                          area.status === "compliant"
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {area.status === "compliant" ? "Compliant" : "Gaps Found"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Compliance Score</span>
                        <span className="font-medium text-foreground">{area.score}%</span>
                      </div>
                      <Progress value={area.score} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{area.compliant.length} compliant items</span>
                        <span>{area.gaps.length} gaps identified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          {complianceAreas
            .filter((area) => area.gaps.length > 0)
            .map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.id} className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{area.name}</CardTitle>
                        <CardDescription>{area.gaps.length} gaps identified</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {area.gaps.map((gap, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-l-4 ${
                            gap.severity === "high"
                              ? "bg-destructive/5 border-l-destructive"
                              : "bg-warning/5 border-l-warning"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{gap.item}</p>
                              <p className="text-sm text-muted-foreground mt-1">{gap.recommendation}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                gap.severity === "high"
                                  ? "border-destructive text-destructive"
                                  : "border-warning text-warning"
                              }
                            >
                              {gap.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Priority Action Items</CardTitle>
              <CardDescription>
                Address these items to improve your compliance posture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAreas
                  .flatMap((area) =>
                    area.gaps.map((gap) => ({
                      ...gap,
                      area: area.name,
                    }))
                  )
                  .sort((a, b) => (a.severity === "high" ? -1 : 1))
                  .map((gap, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div
                        className={`p-2 rounded-full ${
                          gap.severity === "high" ? "bg-destructive/10" : "bg-warning/10"
                        }`}
                      >
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{gap.item}</p>
                          <Badge variant="outline" className="text-xs">
                            {gap.area}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{gap.recommendation}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
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
