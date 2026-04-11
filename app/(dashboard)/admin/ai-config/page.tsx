"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { getErrorMessage, trpc } from "@/lib/trpc"
import { Bot, BrainCircuit, CheckCircle2, Eye, EyeOff, KeyRound, RefreshCw, Save, ShieldCheck, Zap } from "lucide-react"
import { toast } from "sonner"

const DEFAULT_MODELS = ["claude-sonnet-4-6", "claude-haiku-4-5-20251001", "claude-opus-4-6"]

type AIConfigView = {
  aiApiKey?: string
  aiApiKeyMasked?: string | null
  aiApiKeyConfigured?: boolean
  aiApiKeySource?: "system_config" | "environment" | "none"
  aiDailyCostLimit?: number
  aiPolicyModel?: string
  aiQueryModel?: string
  aiVerificationModel?: string
  aiComplexAnalysisModel?: string
  aiPolicyTemperature?: number
  aiQueryTemperature?: number
  availableAIModels?: string[]
  maxQueriesPerHour?: number
  maxPoliciesPerHour?: number
  sessionTimeoutHours?: number
}

type AIConfigForm = Required<Pick<AIConfigView,
  "aiDailyCostLimit" |
  "aiPolicyModel" |
  "aiQueryModel" |
  "aiVerificationModel" |
  "aiComplexAnalysisModel" |
  "aiPolicyTemperature" |
  "aiQueryTemperature" |
  "maxQueriesPerHour" |
  "maxPoliciesPerHour" |
  "sessionTimeoutHours"
>> & {
  aiApiKey: string
  aiApiKeyMasked: string | null
  aiApiKeyConfigured: boolean
  aiApiKeySource: "system_config" | "environment" | "none"
  availableAIModels: string[]
}

function normalizeModels(input?: string[]) {
  const unique = new Set((input ?? []).map((value) => value.trim()).filter(Boolean))
  return unique.size ? [...unique] : [...DEFAULT_MODELS]
}

function toForm(config: AIConfigView): AIConfigForm {
  return {
    aiApiKey: "",
    aiApiKeyMasked: config.aiApiKeyMasked ?? null,
    aiApiKeyConfigured: Boolean(config.aiApiKeyConfigured),
    aiApiKeySource: config.aiApiKeySource ?? "none",
    aiDailyCostLimit: config.aiDailyCostLimit ?? 500,
    aiPolicyModel: config.aiPolicyModel ?? DEFAULT_MODELS[0],
    aiQueryModel: config.aiQueryModel ?? DEFAULT_MODELS[1],
    aiVerificationModel: config.aiVerificationModel ?? DEFAULT_MODELS[1],
    aiComplexAnalysisModel: config.aiComplexAnalysisModel ?? DEFAULT_MODELS[2],
    aiPolicyTemperature: config.aiPolicyTemperature ?? 0.3,
    aiQueryTemperature: config.aiQueryTemperature ?? 0.5,
    availableAIModels: normalizeModels(config.availableAIModels),
    maxQueriesPerHour: config.maxQueriesPerHour ?? 50,
    maxPoliciesPerHour: config.maxPoliciesPerHour ?? 10,
    sessionTimeoutHours: config.sessionTimeoutHours ?? 8,
  }
}

function parseModelList(value: string) {
  return normalizeModels(value.split(/[\n,]/g))
}

function sourceLabel(source: AIConfigForm["aiApiKeySource"]) {
  if (source === "system_config") return "Stored override"
  if (source === "environment") return "Environment fallback"
  return "Not configured"
}

