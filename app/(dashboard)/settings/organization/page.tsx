"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, CheckCircle2, Loader2, Save, Info, Users } from "lucide-react"
import { trpc } from "@/lib/trpc"
import { useAuthStore } from "@/lib/auth-store"
import {
  AUDITED_JURISDICTIONS,
  jurisdictionLabel,
  type AuditedJurisdictionCode,
  type JurisdictionCode,
} from "@/lib/jurisdictions"

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

type OrganizationSettingsMeta = {
  id: string
  homeJurisdictionCode?: JurisdictionCode | null
  canManageOrganizationSettings?: boolean
  currentMemberRole?: string | null
}

export default function OrganizationSettingsPage() {
  const authRole = useAuthStore((s) => s.user?.role)
  const isRegulator = authRole === "REGULATOR"

  const { data: orgData, isLoading } = trpc.organization.getSettings.useQuery(undefined, {
    enabled: !isRegulator,
  })
  const { data: seatUsage } = trpc.organization.getSeatUsage.useQuery(undefined, {
    enabled: !isRegulator,
  })
  const { data: teamOverview } = trpc.organization.getTeamOverview.useQuery(undefined, {
    enabled: !isRegulator,
  })

  const utils = trpc.useUtils()

  const updateMutation = trpc.organization.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Organization settings updated")
      utils.organization.getSettings.invalidate()
      utils.billing.getPlanAndUsage.invalidate()
      utils.user.getProfile.invalidate()
      setSavedDataOverride(formData)
      setFormDataOverride(formData)
      setSelectedJurisdiction("")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update organization settings")
    },
  })

  const remoteSavedData = useMemo(
    () => orgData ? formFromData(orgData) : EMPTY_FORM,
    [orgData],
  )
  const [formDataOverride, setFormDataOverride] = useState<OrgFormData | null>(null)
  const [savedDataOverride, setSavedDataOverride] = useState<OrgFormData | null>(null)
  const settingsMeta = orgData as (typeof orgData & OrganizationSettingsMeta) | undefined
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<AuditedJurisdictionCode | "">("")
  const savedData = savedDataOverride ?? remoteSavedData
  const formData = formDataOverride ?? savedData
  const homeJurisdictionCode = settingsMeta?.homeJurisdictionCode ?? null
  const canConfirmJurisdiction = Boolean(settingsMeta?.canManageOrganizationSettings) && !isRegulator
  const needsJurisdictionConfirmation = !homeJurisdictionCode

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

  const handleConfirmJurisdiction = () => {
    if (!settingsMeta?.id || !selectedJurisdiction) return

    updateMutation.mutate({
      homeJurisdictionCode: selectedJurisdiction,
      homeJurisdictionReason: "Owner/admin onboarding confirmation",
    })
  }

  const field = (key: keyof OrgFormData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormDataOverride((prev) => ({ ...(prev ?? formData), [key]: e.target.value })),
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
        {!isRegulator && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Primary Regulatory Jurisdiction</CardTitle>
                  <CardDescription>
                    {needsJurisdictionConfirmation
                      ? "Confirm your organization's primary regulatory jurisdiction"
                      : `${jurisdictionLabel(homeJurisdictionCode)} is confirmed for regulatory intelligence`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {needsJurisdictionConfirmation ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    To use SheriaBot&apos;s regulatory intelligence, confirm your organization&apos;s primary regulatory jurisdiction.
                  </p>
                  <RadioGroup
                    value={selectedJurisdiction}
                    onValueChange={(value) => setSelectedJurisdiction(value as AuditedJurisdictionCode)}
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                    disabled={!canConfirmJurisdiction || updateMutation.isPending}
                  >
                    {AUDITED_JURISDICTIONS.map((item) => (
                      <Label
                        key={item.code}
                        htmlFor={`home-jurisdiction-${item.code}`}
                        className="flex min-h-20 cursor-pointer items-center gap-3 rounded-md border border-border/50 bg-muted/20 p-3 text-sm hover:bg-muted/40"
                      >
                        <RadioGroupItem id={`home-jurisdiction-${item.code}`} value={item.code} />
                        <span>
                          <span className="block font-medium text-foreground">{item.label}</span>
                          <span className="text-xs text-muted-foreground">Available now</span>
                        </span>
                      </Label>
                    ))}
                    <div className="flex min-h-20 items-center gap-3 rounded-md border border-dashed border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-border" />
                      <span>
                        <span className="block font-medium text-foreground">Nigeria</span>
                        <span className="text-xs">Coming soon</span>
                      </span>
                    </div>
                  </RadioGroup>
                  {!canConfirmJurisdiction && (
                    <p className="text-sm text-muted-foreground">
                      Ask an organization owner or admin to confirm the jurisdiction.
                    </p>
                  )}
                  {canConfirmJurisdiction && (
                    <Button
                      onClick={handleConfirmJurisdiction}
                      disabled={!selectedJurisdiction || updateMutation.isPending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Confirm Jurisdiction
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{jurisdictionLabel(homeJurisdictionCode)}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Compliance Query, Gap Analysis, Checklists, and Policy Generation use this jurisdiction for access control.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {seatUsage && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Seats</CardTitle>
                  <CardDescription>
                    {seatUsage.seatLimit === -1
                      ? `${seatUsage.usedSeats} seats used`
                      : `${seatUsage.usedSeats} of ${seatUsage.seatLimit} seats used`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Active members</p>
                  <p className="mt-1 font-semibold text-foreground">{seatUsage.activeMembers}</p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Pending invites</p>
                  <p className="mt-1 font-semibold text-foreground">{seatUsage.pendingInvites}</p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Available seats</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {seatUsage.availableSeats === -1 ? "Unlimited" : seatUsage.availableSeats}
                  </p>
                </div>
              </div>
              {seatUsage.seatLimit !== -1 && seatUsage.availableSeats === 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Your plan includes {seatUsage.seatLimit} seats. Revoke a pending invite or remove a member before inviting another user.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {teamOverview && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Business Overview</CardTitle>
              <CardDescription>Organization plan, ownership, and team capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Plan</p>
                  <div className="mt-1">
                    <Badge variant="outline">{teamOverview.organization.plan}</Badge>
                  </div>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Organization owner</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {teamOverview.owner?.name || teamOverview.owner?.email || "No active owner"}
                  </p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Members</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {teamOverview.memberCounts.active} active, {teamOverview.memberCounts.suspended} suspended
                  </p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-muted-foreground">Pending invites</p>
                  <p className="mt-1 font-semibold text-foreground">{teamOverview.memberCounts.pendingInvitations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  onChange={(e) => setFormDataOverride((prev) => ({ ...(prev ?? formData), address: e.target.value }))}
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
