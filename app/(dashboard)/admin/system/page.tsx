"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings, Database, Server, Shield, Mail, AlertTriangle, Loader2, Save,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

interface SystemConfigValues {
  maintenanceMode: boolean
  maintenanceMessage: string
  maxFileUploadMB: number
  maxQueriesPerHour: number
  maxPoliciesPerHour: number
  allowNewRegistrations: boolean
  requireEmailVerification: boolean
  defaultSubscriptionTier: string
  supportEmail: string
  [key: string]: unknown
}

const CONFIG_GROUPS: { label: string; icon: React.ElementType; keys: (keyof SystemConfigValues)[] }[] = [
  {
    label: "Limits",
    icon: Shield,
    keys: ["maxFileUploadMB", "maxQueriesPerHour", "maxPoliciesPerHour"],
  },
  {
    label: "Registration",
    icon: Settings,
    keys: ["allowNewRegistrations", "requireEmailVerification", "defaultSubscriptionTier"],
  },
  {
    label: "Contact",
    icon: Mail,
    keys: ["supportEmail"],
  },
]

const CONFIG_LABELS: Record<string, string> = {
  maintenanceMode: "Maintenance Mode",
  maintenanceMessage: "Maintenance Message",
  maxFileUploadMB: "Max File Upload (MB)",
  maxQueriesPerHour: "Max Queries / Hour",
  maxPoliciesPerHour: "Max Policies / Hour",
  allowNewRegistrations: "Allow New Registrations",
  requireEmailVerification: "Require Email Verification",
  defaultSubscriptionTier: "Default Subscription Tier",
  supportEmail: "Support Email",
}

function configInputType(key: string): "boolean" | "number" | "text" {
  if (["maintenanceMode", "allowNewRegistrations", "requireEmailVerification"].includes(key)) return "boolean"
  if (["maxFileUploadMB", "maxQueriesPerHour", "maxPoliciesPerHour"].includes(key)) return "number"
  return "text"
}

