"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, FileText, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage, trpc } from "@/lib/trpc"

export default function EnterpriseContractsAdminPage() {
  const [organizationId, setOrganizationId] = useState("")
  const [contractName, setContractName] = useState("")
  const [contractNumber, setContractNumber] = useState("")
  const [reason, setReason] = useState("")

  const contractsQuery = trpc.enterpriseContract.adminList.useQuery()
  const organizationsQuery = trpc.admin.listOrganizations.useQuery()
  const create = trpc.enterpriseContract.adminCreate.useMutation({
    onSuccess: async () => {
      toast.success("Enterprise contract created")
      setContractName("")
      setContractNumber("")
      setReason("")
      await contractsQuery.refetch()
    },
    onError: (error) => toast.error("Create failed", { description: getErrorMessage(error) }),
  })

  const contracts = contractsQuery.data ?? []
  const organizations = organizationsQuery.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enterprise Contracts</h1>
          <p className="mt-1 text-muted-foreground">Admin-only contract overrides and entitlement previews.</p>
        </div>
        <Button variant="outline" onClick={() => contractsQuery.refetch()} disabled={contractsQuery.isFetching}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-4">
          {contractsQuery.isLoading ? (
            <Card className="border-border/50">
              <CardContent className="p-6 text-sm text-muted-foreground">Loading contracts...</CardContent>
            </Card>
          ) : contracts.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-6 text-sm text-muted-foreground">No enterprise contracts configured.</CardContent>
            </Card>
          ) : (
            contracts.map((contract: any) => (
              <Card key={contract.id} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-foreground">{contract.contractName ?? "Enterprise Contract"}</h2>
                          <Badge variant="outline">{contract.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {contract.organization?.name ?? contract.organizationId} · {contract.contractNumber ?? "No contract number"}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{contract._count?.overrides ?? 0} overrides</p>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/enterprise-contracts/${contract.id}`}>
                        Open
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Create Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization</Label>
              <Select value={organizationId} onValueChange={setOrganizationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Contract name" value={contractName} onChange={(event) => setContractName(event.target.value)} />
            <Input placeholder="Contract number" value={contractNumber} onChange={(event) => setContractNumber(event.target.value)} />
            <Textarea placeholder="Reason for creation" value={reason} onChange={(event) => setReason(event.target.value)} />
            <Button
              className="w-full"
              disabled={!organizationId || reason.trim().length < 10 || create.isPending}
              onClick={() => create.mutate({
                organizationId,
                contractName: contractName || null,
                contractNumber: contractNumber || null,
                reason,
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Contract
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
