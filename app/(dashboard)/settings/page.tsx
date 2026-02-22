"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, Upload, User } from "lucide-react"
import { useProfile, useUserActions } from "@/hooks/use-user"

export default function ProfileSettingsPage() {
  const { data: profile, isLoading } = useProfile()
  const { updateProfile, isUpdatingProfile, updatePreferences, isUpdatingPreferences } =
    useUserActions()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    timezone: "Africa/Nairobi",
    language: "en",
    currency: "KES",
  })

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      const nameParts = (profile.name ?? "").split(" ")
      const firstName = nameParts[0] ?? ""
      const lastName = nameParts.slice(1).join(" ")
      const prefs = (profile.preferences as Record<string, string>) ?? {}

      setFormData({
        firstName,
        lastName,
        email: profile.email ?? "",
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
      const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ")

      await Promise.all([
        updateProfile({
          name: fullName || undefined,
          phone: formData.phone || undefined,
        }),
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
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile")
    }
  }

  const isSaving = isUpdatingProfile || isUpdatingPreferences

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
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
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      {/* Profile Picture */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Profile Picture</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {formData.firstName?.[0]?.toUpperCase() ?? ""}
              {formData.lastName?.[0]?.toUpperCase() ?? ""}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="bg-transparent" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Upload new picture
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email address.
            </p>
          </div>

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

      {/* Preferences */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger className="bg-background">
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
              <SelectTrigger className="bg-background">
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

      {/* Save Button */}
      <div className="flex justify-end">
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
