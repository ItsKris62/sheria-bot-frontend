"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  Building2,
  Users,
  FileText,
  Mail,
  Phone,
  Globe,
  Ban,
  CheckCircle,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"

const PLAN_COLORS: Record<string, string> = {
  REGULATOR: "bg-slate-100 text-slate-700",
  STARTUP: "bg-blue-100 text-blue-700",
  BUSINESS: "bg-purple-100 text-purple-700",
  ENTERPRISE: "bg-emerald-100 text-emerald-700",
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  GRACE_PERIOD: "bg-yellow-100 text-yellow-700",
  PAST_DUE: "bg-orange-100 text-orange-700",
  TRIALING: "bg-blue-100 text-blue-700",
  EXPIRED: "bg-gray-100 text-gray-500",
}

export default function OrgDetailPage() {
  const params = useParams()
  const orgId = params.orgId as string

  const [confirmAction, setConfirmAction] = useState<"suspend" | "reactivate" | null>(null)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  const utils = trpc.useUtils()

  const { data: org, isLoading, isError } = trpc.admin.getOrgDetails.useQuery({ orgId })

  const suspendMutation = trpc.admin.suspendOrganization.useMutation({
    onSuccess: () => {
      toast.success("Organization suspended")
      void utils.admin.getOrgDetails.invalidate({ orgId })
    },
    onError: (err) => toast.error(err.message),
  })

  const reactivateMutation = trpc.admin.reactivateOrganization.useMutation({
    onSuccess: () => {
      toast.success("Organization reactivated")
      void utils.admin.getOrgDetails.invalidate({ orgId })
    },
    onError: (err) => toast.error(err.message),
  })

  const updatePlanMutation = trpc.admin.updateOrganizationPlan.useMutation({
    onSuccess: () => {
      toast.success("Plan updated successfully")
      setPlanDialogOpen(false)
      void utils.admin.getOrgDetails.invalidate({ orgId })
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !org) {
    return (
      <div className="p-6">
        <div className="text-center py-16 text-red-500">
          <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
          <p>Failed to load organization. <Link href="/admin/organizations" className="underline">Go back</Link></p>
        </div>
      </div>
    )
  }

  const isSuspended = org.subscriptionStatus === "CANCELLED" || org.subscriptionStatus === "EXPIRED"

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/organizations">
            <ChevronLeft className="w-4 h-4 mr-1" /> Organizations
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2B4A]">{org.name}</h1>
          <p className="text-sm text-gray-500 capitalize">{org.type} &middot; Reg: {org.registrationNumber ?? "N/A"}</p>
        </div>
        <div className="flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${PLAN_COLORS[org.subscriptionTier] ?? "bg-gray-100 text-gray-600"}`}>
            {org.subscriptionTier}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[org.subscriptionStatus] ?? "bg-gray-100 text-gray-600"}`}>
            {org.subscriptionStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Members", value: org.memberCount, icon: Users },
              { label: "Documents", value: org.documentCount, icon: FileText },
              { label: "Policies", value: org.policyCount, icon: FileText },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-3 text-center">
                  <s.icon className="w-6 h-6 mx-auto text-[#1A2B4A] mb-1 opacity-70" />
                  <p className="text-2xl font-bold text-[#1A2B4A]">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Organization Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Type</p>
                <p className="font-medium capitalize">{org.type}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Registration</p>
                <p className="font-medium">{org.registrationNumber ?? "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Created</p>
                <p className="font-medium">{new Date(org.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Last Updated</p>
                <p className="font-medium">{new Date(org.updatedAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              {org.trialEndsAt && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Trial Ends</p>
                  <p className="font-medium">{new Date(org.trialEndsAt).toLocaleDateString("en-KE")}</p>
                </div>
              )}
              {org.subscriptionEndsAt && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Subscription Ends</p>
                  <p className="font-medium">{new Date(org.subscriptionEndsAt).toLocaleDateString("en-KE")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — Actions */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => { setSelectedPlan(org.subscriptionTier); setPlanDialogOpen(true) }}
              >
                <CreditCard className="w-4 h-4" /> Change Plan
              </Button>
              {isSuspended ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => setConfirmAction("reactivate")}
                >
                  <CheckCircle className="w-4 h-4" /> Reactivate Organization
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setConfirmAction("suspend")}
                >
                  <Ban className="w-4 h-4" /> Suspend Organization
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLAN_COLORS[org.subscriptionTier] ?? "bg-gray-100 text-gray-600"}`}>
                  {org.subscriptionTier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[org.subscriptionStatus] ?? "bg-gray-100 text-gray-600"}`}>
                  {org.subscriptionStatus}
                </span>
              </div>
              {org.trialEndsAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Trial ends</span>
                  <span>{new Date(org.trialEndsAt).toLocaleDateString("en-KE")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm suspend/reactivate */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "suspend" ? "Suspend Organization" : "Reactivate Organization"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "suspend"
                ? `This will suspend "${org.name}" and all its members immediately.`
                : `This will restore access for "${org.name}" and all its members.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirmAction === "suspend" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              onClick={() => {
                if (confirmAction === "suspend") {
                  suspendMutation.mutate({ orgId, reason: "Suspended by administrator" })
                } else {
                  reactivateMutation.mutate({ orgId })
                }
                setConfirmAction(null)
              }}
            >
              {confirmAction === "suspend" ? "Suspend" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Subscription Plan</DialogTitle>
            <DialogDescription>
              Changing the plan takes effect immediately and invalidates the org&apos;s plan cache.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULATOR">Regulator (Free)</SelectItem>
                <SelectItem value="STARTUP">Startup</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#00875A] hover:bg-[#007a50]"
              disabled={!selectedPlan || updatePlanMutation.isPending}
              onClick={() => {
                if (!selectedPlan) return
                updatePlanMutation.mutate({ orgId, plan: selectedPlan as never })
              }}
            >
              {updatePlanMutation.isPending ? "Updating..." : "Update Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
