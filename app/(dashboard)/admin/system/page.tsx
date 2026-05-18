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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  securityAlertEmail: string
  sessionTimeoutHours: number
  resourceUsageAlertThreshold: number
  webhookFailureAlertThreshold: number
  passwordMinLength: number
  automatedBackupsEnabled: boolean
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
  {
    label: "Security",
    icon: Shield,
    keys: ["securityAlertEmail", "sessionTimeoutHours", "passwordMinLength"],
  },
  {
    label: "Alerts",
    icon: AlertTriangle,
    keys: ["resourceUsageAlertThreshold", "webhookFailureAlertThreshold", "automatedBackupsEnabled"],
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
  securityAlertEmail: "Security Alert Email",
  sessionTimeoutHours: "Session Timeout (Hours)",
  resourceUsageAlertThreshold: "Resource Alert Threshold (%)",
  webhookFailureAlertThreshold: "Webhook Failure Threshold",
  passwordMinLength: "Min Password Length",
  automatedBackupsEnabled: "Automated Backups",
}

function configInputType(key: string): "boolean" | "number" | "text" {
  if (["maintenanceMode", "allowNewRegistrations", "requireEmailVerification", "automatedBackupsEnabled"].includes(key)) return "boolean"
  if (["maxFileUploadMB", "maxQueriesPerHour", "maxPoliciesPerHour", "resourceUsageAlertThreshold", "webhookFailureAlertThreshold", "sessionTimeoutHours", "passwordMinLength"].includes(key)) return "number"
  return "text"
}

type ServiceStatus = "healthy" | "degraded" | "down" | "unknown"

interface ServiceHealth {
  status?: string
  latencyMs?: number
  message?: string
}

function normalizeStatus(status?: string): ServiceStatus {
  if (status === "healthy" || status === "degraded" || status === "down") return status
  return "unknown"
}

function statusBadgeClass(status: ServiceStatus): string {
  if (status === "healthy") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
  if (status === "degraded") return "bg-amber-500/10 text-amber-700 border-amber-500/20"
  if (status === "down") return "bg-destructive/10 text-destructive border-destructive/20"
  return "bg-muted text-muted-foreground border-border"
}

function statusLabel(status: ServiceStatus): string {
  if (status === "healthy") return "Healthy"
  if (status === "degraded") return "Degraded"
  if (status === "down") return "Down"
  return "Unknown"
}

function serviceDetail(service?: ServiceHealth): string | null {
  if (!service) return null
  if (typeof service.latencyMs === "number") return `${service.latencyMs} ms`
  return service.message ?? null
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
      void utils.admin.getFeatureFlags.invalidate()
      void utils.admin.getDetailedHealth.invalidate()
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
      setMaintenanceMessage(String((systemConfigData as Partial<SystemConfigValues>).maintenanceMessage ?? ""))
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
    status?: "healthy" | "degraded" | "down"
    services?: {
      database?: ServiceHealth
      redis?: ServiceHealth
      pinecone?: ServiceHealth
      storage?: ServiceHealth
    }
    uptime?: number
    version?: string
    checkedAt?: string | Date
  } | undefined

  const systemStatus = normalizeStatus(h?.status)
  const dbStatus = normalizeStatus(h?.services?.database?.status)
  const redisStatus = normalizeStatus(h?.services?.redis?.status)
  const pineconeStatus = normalizeStatus(h?.services?.pinecone?.status)
  const storageStatus = normalizeStatus(h?.services?.storage?.status)
  const checkedAt = h?.checkedAt ? new Date(h.checkedAt).toLocaleString() : null

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
                  <Badge className={statusBadgeClass(systemStatus)}>{statusLabel(systemStatus)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <div className="flex items-center gap-2">
                    {serviceDetail(h?.services?.database) && (
                      <span className="text-xs text-muted-foreground">{serviceDetail(h?.services?.database)}</span>
                    )}
                    <Badge className={statusBadgeClass(dbStatus)}>{statusLabel(dbStatus)}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI / Vector DB</span>
                  <div className="flex items-center gap-2">
                    {serviceDetail(h?.services?.pinecone) && (
                      <span className="text-xs text-muted-foreground">{serviceDetail(h?.services?.pinecone)}</span>
                    )}
                    <Badge className={statusBadgeClass(pineconeStatus)}>{statusLabel(pineconeStatus)}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cache</span>
                  <div className="flex items-center gap-2">
                    {serviceDetail(h?.services?.redis) && (
                      <span className="text-xs text-muted-foreground">{serviceDetail(h?.services?.redis)}</span>
                    )}
                    <Badge className={statusBadgeClass(redisStatus)}>{statusLabel(redisStatus)}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <div className="flex items-center gap-2">
                    {serviceDetail(h?.services?.storage) && (
                      <span className="text-xs text-muted-foreground">{serviceDetail(h?.services?.storage)}</span>
                    )}
                    <Badge className={statusBadgeClass(storageStatus)}>{statusLabel(storageStatus)}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium text-foreground">
                    {h?.uptime ? `${Math.floor(h.uptime / 3600)}h ${Math.floor((h.uptime % 3600) / 60)}m` : "-"}
                  </span>
                </div>
                {checkedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Check</span>
                    <span className="text-xs font-medium text-muted-foreground">{checkedAt}</span>
                  </div>
                )}
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
                  className="bg-secondary hover:bg-secondary/90 text-white"
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
                          ) : key === "defaultSubscriptionTier" ? (
                            <Select
                              value={String(currentValue ?? "starter")}
                              onValueChange={(val) => handleConfigChange(key as string, val)}
                            >
                              <SelectTrigger className="bg-muted/50 h-9 text-sm">
                                <SelectValue placeholder="Select tier" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="starter">Starter</SelectItem>
                                <SelectItem value="STARTUP">Startup</SelectItem>
                                <SelectItem value="BUSINESS">Business</SelectItem>
                                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
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
              <Badge className={statusBadgeClass(dbStatus)}>{statusLabel(dbStatus)}</Badge>
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
