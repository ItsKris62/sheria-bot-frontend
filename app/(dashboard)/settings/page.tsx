"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Loader2,
  Save,
  Upload,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react"
import { useProfile, useUserActions } from "@/hooks/use-user"

// ── Local types ─────────────────────────────────────────────────────────────

type UserRole = "REGULATOR" | "STARTUP" | "ENTERPRISE" | "ADMIN"

interface ProfileData {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  phone: string | null
  emailVerified: boolean
  createdAt: string | Date
  lastLoginAt: string | Date | null
  organization: { id: string; name: string; type?: string | null } | null
  preferences: Record<string, string>
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function roleBadge(role: UserRole) {
  const map: Record<UserRole, { label: string; className: string }> = {
    REGULATOR: { label: "Regulator", className: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    STARTUP: { label: "Startup", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    ENTERPRISE: { label: "Enterprise", className: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
    ADMIN: { label: "Admin", className: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
  }
  const { label, className } = map[role] ?? map.STARTUP
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      <ShieldCheck className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// ── ReadOnlyField ─────────────────────────────────────────────────────────────
// Visually distinct input-like field that signals the value cannot be changed.

function ReadOnlyField({
  id,
  label,
  value,
  hint,
  icon,
}: {
  id: string
  label: string
  value: string
  hint?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          Read-only
        </span>
      </div>
      <div
        id={id}
        className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed select-none"
      >
        {icon && <span className="shrink-0 text-muted-foreground/70">{icon}</span>}
        <span className="truncate">{value || "—"}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfileSettingsPage() {
  const { data: rawProfile, isLoading } = useProfile()
  const profile = rawProfile as ProfileData | undefined

  const { updateProfile, isUpdatingProfile, updatePreferences, isUpdatingPreferences } =
    useUserActions()

  const [formData, setFormData] = useState({
    phone: "",
    jobTitle: "",
    timezone: "Africa/Nairobi",
    language: "en",
    currency: "KES",
  })

  // Populate form once profile loads — only editable fields
  useEffect(() => {
    if (profile) {
      const prefs = profile.preferences ?? {}
      setFormData({
        phone: profile.phone ?? "",
        jobTitle: prefs.jobTitle ?? "",
        timezone: prefs.timezone ?? "Africa/Nairobi",
        language: prefs.language ?? "en",
        currency: prefs.currency ?? "KES",
      })
    }
  }, [profile])

  const handleSave = async () => {
    try {
      await Promise.all([
        updateProfile({ phone: formData.phone || undefined }),
        updatePreferences({
          preferences: {
            jobTitle: formData.jobTitle,
            timezone: formData.timezone,
            language: formData.language,
            currency: formData.currency,
          },
        }),
      ])
      toast.success("Profile updated successfully")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile"
      toast.error(msg)
    }
  }

  const isSaving = isUpdatingProfile || isUpdatingPreferences

  // ── Initials for avatar ──────────────────────────────────────────────────
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("")
    : "?"

  // ── Skeleton ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="border-border/50 bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      {/* ── Avatar + summary ─────────────────────────────────────────────── */}
      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground select-none">
              {initials}
            </div>

            {/* Name + email + role */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-lg font-semibold text-foreground">
                {profile?.name ?? "—"}
              </p>
              <p className="truncate text-sm text-muted-foreground">{profile?.email ?? "—"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {profile?.role && roleBadge(profile.role)}
                {profile?.emailVerified ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Email verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Email not verified
                  </span>
                )}
              </div>
            </div>

            {/* Upload avatar (placeholder) */}
            <div className="flex flex-col gap-1.5">
              <Button variant="outline" size="sm" className="bg-transparent" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Upload picture
              </Button>
              <p className="text-xs text-muted-foreground text-center">JPG, PNG, GIF — max 2 MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Account information (read-only) ──────────────────────────────── */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Account Information</CardTitle>
          <CardDescription>
            These details are managed by your account and cannot be edited here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReadOnlyField
            id="fullName"
            label="Full Name"
            value={profile?.name ?? ""}
            hint="Your name is set at registration. Contact support to request a name change."
          />

          <ReadOnlyField
            id="email"
            label="Primary Email"
            value={profile?.email ?? ""}
            hint="Your login email address. Contact support to change it."
          />

          {profile?.organization && (
            <ReadOnlyField
              id="organization"
              label="Organization"
              value={profile.organization.name}
              hint="Managed from the Organization settings tab."
              icon={<Building2 className="h-4 w-4" />}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField
              id="memberSince"
              label="Member Since"
              value={formatDate(profile?.createdAt)}
              icon={<Calendar className="h-4 w-4" />}
            />
            <ReadOnlyField
              id="lastLogin"
              label="Last Login"
              value={formatDate(profile?.lastLoginAt)}
              icon={<Clock className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Contact details (editable) ────────────────────────────────────── */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Contact Details</CardTitle>
          <CardDescription>Update your phone number and job title</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background"
              placeholder="+254 700 000 000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="bg-background"
              placeholder="e.g. Chief Compliance Officer"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Preferences (editable) ────────────────────────────────────────── */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription>Customize your display and locale settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger id="timezone" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Nairobi">East Africa Time (EAT, UTC+3)</SelectItem>
                <SelectItem value="Africa/Lagos">West Africa Time (WAT, UTC+1)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger id="language" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency Display</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger id="currency" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Save ─────────────────────────────────────────────────────────── */}
      <div className="flex justify-end pb-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
