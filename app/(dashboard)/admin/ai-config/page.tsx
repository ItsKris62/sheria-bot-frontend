"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bot, Zap, Save, RefreshCw, CheckCircle2 } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

// AI-related SystemConfig keys we expose for editing
const AI_CONFIG_KEYS = [
  { key: "ai_daily_cost_limit",   label: "Daily Cost Limit (USD)",          type: "number", description: "Maximum estimated spend per day across all AI calls" },
  { key: "max_queries_per_hour",  label: "Max Queries / Hour (per user)",   type: "number", description: "Rate limit: how many compliance queries one user can run per hour" },
  { key: "max_policies_per_hour", label: "Max Policies / Hour (per user)",  type: "number", description: "Rate limit: how many policy documents one user can generate per hour" },
  { key: "session_timeout_hours", label: "Session Timeout (hours)",         type: "number", description: "How long a user session remains valid before re-authentication" },
]

export default function AIConfigPage() {
  const { data: sysConfig, isLoading } = trpc.admin.getSystemConfig.useQuery()
  const { data: aiUsage, isLoading: usageLoading } = trpc.admin.getAIUsageMetrics.useQuery({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
  const { data: checklistMetrics } = trpc.admin.getChecklistMetrics.useQuery()

  const updateMutation = trpc.admin.updateSystemConfig.useMutation({
    onSuccess: () => toast.success("AI configuration saved"),
    onError: (err) => toast.error(err.message),
  })

  // Local editable state — keyed by config key
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState(false)

  // Populate edits from loaded config
  useEffect(() => {
    if (!sysConfig) return
    const initial: Record<string, string> = {}
    for (const { key } of AI_CONFIG_KEYS) {
      const v = (sysConfig as Record<string, unknown>)[key]
      if (v !== undefined) initial[key] = String(v)
    }
    setEdits(initial)
    setDirty(false)
  }, [sysConfig])

  const handleChange = (key: string, value: string) => {
    setEdits((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSave = () => {
    const payload: Record<string, unknown> = {}
    for (const { key, type } of AI_CONFIG_KEYS) {
      if (edits[key] !== undefined) {
        payload[key] = type === "number" ? Number(edits[key]) : edits[key]
      }
    }
    updateMutation.mutate({ config: payload })
    setDirty(false)
  }

  const handleReset = () => {
    if (!sysConfig) return
    const initial: Record<string, string> = {}
    for (const { key } of AI_CONFIG_KEYS) {
      const v = (sysConfig as Record<string, unknown>)[key]
      if (v !== undefined) initial[key] = String(v)
    }
    setEdits(initial)
    setDirty(false)
    toast.info("Reset to saved values")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Rate limits, cost controls, and usage metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!dirty}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button
            className="bg-secondary hover:bg-[#007a50]"
            onClick={handleSave}
            disabled={!dirty || updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* AI Usage Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {usageLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : (
          [
            { label: "Queries (30d)",    value: aiUsage?.totalQueries ?? 0 },
            { label: "Policies (30d)",   value: aiUsage?.totalPolicies ?? 0 },
            { label: "Checklists (30d)", value: aiUsage?.totalChecklists ?? 0 },
            { label: "Gap Analyses (30d)", value: aiUsage?.totalGapAnalyses ?? 0 },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <Zap className="w-5 h-5 mx-auto text-warning mb-1" />
                <p className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Checklist Generation Metrics */}
      {checklistMetrics && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Checklist Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: "All-time attempted", value: checklistMetrics.alltime?.attempted ?? 0 },
              { label: "All-time succeeded", value: checklistMetrics.alltime?.succeeded ?? 0 },
              { label: "Today attempted",   value: checklistMetrics.today?.attempted ?? 0 },
              { label: "Today succeeded",   value: checklistMetrics.today?.succeeded ?? 0 },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rate Limit & Cost Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="w-4 h-4" /> Rate Limits & Cost Controls
          </CardTitle>
          <CardDescription>
            These values are persisted in SystemConfig and take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-5">
              {AI_CONFIG_KEYS.map(({ key, label, description }) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-gray-400">{description}</p>
                  </div>
                  <input
                    type="number"
                    className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    value={edits[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Info (read-only) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Active AI Models</CardTitle>
          <CardDescription>Read-only — change model IDs in src/config/ai.config.ts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: "Policy / Checklist", model: "claude-sonnet-4-6" },
              { label: "Compliance Queries", model: "claude-haiku-4-5-20251001" },
              { label: "Complex Analysis",   model: "claude-opus-4-6" },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                <p className="font-mono text-xs font-medium text-foreground">{m.model}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
