"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Bell,
  Mail,
  MessageSquare,
  AlertTriangle,
  FileText,
  Calendar,
  CreditCard,
  ClipboardCheck,
  BookOpen,
  Upload,
  Shield,
  UserCircle,
  LifeBuoy,
  Megaphone,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "@/hooks/use-toast"
import { useCategoryPreferences, useUpdateCategoryPreference } from "@/hooks/use-notifications"

type CategoryName = "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM"

const CATEGORY_META: Record<CategoryName, { label: string; desc: string; Icon: React.ElementType }> = {
  SECURITY:   { label: "Security",   desc: "Password changes, login alerts, and security events",            Icon: Shield },
  COMPLIANCE: { label: "Compliance", desc: "Checklists, gap analyses, policy documents",                     Icon: ClipboardCheck },
  DOCUMENTS:  { label: "Documents",  desc: "Vault uploads, deletions, and document activity",                Icon: FileText },
  ACCOUNT:    { label: "Account",    desc: "Profile changes, organization updates, subscription events",     Icon: UserCircle },
  SUPPORT:    { label: "Support",    desc: "Support ticket creation and status updates",                     Icon: LifeBuoy },
  SYSTEM:     { label: "System",     desc: "Platform announcements and maintenance notices",                 Icon: Megaphone },
}

import React from "react"

