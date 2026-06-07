"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { ArrowLeft, CheckCircle2, Eye, Plus, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage, trpc } from "@/lib/trpc"

const OVERRIDE_KEYS = [
  "seats.limit",
  "features.customFrameworks",
  "features.policyGeneration",
  "features.licenseManagement",
  "features.complianceCalendar",
  "features.gapAnalysis",
  "features.benchmarkDocuments",
  "limits.complianceQueries.month",
  "limits.gapAnalysis.month",
  "limits.policyGeneration.month",
  "limits.documentUploads.month",
  "limits.storageGb",
  "limits.customFrameworks.count",
  "limits.benchmarkDocuments.count",
  "support.tier",
] as const

function parseOverrideValue(key: string, raw: string): boolean | number | string {
  if (key.startsWith("features.")) return raw === "true"
  if (key === "support.tier") return raw
  return Number(raw)
}

export default function EnterpriseContractDetailPage() {
  const params = useParams<{ contractId: string }>()
  const contractId = params.contractId
  const [key, setKey] = useState<(typeof OVERRIDE_KEYS)[number]>("features.customFrameworks")
  const [value, setValue] = useState("true")
  const [reason, setReason] = useState("")

  const contractQuery = trpc.enterpriseContract.adminGet.useQuery({ id: contractId }, { enabled: Boolean(contractId) })
  const contract = contractQuery.data as any
  const previewQuery = trpc.enterpriseContract.adminPreviewEffectiveEntitlements.useQuery(
    { organizationId: contract?.organizationId ?? "" },
    { enabled: Boolean(contract?.organizationId) },
  )
  const activate = trpc.enterpriseContract.adminActivate.useMutation({
    onSuccess: async () => {
      toast.success("Contract activated")
      await contractQuery.refetch()
      await previewQuery.refetch()
    },
    onError: (error) => toast.error("Activation failed", { description: getErrorMessage(error) }),
  })
  const addOverride = trpc.enterpriseContract.adminAddOverride.useMutation({
    onSuccess: async () => {
      toast.success("Override added")
      setReason("")
      await contractQuery.refetch()
      await previewQuery.refetch()
    },
    onError: (error) => toast.error("Override failed", { description: getErrorMessage(error) }),
  })
  const disableOverride = trpc.enterpriseContract.adminDisableOverride.useMutation({
    onSuccess: async () => {
      toast.success("Override disabled")
      await contractQuery.refetch()
      await previewQuery.refetch()
    },
    onError: (error) => toast.error("Disable failed", { description: getErrorMessage(error) }),
  })

  const preview = previewQuery.data as any
  const previewRows = useMemo(() => {
    if (!preview) return []
    return [
      ["customFrameworks", preview.planDefault.customFrameworks, preview.effectiveEntitlements.customFrameworks],
      ["policyGeneration", preview.planDefault.policyGeneration, preview.effectiveEntitlements.policyGeneration],
      ["licenseManagement", preview.planDefault.licenseManagement, preview.effectiveEntitlements.licenseManagement],
      ["maxSeats", preview.planDefault.maxSeats, preview.effectiveEntitlements.maxSeats],
      ["complianceQueries", preview.planDefault.complianceQueries?.limit, preview.effectiveEntitlements.complianceQueries?.limit],
      ["gapAnalysis", preview.planDefault.gapAnalysis?.limit, preview.effectiveEntitlements.gapAnalysis?.limit],
      ["storageMB", preview.planDefault.documentRepository?.limitMB, preview.effectiveEntitlements.documentRepository?.limitMB],
      ["supportTier", preview.planDefault.supportTier, preview.effectiveEntitlements.supportTier],
    ]
  }, [preview])

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/enterprise-contracts" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Enterprise Contracts
      </Link>

      {contractQuery.isLoading ? (
        <Card className="border-border/50">
          <CardContent className="p-6 text-sm text-muted-foreground">Loading contract...</CardContent>
        </Card>
      ) : contract ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{contract.contractName ?? "Enterprise Contract"}</h1>
                <Badge variant="outline">{contract.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {contract.organization?.name ?? contract.organizationId} · {contract.contractNumber ?? "No contract number"}
              </p>
            </div>
            {contract.status !== "ACTIVE" && (
              <Button
                onClick={() => activate.mutate({ id: contract.id, reason: "Activating contract after commercial approval." })}
                disabled={activate.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Activate
              </Button>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="flex flex-col gap-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Overrides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(contract.overrides ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No overrides configured.</p>
                  ) : (
                    contract.overrides.map((override: any) => (
                      <div key={override.id} className="flex flex-col gap-3 rounded-lg border border-border/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-foreground">{override.key}</p>
                            <Badge variant="outline">{override.isActive ? "Active" : "Disabled"}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{JSON.stringify(override.value)}</p>
                        </div>
                        {override.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => disableOverride.mutate({
                              id: override.id,
                              reason: "Disabling override after admin contract review.",
                            })}
                            disabled={disableOverride.isPending}
                          >
                            <XCircle className="mr-2 h-3.5 w-3.5" />
                            Disable
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4" />
                    Effective Entitlement Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {previewRows.map(([name, planDefault, effective]) => (
                    <div key={name} className="grid grid-cols-3 gap-3 rounded-lg border border-border/50 p-2 text-sm">
                      <span className="font-medium text-foreground">{name}</span>
                      <span className="text-muted-foreground">{String(planDefault)}</span>
                      <span className={String(planDefault) === String(effective) ? "text-muted-foreground" : "font-medium text-primary"}>{String(effective)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Add Override</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Key</Label>
                  <Select value={key} onValueChange={(next) => {
                    const nextKey = next as (typeof OVERRIDE_KEYS)[number]
                    setKey(nextKey)
                    setValue(nextKey.startsWith("features.") ? "true" : nextKey === "support.tier" ? "dedicated" : "1")
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OVERRIDE_KEYS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {key.startsWith("features.") ? (
                  <Select value={value} onValueChange={setValue}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">true</SelectItem>
                      <SelectItem value="false">false</SelectItem>
                    </SelectContent>
                  </Select>
                ) : key === "support.tier" ? (
                  <Select value={value} onValueChange={setValue}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community">community</SelectItem>
                      <SelectItem value="email-48hr">email-48hr</SelectItem>
                      <SelectItem value="priority-24hr">priority-24hr</SelectItem>
                      <SelectItem value="dedicated">dedicated</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input type="number" value={value} onChange={(event) => setValue(event.target.value)} />
                )}
                <Textarea placeholder="Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
                <Button
                  className="w-full"
                  disabled={reason.trim().length < 10 || addOverride.isPending}
                  onClick={() => addOverride.mutate({
                    contractId,
                    key,
                    value: parseOverrideValue(key, value),
                    reason,
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Override
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
