"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { usePolicyActions, usePolicies } from "@/hooks/use-policies"

const regulatoryAreas = [
  { value: "digital-lending", label: "Digital Lending" },
  { value: "mobile-money", label: "Mobile Money" },
  { value: "payments", label: "Payment Systems" },
  { value: "aml-kyc", label: "AML/KYC" },
  { value: "data-protection", label: "Data Protection" },
  { value: "consumer-protection", label: "Consumer Protection" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cryptocurrency", label: "Cryptocurrency/Virtual Assets" },
]

type PolicyListItem = {
  id: string
  title: string
  status: string
  regulatoryAreas?: unknown
  createdAt: Date | string
}

export default function PolicyGeneratorPage() {
  const [showResult, setShowResult] = useState(false)
  const [generatedPolicyId, setGeneratedPolicyId] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [area, setArea] = useState("")
  const [scenario, setScenario] = useState("")

  const { generate, isGenerating, generateError: apiError } = usePolicyActions()
  const { data: recentPolicies, isLoading: policiesLoading } = usePolicies({ page: 1, limit: 3 })
  const policies: PolicyListItem[] = Array.isArray(recentPolicies?.policies)
    ? (recentPolicies.policies as PolicyListItem[])
    : []

  const handleGenerate = async () => {
    setGenerateError(null)
    try {
      const result = await generate({
        title: query || `${area} Policy`,
        scenario: scenario || query,
        organizationType: "FINTECH",
        regulatoryAreas: area ? [area] : ["aml-kyc"],
      })
      setGeneratedPolicyId(result.policyId)
      setShowResult(true)
    } catch {
      setGenerateError(apiError || "Failed to generate policy. Please try again.")
    }
  }

  const resetForm = () => {
    setShowResult(false)
    setGeneratedPolicyId(null)
    setGenerateError(null)
    setQuery("")
    setArea("")
    setScenario("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Policy Generator</h1>
          <p className="text-muted-foreground">
            Generate comprehensive regulatory policies using AI analysis of Kenya&apos;s legal corpus
          </p>
        </div>
        <Button variant="outline" asChild className="bg-transparent">
          <Link href="/regulator/policy-generator/history">
            <Clock className="mr-2 h-4 w-4" />
            History
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {!showResult ? (
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Policy Query
                </CardTitle>
                <CardDescription>Describe the regulatory policy you need to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="query" className="text-foreground">Policy Question or Topic</Label>
                  <Textarea
                    id="query"
                    placeholder="E.g., What regulations should govern mobile money interoperability between different service providers in Kenya?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-24 bg-background"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-foreground">Regulatory Area</Label>
                    <Select value={area} onValueChange={setArea}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {regulatoryAreas.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-foreground">Priority Level</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High - Urgent</SelectItem>
                        <SelectItem value="medium">Medium - Standard</SelectItem>
                        <SelectItem value="low">Low - Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario" className="text-foreground">Scenario Description (Optional)</Label>
                  <Textarea
                    id="scenario"
                    placeholder="Provide additional context about the specific scenario or use case..."
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="min-h-20 bg-background"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-4">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    AI will analyze the legal corpus and attach citations to the completed policy record.
                  </p>
                </div>

                {generateError ? (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {generateError}
                  </div>
                ) : null}

                <Button
                  onClick={handleGenerate}
                  disabled={!query || isGenerating}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Policy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Policy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <Badge className="mb-2 w-fit bg-primary/10 text-primary">Generation queued</Badge>
                <CardTitle className="text-foreground">{query || `${area || "Regulatory"} policy`}</CardTitle>
                <CardDescription>
                  SheriaBot is preparing the policy record and will attach grounded citations when generation completes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Generation in progress</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Open the policy detail page to monitor completion, refine the policy, and export once content is ready.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {generatedPolicyId ? (
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={`/regulator/policy-generator/${generatedPolicyId}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Open Policy
                      </Link>
                    </Button>
                  ) : null}
                  <Button variant="outline" onClick={resetForm} className="bg-transparent">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Query
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Policies</CardTitle>
              <CardDescription>Your recent policy generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {policiesLoading ? (
                  <p className="py-4 text-sm text-muted-foreground">Loading policies...</p>
                ) : policies.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">No policy generations yet.</p>
                ) : policies.map((item) => (
                  <Link
                    key={item.id}
                    href={`/regulator/policy-generator/${item.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {Array.isArray(item.regulatoryAreas) ? item.regulatoryAreas.join(", ") : "Policy"} - {new Date(item.createdAt).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
