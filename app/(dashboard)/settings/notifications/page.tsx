"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Mail, MessageSquare, AlertTriangle, FileText, Calendar, Save, Loader2 } from "lucide-react"
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/use-notifications"
import { toast } from "@/hooks/use-toast"

export default function NotificationSettingsPage() {
  const { data: prefs, isLoading } = useNotificationPreferences()
  const updateMutation = useUpdateNotificationPreferences()

  const p = prefs as any

  function toggle(field: string, value: boolean) {
    updateMutation.mutate(
      { [field]: value } as any,
      { onSuccess: () => toast({ title: "Preferences saved" }) }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">Manage how you receive notifications and alerts</p>
      </div>

      <div className="grid gap-6">
        {/* Email Notifications */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Email Notifications</CardTitle>
            <CardDescription>Configure email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <Skeleton className="h-5 w-40" /><Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))
            ) : (
              <>
                {[
                  { icon: AlertTriangle, title: "Regulatory Updates", desc: "Get notified about new regulations and changes", field: "emailEnabled" },
                  { icon: Calendar, title: "Deadline Reminders", desc: "Receive reminders for upcoming compliance deadlines", field: "emailEnabled" },
                  { icon: FileText, title: "Report Ready", desc: "Get notified when reports and analyses are complete", field: "emailEnabled" },
                  { icon: MessageSquare, title: "Support Responses", desc: "Receive email when support replies to your tickets", field: "emailEnabled" },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={p?.emailEnabled ?? true}
                        disabled={updateMutation.isPending}
                        onCheckedChange={(v) => toggle(item.field, v)}
                      />
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>

        {/* In-App Notifications */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" />In-App Notifications</CardTitle>
            <CardDescription>Configure in-app notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <Skeleton className="h-5 w-40" /><Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Real-time Alerts</p>
                  <p className="text-sm text-muted-foreground">Show notifications for important updates in real-time</p>
                </div>
                <Switch
                  checked={p?.inAppEnabled ?? true}
                  disabled={updateMutation.isPending}
                  onCheckedChange={(v) => toggle("inAppEnabled", v)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Digest */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Email Digest</CardTitle>
            <CardDescription>Configure summary email preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <Skeleton className="h-5 w-40" /><Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Email Digest</p>
                    <p className="text-sm text-muted-foreground">Receive periodic summary emails</p>
                  </div>
                  <Switch
                    checked={p?.digestEnabled ?? true}
                    disabled={updateMutation.isPending}
                    onCheckedChange={(v) => toggle("digestEnabled", v)}
                  />
                </div>
                {[
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">{opt.label} Digest</p>
                    </div>
                    <Switch
                      checked={(p?.digestFrequency ?? "weekly") === opt.value}
                      disabled={updateMutation.isPending || !p?.digestEnabled}
                      onCheckedChange={() => toggle("digestFrequency", opt.value as any)}
                    />
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            className="bg-primary text-primary-foreground"
            disabled={updateMutation.isPending}
            onClick={() => toast({ title: "Preferences are auto-saved as you toggle" })}
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {updateMutation.isPending ? "Saving…" : "Saved"}
          </Button>
        </div>
      </div>
    </div>
  )
}
