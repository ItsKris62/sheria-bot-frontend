"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Loader2,
  Volume2,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { useCategoryPreferences, useUpdateCategoryPreference } from "@/hooks/use-notifications"
import { useAuthStore } from "@/lib/auth-store"

type CategoryName = "SECURITY" | "COMPLIANCE" | "DOCUMENTS" | "ACCOUNT" | "SUPPORT" | "SYSTEM"

const CATEGORY_META: Record<CategoryName, { label: string; desc: string; Icon: React.ElementType }> = {
  SECURITY:   { label: "Security",   desc: "Password changes, login alerts, and security events",            Icon: Shield },
  COMPLIANCE: { label: "Compliance", desc: "Checklists, gap analyses, policy documents",                     Icon: ClipboardCheck },
  DOCUMENTS:  { label: "Documents",  desc: "Vault uploads, deletions, and document activity",                Icon: FileText },
  ACCOUNT:    { label: "Account",    desc: "Profile changes, organization updates, subscription events",     Icon: UserCircle },
  SUPPORT:    { label: "Support",    desc: "Support ticket creation and status updates",                     Icon: LifeBuoy },
  SYSTEM:     { label: "System",     desc: "Platform announcements and maintenance notices",                 Icon: Megaphone },
}

// --- Alert subscription constants --------------------------------------------

const REGULATORY_BODIES = ["CBK", "CMA", "ODPC", "CA", "GAZETTE"] as const
const ALERT_CATEGORIES = ["PRUDENTIAL", "DATA_PROTECTION", "AML_CFT", "LICENSING", "CAPITAL_MARKETS", "GENERAL"] as const
const CATEGORY_LABELS: Record<string, string> = {
  PRUDENTIAL: "Prudential",
  DATA_PROTECTION: "Data Protection",
  AML_CFT: "AML / CFT",
  LICENSING: "Licensing",
  CAPITAL_MARKETS: "Capital Markets",
  GENERAL: "General",
}

type SubState = {
  inAppEnabled: boolean
  emailEnabled: boolean
  emailFrequency: "REALTIME" | "DAILY" | "WEEKLY"
  severityThreshold: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  regulatoryBodies: Array<(typeof REGULATORY_BODIES)[number]>
  categories: Array<(typeof ALERT_CATEGORIES)[number]>
}

const DEFAULT_SUB: SubState = {
  inAppEnabled: true,
  emailEnabled: false,
  emailFrequency: "DAILY",
  severityThreshold: "LOW",
  regulatoryBodies: [...REGULATORY_BODIES],
  categories: [...ALERT_CATEGORIES],
}

