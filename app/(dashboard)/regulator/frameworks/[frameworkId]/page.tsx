"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Download,
  Share2,
  CheckCircle2,
  Circle,
  Layers,
  Clock,
  BookOpen,
} from "lucide-react"

const frameworkData = {
  id: "fw-001",
  name: "Digital Credit Provider Compliance Framework",
  description: "Comprehensive framework for DCP licensing and ongoing compliance requirements under the CBK Digital Credit Providers Regulations, 2024",
  status: "published",
  version: "2.0",
  lastUpdated: "2025-01-10",
  author: "CBK Policy Division",
  modules: [
    {
      id: "m1",
      name: "Licensing Requirements",
      description: "Initial licensing requirements for digital credit providers",
      requirements: [
        { id: "r1", text: "Submit completed application form to CBK", completed: true },
        { id: "r2", text: "Provide certified copy of certificate of incorporation", completed: true },
        { id: "r3", text: "Submit audited financial statements for past 3 years", completed: true },
        { id: "r4", text: "Provide comprehensive business plan", completed: true },
        { id: "r5", text: "Pay prescribed licensing fee", completed: true },
      ],
    },
    {
      id: "m2",
      name: "Capital Adequacy",
      description: "Minimum capital and financial requirements",
      requirements: [
        { id: "r6", text: "Maintain minimum paid-up capital of KES 10 million", completed: true },
        { id: "r7", text: "Capital must be fully paid and unencumbered", completed: true },
        { id: "r8", text: "Submit quarterly capital adequacy reports", completed: false },
      ],
    },
    {
      id: "m3",
      name: "Corporate Governance",
      description: "Board and management structure requirements",
      requirements: [
        { id: "r9", text: "Maintain board of at least 5 directors", completed: true },
        { id: "r10", text: "Majority of directors must be non-executive", completed: true },
        { id: "r11", text: "Appoint qualified CEO with 5+ years experience", completed: true },
        { id: "r12", text: "Establish Risk, Audit, and Credit committees", completed: false },
        { id: "r13", text: "Appoint dedicated Compliance Officer", completed: true },
      ],
    },
    {
      id: "m4",
      name: "Consumer Protection",
      description: "Customer protection and fair lending requirements",
      requirements: [
        { id: "r14", text: "Disclose all fees and charges before disbursement", completed: true },
        { id: "r15", text: "Provide 48-hour cooling-off period", completed: true },
        { id: "r16", text: "Implement clear complaint handling procedures", completed: false },
        { id: "r17", text: "Prohibit harassment in debt collection", completed: true },
      ],
    },
  ],
}

export default function FrameworkDetailPage() {
  const totalRequirements = frameworkData.modules.reduce(
    (sum, m) => sum + m.requirements.length, 0
  )
  const completedRequirements = frameworkData.modules.reduce(
    (sum, m) => sum + m.requirements.filter((r) => r.completed).length, 0
  )
  const overallProgress = (completedRequirements / totalRequirements) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link 
            href="/regulator/frameworks" 
            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Frameworks
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{frameworkData.name}</h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="border-secondary/50 text-secondary">
                  Published
                </Badge>
                <Badge variant="outline">v{frameworkData.version}</Badge>
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-muted-foreground">{frameworkData.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Updated {new Date(frameworkData.lastUpdated).toLocaleDateString("en-KE", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {frameworkData.modules.length} modules
        </span>
        <span>{totalRequirements} requirements</span>
        <span>By {frameworkData.author}</span>
      </div>

      {/* Overall Progress */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Overall Compliance Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedRequirements} of {totalRequirements} requirements met
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">{Math.round(overallProgress)}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={overallProgress} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Framework Modules</h2>
        {frameworkData.modules.map((module, index) => {
          const moduleCompleted = module.requirements.filter((r) => r.completed).length
          const moduleProgress = (moduleCompleted / module.requirements.length) * 100
          return (
            <Card key={module.id} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {moduleCompleted}/{module.requirements.length}
                    </p>
                    <p className="text-xs text-muted-foreground">complete</p>
                  </div>
                </div>
                <Progress value={moduleProgress} className="mt-3 h-1.5" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.requirements.map((req) => (
                    <div
                      key={req.id}
                      className={`flex items-start gap-3 rounded-lg p-2 ${
                        req.completed ? "bg-secondary/5" : "bg-muted/30"
                      }`}
                    >
                      {req.completed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${req.completed ? "text-muted-foreground" : "text-foreground"}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
