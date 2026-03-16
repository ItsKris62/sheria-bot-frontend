"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Loader2, Save, Info } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useProfile } from "@/hooks/use-user"

type OrgFormData = {
  name: string
  registrationNumber: string
  industry: string
  website: string
  address: string
  contactPerson: string
  contactPosition: string
  contactEmail: string
  contactPhone: string
}

const EMPTY_FORM: OrgFormData = {
  name: "",
  registrationNumber: "",
  industry: "",
  website: "",
  address: "",
  contactPerson: "",
  contactPosition: "",
  contactEmail: "",
  contactPhone: "",
}

function formFromData(data: {
  name: string | null
  registrationNumber: string | null
  industry: string | null
  website: string | null
  address: string | null
  contactPerson: string | null
  contactPosition: string | null
  contactEmail: string | null
  contactPhone: string | null
}): OrgFormData {
  return {
    name: data.name ?? "",
    registrationNumber: data.registrationNumber ?? "",
    industry: data.industry ?? "",
    website: data.website ?? "",
    address: data.address ?? "",
    contactPerson: data.contactPerson ?? "",
    contactPosition: data.contactPosition ?? "",
    contactEmail: data.contactEmail ?? "",
    contactPhone: data.contactPhone ?? "",
  }
}

function isDirty(form: OrgFormData, original: OrgFormData): boolean {
  return (Object.keys(form) as Array<keyof OrgFormData>).some(
    (key) => form[key] !== original[key]
  )
}

export default function OrganizationSettingsPage() {
  const { data: profile } = useProfile()
  const isRegulator = profile?.role === "REGULATOR"

  const { data: orgData, isLoading } = trpc.organization.getSettings.useQuery(undefined, {
    enabled: !isRegulator,
  })

  const utils = trpc.useUtils()

  const updateMutation = trpc.organization.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Organization settings updated")
      utils.organization.getSettings.invalidate()
      utils.user.getProfile.invalidate()
      // Sync saved baseline to current form
      setSavedData(formData)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update organization settings")
    },
  })

  const [formData, setFormData] = useState<OrgFormData>(EMPTY_FORM)
  const [savedData, setSavedData] = useState<OrgFormData>(EMPTY_FORM)

  useEffect(() => {
    if (orgData) {
      const parsed = formFromData(orgData)
      setFormData(parsed)
      setSavedData(parsed)
    }
  }, [orgData])

  const handleSave = () => {
    // Only send fields that have changed, allow empty string to clear a field
    const patch: Partial<OrgFormData> = {}
    ;(Object.keys(formData) as Array<keyof OrgFormData>).forEach((key) => {
      if (formData[key] !== savedData[key]) {
        patch[key] = formData[key]
      }
    })
    updateMutation.mutate(patch)
  }

  const field = (key: keyof OrgFormData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value })),
    disabled: isRegulator || updateMutation.isPending,
    className: isRegulator ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : "bg-background",
  })

  const dirty = isDirty(formData, savedData)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your organization profile and details</p>
      </div>

      {isRegulator && (
        <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <span>Organization details are managed by your administrator. Contact them to make changes.</span>
        </div>
      )}

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  <Building2 className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Update your organization information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" placeholder="e.g. Acme Fintech Ltd" {...field("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-reg">Registration Number</Label>
                <Input id="org-reg" placeholder="e.g. CPR/2023/123456" {...field("registrationNumber")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-industry">Industry</Label>
                <Input id="org-industry" placeholder="e.g. Financial Services" {...field("industry")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-website">Website</Label>
                <Input id="org-website" type="url" placeholder="https://example.co.ke" {...field("website")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="org-address">Address</Label>
                <Textarea
                  id="org-address"
                  placeholder="e.g. Westlands, Nairobi, Kenya"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  disabled={isRegulator || updateMutation.isPending}
                  className={isRegulator ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : "bg-background"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Primary contact for regulatory matters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="e.g. Jane Wanjiku" {...field("contactPerson")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-position">Position</Label>
                <Input id="contact-position" placeholder="e.g. Chief Compliance Officer" {...field("contactPosition")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="compliance@example.co.ke" {...field("contactEmail")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input id="contact-phone" placeholder="+254 700 000 000" {...field("contactPhone")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {!isRegulator && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!dirty || updateMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