function AlertSubscriptionSection() {
  const orgId = useAuthStore((s) => s.user?.organizationId)
  const [form, setForm] = useState<SubState>(DEFAULT_SUB)
  const [isDirty, setIsDirty] = useState(false)

  const { data: sub, isLoading } = trpc.alert.getSubscription.useQuery(undefined, {
    enabled: !!orgId,
  })

  useEffect(() => {
    if (!sub) return
    const s = sub as SubState & { regulatoryBodies: string[]; categories: string[] }
    setForm({
      inAppEnabled: s.inAppEnabled,
      emailEnabled: s.emailEnabled,
      emailFrequency: s.emailFrequency as SubState["emailFrequency"],
      severityThreshold: s.severityThreshold as SubState["severityThreshold"],
      regulatoryBodies: s.regulatoryBodies ?? [...REGULATORY_BODIES],
      categories: s.categories ?? [...ALERT_CATEGORIES],
    })
    setIsDirty(false)
  }, [sub])

  const utils = trpc.useUtils()
  const saveMutation = trpc.alert.upsertSubscription.useMutation({
    onSuccess: () => {
      toast.success("Alert subscription saved")
      utils.alert.getSubscription.invalidate()
      setIsDirty(false)
    },
    onError: (e) => toast.error(e.message || "Failed to save subscription"),
  })

  function patch(updates: Partial<SubState>) {
    setForm((prev) => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  function toggleBody(body: (typeof REGULATORY_BODIES)[number]) {
    const next = form.regulatoryBodies.includes(body)
      ? form.regulatoryBodies.filter((b) => b !== body)
      : [...form.regulatoryBodies, body]
    patch({ regulatoryBodies: next })
  }

  function toggleCategory(cat: (typeof ALERT_CATEGORIES)[number]) {
    const next = form.categories.includes(cat)
      ? form.categories.filter((c) => c !== cat)
      : [...form.categories, cat]
    patch({ categories: next })
  }

  if (!orgId) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Regulatory Alert Subscriptions
          </CardTitle>
          <CardDescription>
            An organisation account is required to configure alert subscriptions.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Regulatory Alert Subscriptions
        </CardTitle>
        <CardDescription>
          Choose which regulatory bodies and categories notify your organisation, and how.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <>
            {/* Delivery toggles */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Delivery channels</p>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground text-sm">In-app notifications</p>
                  <p className="text-xs text-muted-foreground">Show alerts in your notification bell</p>
                </div>
                <Switch
                  checked={form.inAppEnabled}
                  onCheckedChange={(v) => patch({ inAppEnabled: v })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground text-sm">Email notifications</p>
                  <p className="text-xs text-muted-foreground">Receive regulatory alerts by email</p>
                </div>
                <Switch
                  checked={form.emailEnabled}
                  onCheckedChange={(v) => patch({ emailEnabled: v })}
                />
              </div>

              {form.emailEnabled && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground text-sm">Email frequency</p>
                    <p className="text-xs text-muted-foreground">How often to batch alert emails</p>
                  </div>
                  <Select
                    value={form.emailFrequency}
                    onValueChange={(v) => patch({ emailFrequency: v as SubState["emailFrequency"] })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REALTIME">Realtime</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* Severity threshold */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Minimum severity</p>
              <p className="text-xs text-muted-foreground">Only receive alerts at or above this severity level.</p>
              <Select
                value={form.severityThreshold}
                onValueChange={(v) => patch({ severityThreshold: v as SubState["severityThreshold"] })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Regulatory bodies */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Regulatory bodies</p>
              <p className="text-xs text-muted-foreground">Receive alerts issued by these bodies.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {REGULATORY_BODIES.map((body) => (
                  <div key={body} className="flex items-center gap-2">
                    <Checkbox
                      id={`body-${body}`}
                      checked={form.regulatoryBodies.includes(body)}
                      onCheckedChange={() => toggleBody(body)}
                    />
                    <Label htmlFor={`body-${body}`} className="text-sm font-normal cursor-pointer">
                      {body}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Alert categories */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Alert categories</p>
              <p className="text-xs text-muted-foreground">Only notify me about alerts in these categories.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ALERT_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={form.categories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                    />
                    <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer">
                      {CATEGORY_LABELS[cat]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => saveMutation.mutate(form)}
                disabled={!isDirty || saveMutation.isPending}
                size="sm"
              >
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save changes
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// -----------------------------------------------------------------------------

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
    onSuccess: () => toast.success("Preferences saved"),
    onError: (error) => toast.error(error.message || "Failed to save preferences"),
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

        {/* Specific Email Alerts (DB-backed - unchanged) */}
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
              ? loadingRows(2)
              : (
                <div className="space-y-4">
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

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">In-app sounds</p>
                        <p className="text-sm text-muted-foreground">
                          Play short sounds for notifications, alerts, confirmations, and AI completions
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={prefs?.inAppSoundsEnabled ?? true}
                      disabled={updateMutation.isPending}
                      onCheckedChange={(v) => toggle("inAppSoundsEnabled", v)}
                    />
                  </div>
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

                  {/* Frequency options - greyed out when digest is disabled */}
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
                          { onError: (e) => toast.error(e.message || "Failed to save") }
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
                            { onError: (e) => toast.error(e.message || "Failed to save") }
                          )
                        }}
                      />
                    </div>
                  )
                })}
          </CardContent>
        </Card>

        {/* Regulatory Alert Subscriptions */}
        <AlertSubscriptionSection />

      </div>
    </div>
  )
}
