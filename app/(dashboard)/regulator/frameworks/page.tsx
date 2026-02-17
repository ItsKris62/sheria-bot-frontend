"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Layers,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Trash2,
  Copy,
  ArrowRight,
} from "lucide-react"

const frameworks = [
  {
    id: "fw-001",
    name: "Digital Credit Provider Compliance Framework",
    description: "Comprehensive framework for DCP licensing and ongoing compliance",
    status: "published",
    version: "2.0",
    modules: 8,
    completedModules: 8,
    lastUpdated: "2025-01-10",
    usageCount: 45,
  },
  {
    id: "fw-002",
    name: "AML/CFT Risk Assessment Framework",
    description: "Risk-based approach to anti-money laundering compliance",
    status: "published",
    version: "1.5",
    modules: 6,
    completedModules: 6,
    lastUpdated: "2024-12-15",
    usageCount: 32,
  },
  {
    id: "fw-003",
    name: "Mobile Money Operator Framework",
    description: "Regulatory requirements for mobile money services",
    status: "draft",
    version: "0.8",
    modules: 10,
    completedModules: 7,
    lastUpdated: "2025-01-08",
    usageCount: 0,
  },
  {
    id: "fw-004",
    name: "Data Protection Compliance Framework",
    description: "Framework aligned with Kenya's Data Protection Act 2019",
    status: "under_review",
    version: "1.0",
    modules: 5,
    completedModules: 5,
    lastUpdated: "2024-12-20",
    usageCount: 12,
  },
]

const statusConfig = {
  published: { label: "Published", className: "border-secondary/50 text-secondary bg-secondary/10" },
  draft: { label: "Draft", className: "border-muted-foreground/50 text-muted-foreground bg-muted/30" },
  under_review: { label: "Under Review", className: "border-accent/50 text-accent bg-accent/10" },
}

export default function FrameworksPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Frameworks</h1>
          <p className="mt-1 text-muted-foreground">
            Build and manage regulatory compliance frameworks for fintech entities
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/regulator/frameworks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Framework
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{frameworks.length}</p>
                <p className="text-sm text-muted-foreground">Total Frameworks</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {frameworks.filter((f) => f.status === "published").length}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {frameworks.filter((f) => f.status === "draft" || f.status === "under_review").length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {frameworks.reduce((sum, f) => sum + f.usageCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Uses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frameworks List */}
      <div className="grid gap-4">
        {frameworks.map((framework) => {
          const status = statusConfig[framework.status as keyof typeof statusConfig]
          const progress = (framework.completedModules / framework.modules) * 100
          return (
            <Card key={framework.id} className="group border-border/50 transition-all hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/regulator/frameworks/${framework.id}`}
                            className="text-lg font-semibold text-foreground hover:text-primary"
                          >
                            {framework.name}
                          </Link>
                          <Badge variant="outline" className={status.className}>
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">v{framework.version}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{framework.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{framework.modules} modules</span>
                          <span>{framework.usageCount} times used</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {new Date(framework.lastUpdated).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    {framework.status === "draft" && (
                      <div className="w-full lg:w-48">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="mt-1 h-2" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent" asChild>
                        <Link href={`/regulator/frameworks/${framework.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent" asChild>
                        <Link href={`/regulator/frameworks/${framework.id}?edit=true`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Copy className="mr-1 h-3 w-3" />
                        Clone
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
