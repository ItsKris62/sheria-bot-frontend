"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Database, Server, Shield, Mail, AlertTriangle, Loader2 } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "@/hooks/use-toast"

export default function SystemSettingsPage() {
  const { data: health, isLoading: healthLoading } = trpc.admin.getDetailedHealth.useQuery()
  const { data: featureFlags, isLoading: flagsLoading } = trpc.admin.getFeatureFlags.useQuery()

  const updateFlagMutation = trpc.admin.updateFeatureFlag.useMutation({
    onSuccess: () => {
      utils.admin.getFeatureFlags.invalidate()
      toast({ title: "Feature flag updated" })
    },
  })
  const maintenanceMutation = trpc.admin.setMaintenanceMode.useMutation({
    onSuccess: () => toast({ title: "Maintenance mode updated" }),
  })

  const utils = trpc.useUtils()
  const [maintenancePending, setMaintenancePending] = useState(false)

  const h = health as any
  const flags = (featureFlags as any) ?? []

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
            <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" />System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Server</span>
                  <Badge className="bg-primary/10 text-primary">{h?.api ? "Healthy" : "Degraded"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <Badge className={h?.database ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}>
                    {h?.database ? "Connected" : "Error"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Service</span>
                  <Badge className={h?.ai ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                    {h?.ai ? "Operational" : "Degraded"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cache</span>
                  <Badge className={h?.cache ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}>
                    {h?.cache ? "Connected" : "Disconnected"}
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
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Feature Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {flagsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <Skeleton className="h-4 w-32" /><Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))
            ) : flags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feature flags configured</p>
            ) : (
              flags.map((flag: any) => (
                <div key={flag.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground text-sm">{flag.name}</p>
                    {flag.description && <p className="text-xs text-muted-foreground">{flag.description}</p>}
                  </div>
                  <Switch
                    checked={flag.enabled}
                    disabled={updateFlagMutation.isPending}
                    onCheckedChange={(enabled) =>
                      updateFlagMutation.mutate({ name: flag.name, enabled } as any)
                    }
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Email Config (read-only from env) */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Email Configuration</CardTitle>
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
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={h?.database ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}>
                {h?.database ? "Healthy" : "Error"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Provider</span>
              <span className="text-sm font-medium text-foreground">PostgreSQL (Prisma)</span>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2 border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enable maintenance mode to temporarily disable the platform. Users will see a maintenance page.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  disabled={maintenanceMutation.isPending}
                  onClick={() => maintenanceMutation.mutate({ enabled: true } as any)}
                >
                  {maintenanceMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Enable Maintenance Mode
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
