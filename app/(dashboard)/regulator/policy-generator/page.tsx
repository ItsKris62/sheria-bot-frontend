"use client"

import { useState } from "react"
import Link from "next/link"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  type EnterprisePolicyType,
  useEnterprisePolicies,
  useEnterprisePolicyActions,
} from "@/hooks/use-enterprise-policies"

const policyTypes: Array<{ value: EnterprisePolicyType; label: string; frameworks: string[] }> = [
  { value: "DATA_PROTECTION", label: "Data Protection", frameworks: ["Data Protection Act 2019"] },
  { value: "AML_CFT", label: "AML/CFT", frameworks: ["POCAMLA", "CBK Prudential Guidelines"] },
  { value: "IT_SECURITY", label: "IT Security", frameworks: ["CBK Cybersecurity Guidelines"] },
  { value: "CONSUMER_PROTECTION", label: "Consumer Protection", frameworks: ["CBK Consumer Protection Guidelines"] },
  { value: "CYBERSECURITY", label: "Cybersecurity", frameworks: ["Computer Misuse and Cybercrimes Act"] },
  { value: "CUSTOM", label: "Custom Enterprise Policy", frameworks: ["Kenya financial services regulatory corpus"] },
]

type EnterprisePolicyListItem = {
  id: string
  title: string
  status: string
  policyType: string
  regulatoryFrameworks?: string[]
  createdAt: Date | string
}

function PolicyGeneratorContent() {
  const [showResult, setShowResult] = useState(false)
  const [generatedPolicyId, setGeneratedPolicyId] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [policyType, setPolicyType] = useState<EnterprisePolicyType>("DATA_PROTECTION")
  const [description, setDescription] = useState("")

  const { createDraft, isCreating, createError } = useEnterprisePolicyActions()
  const { data: recentPolicies, isLoading: policiesLoading } = useEnterprisePolicies({ limit: 3 })
  const policies = ((recentPolicies?.items ?? []) as EnterprisePolicyListItem[])
  const selectedType = policyTypes.find((item) => item.value === policyType) ?? policyTypes[0]

  const handleGenerate = async () => {
    setGenerateError(null)
    try {
      const result = await createDraft({
        title: title.trim() || `${selectedType.label} Policy`,
        description: description.trim() || undefined,
        policyType,
        targetAudience: "All employees and accountable officers",
        organizationType: "FINTECH",
        regulatoryFrameworks: selectedType.frameworks,
        jurisdiction: "Kenya",
      })
      setGeneratedPolicyId(result.policyId)
      setShowResult(true)
    } catch {
      setGenerateError(createError || "Failed to start policy generation. Please try again.")
    }
  }

  const resetForm = () => {
    setShowResult(false)
    setGeneratedPolicyId(null)
    setGenerateError(null)
    setTitle("")
    setPolicyType("DATA_PROTECTION")
    setDescription("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Policy Generator</h1>
          <p className="text-muted-foreground">
            Generate structured compliance policies grounded in SheriaBot&apos;s legal corpus, with citations and review support.
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
                  Enterprise Policy Draft
                </CardTitle>
                <CardDescription>Choose the policy type and scope for the generated draft.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Policy Title</Label>
                  <Textarea
                    id="title"
                    placeholder="E.g., Data Protection and Privacy Governance Policy"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="min-h-20 bg-background"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="policy-type" className="text-foreground">Policy Type</Label>
                    <Select value={policyType} onValueChange={(value) => setPolicyType(value as EnterprisePolicyType)}>
                      <SelectTrigger id="policy-type" className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {policyTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Jurisdiction</Label>
                    <div className="flex h-10 items-center rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground">
                      Kenya
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Scope Notes</Label>
                  <Textarea
                    id="description"
                    placeholder="Add business context, operations covered, internal approval expectations, or implementation priorities."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-24 bg-background"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-4">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Enterprise generation creates a GeneratedPolicy record, queues the drafting pipeline, and tracks progress by status.
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
                  disabled={!title.trim() || isCreating}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Generation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Enterprise Policy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <Badge className="mb-2 w-fit bg-primary/10 text-primary">Generation queued</Badge>
                <CardTitle className="text-foreground">{title || `${selectedType.label} Policy`}</CardTitle>
                <CardDescription>
                  SheriaBot is drafting the policy. Open the detail page to monitor status and review generated sections.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Generation in progress</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The Enterprise policy pipeline will update progress as it outlines, drafts, and reviews the policy.
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
                    New Policy
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
              <CardDescription>Your recent Enterprise policy generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {policiesLoading ? (
                  <p className="py-4 text-sm text-muted-foreground">Loading policies...</p>
                ) : policies.length === 0 ? (
                  <p className="py-4 text-sm text-muted-foreground">No generated policies yet.</p>
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
                        {item.policyType.replace(/_/g, " ")} - {new Date(item.createdAt).toLocaleDateString("en-KE")}
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

export default function PolicyGeneratorPage() {
  return (
    <FeatureGate
      feature="policyGeneration"
      fallback={(
        <LockedFeatureCard
          feature="policyGeneration"
          requiredPlan="ENTERPRISE"
          title="AI Policy Generator is available on Enterprise plans."
          description="Generate structured compliance policies grounded in SheriaBot's legal corpus, with citations and review support."
        />
      )}
    >
      <PolicyGeneratorContent />
    </FeatureGate>
  )
}