export default function SystemSettingsPage() {
  const utils = trpc.useUtils()

  const { data: health, isLoading: healthLoading } = trpc.admin.getDetailedHealth.useQuery()
  const { data: featureFlagsData, isLoading: flagsLoading } = trpc.admin.getFeatureFlags.useQuery()
  const { data: systemConfigData, isLoading: configLoading } = trpc.admin.getSystemConfig.useQuery()

  const updateFlagMutation = trpc.admin.updateFeatureFlag.useMutation({
    onSuccess: () => {
      void utils.admin.getFeatureFlags.invalidate()
      toast.success("Feature flag updated")
    },
    onError: (err) => toast.error(err.message),
  })

  const updateConfigMutation = trpc.admin.updateSystemConfig.useMutation({
    onSuccess: () => {
      void utils.admin.getSystemConfig.invalidate()
      toast.success("Configuration saved")
      setDirty(false)
    },
    onError: (err) => toast.error(err.message),
  })

  const maintenanceMutation = trpc.admin.setMaintenanceMode.useMutation({
    onSuccess: () => {
      void utils.admin.getSystemConfig.invalidate()
      toast.success("Maintenance mode updated")
    },
    onError: (err) => toast.error(err.message),
  })

  // Local editable state for SystemConfig
  const [localConfig, setLocalConfig] = useState<Partial<SystemConfigValues>>({})
  const [dirty, setDirty] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState("")

  useEffect(() => {
    if (systemConfigData) {
      setLocalConfig(systemConfigData as SystemConfigValues)
      setDirty(false)
    }
  }, [systemConfigData])

  function handleConfigChange(key: string, value: unknown) {
    setLocalConfig((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  function handleSave() {
    updateConfigMutation.mutate({ config: localConfig as Record<string, unknown> })
  }

  function handleReset() {
    if (systemConfigData) {
      setLocalConfig(systemConfigData as SystemConfigValues)
      setDirty(false)
    }
  }

  // Feature flags: backend returns Record<string, boolean>
  const featureFlagEntries: { name: string; enabled: boolean }[] = featureFlagsData
    ? Object.entries(featureFlagsData as Record<string, boolean>)
        .filter(([, v]) => typeof v === "boolean")
        .map(([name, enabled]) => ({ name, enabled }))
    : []

  const h = health as {
    api?: boolean
    database?: boolean
    ai?: boolean
    cache?: boolean
    uptime?: number
  } | undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-1">Platform configuration and maintenance</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Status */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Server</span>
                  <Badge className="bg-primary/10 text-primary">{h?.api !== false ? "Healthy" : "Degraded"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <Badge className={h?.database !== false ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}>
                    {h?.database !== false ? "Connected" : "Error"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Service</span>
                  <Badge className={h?.ai !== false ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-700"}>
                    {h?.ai !== false ? "Operational" : "Degraded"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cache</span>
                  <Badge className={h?.cache !== false ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-700"}>
                    {h?.cache !== false ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium text-foreground">
                    {h?.uptime ? `${Math.floor(h.uptime / 3600)}h ${Math.floor((h.uptime % 3600) / 60)}m` : "—"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />Feature Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flagsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <Skeleton className="h-4 w-36" /><Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))
            ) : featureFlagEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feature flags configured</p>
            ) : (
              featureFlagEntries.map(({ name, enabled }) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <p className="font-medium text-foreground text-sm capitalize">
                    {name.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <Switch
                    checked={enabled}
                    disabled={updateFlagMutation.isPending}
                    onCheckedChange={(val) =>
                      updateFlagMutation.mutate({ flag: name, enabled: val })
                    }
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />System Configuration
              </CardTitle>
              <div className="flex items-center gap-2">
                {dirty && (
                  <Button variant="ghost" size="sm" onClick={handleReset} disabled={updateConfigMutation.isPending}>
                    Reset
                  </Button>
                )}
                <Button
                  size="sm"
                  className="bg-[#00875A] hover:bg-[#007a50] text-white"
                  onClick={handleSave}
                  disabled={!dirty || updateConfigMutation.isPending}
                >
                  {updateConfigMutation.isPending
                    ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    : <Save className="h-4 w-4 mr-2" />
                  }
                  Save Changes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {configLoading ? (
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {CONFIG_GROUPS.map(({ label, icon: Icon, keys }) => (
                  <div key={label} className="space-y-4">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-border/50">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{label}</h3>
                    </div>
                    {keys.map((key) => {
                      const inputType = configInputType(key as string)
                      const currentValue = localConfig[key as string]
                      return (
                        <div key={key as string} className="space-y-1.5">
                          <Label className="text-xs">{CONFIG_LABELS[key as string] ?? key}</Label>
                          {inputType === "boolean" ? (
                            <div className="flex items-center gap-2 h-9">
                              <Switch
                                checked={!!currentValue}
                                onCheckedChange={(val) => handleConfigChange(key as string, val)}
                              />
                              <span className="text-sm text-muted-foreground">
                                {currentValue ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          ) : (
                            <Input
                              type={inputType}
                              value={currentValue as string | number ?? ""}
                              onChange={(e) =>
                                handleConfigChange(
                                  key as string,
                                  inputType === "number" ? Number(e.target.value) : e.target.value
                                )
                              }
                              className="bg-muted/50 h-9 text-sm"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Config (read-only from env) */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Input readOnly value="Resend" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input readOnly defaultValue="noreply@sheriabot.co.ke" className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={h?.database !== false ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}>
                {h?.database !== false ? "Healthy" : "Error"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Provider</span>
              <span className="text-sm font-medium text-foreground">PostgreSQL (Prisma)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Host</span>
              <span className="text-sm font-medium text-foreground">Supabase</span>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2 border-l-4 border-l-yellow-400">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable maintenance mode to temporarily disable the platform for all non-admin users.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Maintenance Message (shown to users)</Label>
                  <Textarea
                    placeholder="We're performing scheduled maintenance. We'll be back shortly."
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    className="bg-muted/50 text-sm resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="bg-transparent border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                    disabled={maintenanceMutation.isPending}
                    onClick={() => maintenanceMutation.mutate({ enabled: true, message: maintenanceMessage || undefined })}
                  >
                    {maintenanceMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Enable Maintenance
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent text-muted-foreground"
                    disabled={maintenanceMutation.isPending}
                    onClick={() => maintenanceMutation.mutate({ enabled: false })}
                  >
                    Disable Maintenance
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