interface CategoryPref {
  id: string;
  userId: string;
  category: CategoryName;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

export default function NotificationSettingsPage() {
  // Existing DB-backed email/channel preferences
  const { data: prefs, isLoading } = trpc.user.getNotificationPreferences.useQuery()

  // Per-category in-app/email preferences
  const { data: categoryPrefs, isLoading: isCategoryLoading } = useCategoryPreferences()
  const updateCategoryPref = useUpdateCategoryPreference()

  const updateMutation = trpc.user.updateNotificationPreferences.useMutation({
    onSuccess: () => toast({ title: "Preferences saved" }),
    onError: (error) => toast({ title: error.message || "Failed to save preferences", variant: "destructive" }),
  })

  function toggle(field: string, value: boolean | string) {
    updateMutation.mutate({ [field]: value } as Parameters<typeof updateMutation.mutate>[0])
  }

  const loadingRows = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>
    ))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">Manage how you receive notifications and alerts</p>
      </div>

      <div className="grid gap-6">
        {/* General Email Notifications */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Email Notifications
            </CardTitle>
            <CardDescription>Configure email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? loadingRows(4)
              : (
                <>
                  {[
                    {
                      icon: AlertTriangle,
                      title: "Regulatory Updates",
                      desc: "Get notified about new regulations and changes",
                      field: "regulatoryUpdates",
                      value: prefs?.regulatoryUpdates ?? true,
                    },
                    {
                      icon: Calendar,
                      title: "Deadline Reminders",
                      desc: "Receive reminders for upcoming compliance deadlines",
                      field: "deadlineReminders",
                      value: prefs?.deadlineReminders ?? true,
                    },
                    {
                      icon: FileText,
                      title: "Report Ready",
                      desc: "Get notified when reports and analyses are complete",
                      field: "reportReady",
                      value: prefs?.reportReady ?? true,
                    },
                    {
                      icon: MessageSquare,
                      title: "Support Responses",
                      desc: "Receive email when support replies to your tickets",
                      field: "supportResponses",
                      value: prefs?.supportResponses ?? true,
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.field} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={item.value}
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

        {/* Specific Email Alerts (DB-backed — unchanged) */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Specific Email Alerts
            </CardTitle>
            <CardDescription>Control which activity-triggered emails you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? loadingRows(4)
              : (
                <>
                  {[
                    {
                      icon: CreditCard,
                      title: "Payment Due Reminders",
                      desc: "Receive reminders before your subscription payment is due",
                      field: "paymentDueReminder",
                      value: prefs?.paymentDueReminder ?? true,
                    },
                    {
                      icon: ClipboardCheck,
                      title: "Compliance Query Ready",
                      desc: "Get notified when your compliance query results are available",
                      field: "complianceQueryReady",
                      value: prefs?.complianceQueryReady ?? true,
                    },
                    {
                      icon: BookOpen,
                      title: "Policy Document Ready",
                      desc: "Get notified when a generated policy document is ready",
                      field: "policyDocumentReady",
                      value: prefs?.policyDocumentReady ?? true,
                    },
                    {
                      icon: Upload,
                      title: "Document Ingestion Complete",
                      desc: "Get notified when a document you uploaded has been processed",
                      field: "documentIngestionComplete",
                      value: prefs?.documentIngestionComplete ?? true,
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.field} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={item.value}
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
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              In-App Notifications
            </CardTitle>
            <CardDescription>Configure in-app notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? loadingRows(1)
              : (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Real-time Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Show notifications for important updates in real-time
                    </p>
                  </div>
                  <Switch
                    checked={prefs?.realTimeAlerts ?? true}
                    disabled={updateMutation.isPending}
                    onCheckedChange={(v) => toggle("realTimeAlerts", v)}
                  />
                </div>
              )}
          </CardContent>
        </Card>

        {/* Email Digest */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Digest
            </CardTitle>
            <CardDescription>Configure summary email preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? loadingRows(4)
              : (
                <>
                  {/* Master toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Email Digest</p>
                      <p className="text-sm text-muted-foreground">Receive periodic summary emails</p>
                    </div>
                    <Switch
                      checked={prefs?.emailDigestEnabled ?? false}
                      disabled={updateMutation.isPending}
                      onCheckedChange={(v) => toggle("emailDigestEnabled", v)}
                    />
                  </div>

                  {/* Frequency options — greyed out when digest is disabled */}
                  {(["daily", "weekly", "monthly"] as const).map((freq) => {
                    const labels: Record<string, string> = {
                      daily: "Daily Digest",
                      weekly: "Weekly Digest",
                      monthly: "Monthly Digest",
                    }
                    const isSelected = (prefs?.digestFrequency ?? "weekly") === freq
                    const digestEnabled = prefs?.emailDigestEnabled ?? false
                    return (
                      <div
                        key={freq}
                        className={`flex items-center justify-between p-4 rounded-lg bg-muted/30 transition-opacity ${
                          !digestEnabled ? "opacity-40 pointer-events-none" : ""
                        }`}
                      >
                        <p className="font-medium text-foreground">{labels[freq]}</p>
                        <Switch
                          checked={isSelected}
                          disabled={updateMutation.isPending || !digestEnabled}
                          onCheckedChange={() => {
                            if (!isSelected) toggle("digestFrequency", freq)
                          }}
                        />
                      </div>
                    )
                  })}
                </>
              )}
          </CardContent>
        </Card>
        {/* In-App Notifications by Category */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              In-App Notifications
            </CardTitle>
            <CardDescription>Control which categories appear in your notification bell</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCategoryLoading
              ? loadingRows(6)
              : (Object.keys(CATEGORY_META) as CategoryName[]).map((cat) => {
                  const meta = CATEGORY_META[cat]
                  const Icon = meta.Icon
                  const pref = (categoryPrefs as CategoryPref[] | undefined)?.find((p) => p.category === cat)
                  const isEnabled = pref?.inAppEnabled ?? true
                  const isSecurity = cat === "SECURITY"

                  const switchEl = (
                    <Switch
                      checked={isEnabled}
                      disabled={isSecurity || updateCategoryPref.isPending}
                      onCheckedChange={(v) => {
                        updateCategoryPref.mutate(
                          { category: cat, inAppEnabled: v },
                          { onError: (e) => toast({ title: e.message || "Failed to save", variant: "destructive" }) }
                        )
                      }}
                    />
                  )

                  return (
                    <div key={cat} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{meta.label}</p>
                          <p className="text-sm text-muted-foreground">{meta.desc}</p>
                        </div>
                      </div>
                      {isSecurity ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{switchEl}</span>
                            </TooltipTrigger>
                            <TooltipContent>Security notifications cannot be disabled</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : switchEl}
                    </div>
                  )
                })}
          </CardContent>
        </Card>

        {/* Email Notifications by Category */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Notifications by Category
            </CardTitle>
            <CardDescription>Control which categories send you email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCategoryLoading
              ? loadingRows(6)
              : (Object.keys(CATEGORY_META) as CategoryName[]).map((cat) => {
                  const meta = CATEGORY_META[cat]
                  const Icon = meta.Icon
                  const pref = (categoryPrefs as CategoryPref[] | undefined)?.find((p) => p.category === cat)
                  const isEnabled = pref?.emailEnabled ?? (cat !== "SYSTEM")

                  return (
                    <div key={cat} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{meta.label}</p>
                          <p className="text-sm text-muted-foreground">{meta.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        disabled={updateCategoryPref.isPending}
                        onCheckedChange={(v) => {
                          updateCategoryPref.mutate(
                            { category: cat, emailEnabled: v },
                            { onError: (e) => toast({ title: e.message || "Failed to save", variant: "destructive" }) }
                          )
                        }}
                      />
                    </div>
                  )
                })}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