export default function AIConfigPage() {
  const utils = trpc.useUtils()
  const { data: sysConfig, isLoading } = trpc.admin.getSystemConfig.useQuery()
  const { data: aiUsage, isLoading: usageLoading } = trpc.admin.getAIUsageMetrics.useQuery({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
  const { data: checklistMetrics } = trpc.admin.getChecklistMetrics.useQuery()

  const [form, setForm] = useState<AIConfigForm | null>(null)
  const [dirty, setDirty] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeyDirty, setApiKeyDirty] = useState(false)

  const updateMutation = trpc.admin.updateSystemConfig.useMutation({
    onSuccess: async (updated) => {
      await utils.admin.getSystemConfig.invalidate()
      setForm(toForm(updated as AIConfigView))
      setDirty(false)
      setApiKeyDirty(false)
      setShowApiKey(false)
      toast.success("AI configuration saved")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  useEffect(() => {
    if (!sysConfig) return
    setForm(toForm(sysConfig as AIConfigView))
    setDirty(false)
    setApiKeyDirty(false)
  }, [sysConfig])

  const modelOptions = useMemo(() => normalizeModels(form?.availableAIModels), [form?.availableAIModels])

  function updateForm(patch: Partial<AIConfigForm>) {
    setForm((current) => current ? { ...current, ...patch } : current)
    setDirty(true)
  }

  function updateAvailableModels(rawValue: string) {
    const models = parseModelList(rawValue)
    setForm((current) => {
      if (!current) return current
      const primary = models[0] ?? DEFAULT_MODELS[0]
      const queryFallback = models.includes(DEFAULT_MODELS[1]) ? DEFAULT_MODELS[1] : primary
      const analysisFallback = models.includes(DEFAULT_MODELS[2]) ? DEFAULT_MODELS[2] : primary
      return {
        ...current,
        availableAIModels: models,
        aiPolicyModel: models.includes(current.aiPolicyModel) ? current.aiPolicyModel : primary,
        aiQueryModel: models.includes(current.aiQueryModel) ? current.aiQueryModel : queryFallback,
        aiVerificationModel: models.includes(current.aiVerificationModel) ? current.aiVerificationModel : queryFallback,
        aiComplexAnalysisModel: models.includes(current.aiComplexAnalysisModel) ? current.aiComplexAnalysisModel : analysisFallback,
      }
    })
    setDirty(true)
  }

  function handleReset() {
    if (!sysConfig) return
    setForm(toForm(sysConfig as AIConfigView))
    setDirty(false)
    setApiKeyDirty(false)
    setShowApiKey(false)
    toast.info("Reset to saved values")
  }

  function handleSave() {
    if (!form) return
    if (!form.availableAIModels.length) {
      toast.error("At least one AI model must remain available.")
      return
    }

    const payload: Record<string, unknown> = {
      aiDailyCostLimit: form.aiDailyCostLimit,
      aiPolicyModel: form.aiPolicyModel,
      aiQueryModel: form.aiQueryModel,
      aiVerificationModel: form.aiVerificationModel,
      aiComplexAnalysisModel: form.aiComplexAnalysisModel,
      aiPolicyTemperature: form.aiPolicyTemperature,
      aiQueryTemperature: form.aiQueryTemperature,
      availableAIModels: form.availableAIModels,
      maxQueriesPerHour: form.maxQueriesPerHour,
      maxPoliciesPerHour: form.maxPoliciesPerHour,
      sessionTimeoutHours: form.sessionTimeoutHours,
    }

    if (apiKeyDirty) payload.aiApiKey = form.aiApiKey.trim()
    updateMutation.mutate({ config: payload })
  }

  const metrics = [
    { label: "Queries (30d)", value: aiUsage?.totalQueries ?? 0 },
    { label: "Policies (30d)", value: aiUsage?.totalPolicies ?? 0 },
    { label: "Checklists (30d)", value: aiUsage?.totalChecklists ?? 0 },
    { label: "Gap Analyses (30d)", value: aiUsage?.totalGapAnalyses ?? 0 },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Configuration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live model routing, runtime credentials, rate limits, and budget controls.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!dirty || updateMutation.isPending}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button className="bg-secondary text-white hover:bg-secondary/90" onClick={handleSave} disabled={!dirty || updateMutation.isPending || !form}>
            <Save className="mr-2 h-4 w-4" /> {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {usageLoading ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-xl" />) : metrics.map((metric) => (
          <Card key={metric.label} className="border-border/50">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="rounded-lg bg-secondary/10 p-2 text-secondary"><Zap className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metric.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {checklistMetrics && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="h-4 w-4 text-primary" /> Checklist generation reliability</CardTitle>
            <CardDescription>Operational health snapshot for checklist generation throughput.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["All-time attempted", checklistMetrics.alltime?.attempted ?? 0],
              ["All-time succeeded", checklistMetrics.alltime?.succeeded ?? 0],
              ["Today attempted", checklistMetrics.today?.attempted ?? 0],
              ["Today succeeded", checklistMetrics.today?.succeeded ?? 0],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-border/50 bg-muted/40 p-4 text-center">
                <p className="text-xl font-semibold text-foreground">{Number(value).toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4 text-primary" /> Runtime credentials & model routing</CardTitle>
            <CardDescription>Changes apply immediately to policy generation, compliance queries, citation verification, and analysis workflows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading || !form ? <Skeleton className="h-72 w-full rounded-xl" /> : <>
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Anthropic API key</p>
                    <p className="text-xs text-muted-foreground">Leave the field blank to keep the current secret. Saving an empty value after clearing removes the stored override.</p>
                  </div>
                  <Badge variant="outline" className="w-fit border-secondary/40 text-secondary">{sourceLabel(form.aiApiKeySource)}</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder={form.aiApiKeyConfigured ? (form.aiApiKeyMasked ?? "Configured") : "sk-ant-..."}
                    value={form.aiApiKey}
                    onChange={(e) => {
                      updateForm({ aiApiKey: e.target.value })
                      setApiKeyDirty(true)
                    }}
                  />
                  <Button variant="outline" size="icon" onClick={() => setShowApiKey((value) => !value)}>
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>Active secret: {form.aiApiKeyConfigured ? form.aiApiKeyMasked : "Not configured"}</span>
                  {form.aiApiKeySource === "system_config" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-xs text-secondary hover:text-secondary/80"
                      onClick={() => {
                        updateForm({ aiApiKey: "" })
                        setApiKeyDirty(true)
                      }}
                    >
                      Clear stored override
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available AI models</Label>
                <Input value={form.availableAIModels.join(", ")} onChange={(e) => updateAvailableModels(e.target.value)} />
                <p className="text-xs text-muted-foreground">Comma-separated allow-list exposed in the admin panel. Selected runtime models must exist here.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Policy & checklist model", "aiPolicyModel"],
                  ["Compliance query model", "aiQueryModel"],
                  ["Citation verification model", "aiVerificationModel"],
                  ["Complex analysis model", "aiComplexAnalysisModel"],
                ].map(([label, key]) => (
                  <div key={String(key)} className="space-y-2">
                    <Label>{label}</Label>
                    <Select value={form[key as keyof AIConfigForm] as string} onValueChange={(value) => updateForm({ [key]: value } as Partial<AIConfigForm>)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((model) => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-border/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <Label>Policy temperature</Label>
                    <span className="font-medium text-foreground">{form.aiPolicyTemperature.toFixed(2)}</span>
                  </div>
                  <Slider value={[form.aiPolicyTemperature]} min={0} max={1} step={0.05} onValueChange={([value]) => updateForm({ aiPolicyTemperature: value ?? 0 })} />
                  <p className="text-xs text-muted-foreground">Lower values keep policy and checklist outputs more deterministic.</p>
                </div>
                <div className="space-y-3 rounded-xl border border-border/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <Label>Query temperature</Label>
                    <span className="font-medium text-foreground">{form.aiQueryTemperature.toFixed(2)}</span>
                  </div>
                  <Slider value={[form.aiQueryTemperature]} min={0} max={1} step={0.05} onValueChange={([value]) => updateForm({ aiQueryTemperature: value ?? 0 })} />
                  <p className="text-xs text-muted-foreground">Slightly higher values can improve conversational flexibility for compliance Q&A.</p>
                </div>
              </div>
            </>}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" /> Usage limits & guardrails</CardTitle>
            <CardDescription>Enterprise-safe defaults for cost ceilings, throughput, and session exposure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isLoading || !form ? <Skeleton className="h-72 w-full rounded-xl" /> : <>
              {[
                ["Daily cost limit (USD)", "aiDailyCostLimit", "Maximum estimated AI spend allowed each day across the platform."],
                ["Max queries / hour / user", "maxQueriesPerHour", "Rate-limits compliance question throughput per user."],
                ["Max policies / hour / user", "maxPoliciesPerHour", "Prevents policy generation abuse and runaway token consumption."],
                ["Session timeout (hours)", "sessionTimeoutHours", "Administrative safeguard for how long sessions remain valid before re-authentication."],
              ].map(([label, key, description]) => (
                <div key={String(key)} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    type="number"
                    min={0}
                    step={key === "aiDailyCostLimit" ? "1" : "1"}
                    value={form[key as keyof AIConfigForm] as number}
                    onChange={(e) => updateForm({ [key]: Number(e.target.value) } as Partial<AIConfigForm>)}
                  />
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              ))}

              <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><BrainCircuit className="h-4 w-4 text-secondary" /> Active runtime summary</div>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div><p className="text-xs text-muted-foreground">Policy / Checklist</p><p className="font-medium text-foreground">{form.aiPolicyModel}</p></div>
                  <div><p className="text-xs text-muted-foreground">Queries / Verification</p><p className="font-medium text-foreground">{form.aiQueryModel} / {form.aiVerificationModel}</p></div>
                  <div><p className="text-xs text-muted-foreground">Complex analysis</p><p className="font-medium text-foreground">{form.aiComplexAnalysisModel}</p></div>
                  <div><p className="text-xs text-muted-foreground">Budget guardrail</p><p className="font-medium text-foreground">${form.aiDailyCostLimit.toLocaleString()} / day</p></div>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground"><Bot className="h-4 w-4 text-primary" /> Operational guidance</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Use Sonnet-class models for policies/checklists, Haiku for queries/verification, and Opus for complex analysis.</li>
                  <li>Keep the allow-list narrow to prevent accidental promotion of unvetted model IDs.</li>
                  <li>Store a runtime override only when you need live rotation without restarting the backend.</li>
                </ul>
              </div>
            </>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
