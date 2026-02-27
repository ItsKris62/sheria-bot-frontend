"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Download, User, Settings, FileText, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import { trpc } from "@/lib/trpc"

type TypeConfigEntry = { label: string; icon: React.ElementType; color: string }
const typeConfig: Record<string, TypeConfigEntry> = {
  QUERY: { label: "Query", icon: Activity, color: "bg-primary/10 text-primary" },
  SETTINGS: { label: "Settings", icon: Settings, color: "bg-warning/10 text-warning" },
  DOCUMENT: { label: "Document", icon: FileText, color: "bg-muted text-muted-foreground" },
  AUTH: { label: "Auth", icon: Shield, color: "bg-primary/10 text-primary" },
  POLICY: { label: "Policy", icon: FileText, color: "bg-muted text-muted-foreground" },
  USER: { label: "User", icon: User, color: "bg-muted text-muted-foreground" },
}
function getConfig(entityType?: string | null): TypeConfigEntry {
  return typeConfig[(entityType ?? "").toUpperCase()] ?? { label: entityType ?? "Other", icon: Activity, color: "bg-muted text-muted-foreground" }
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")
  const limit = 20

  const { data, isLoading } = trpc.admin.getLogs.useQuery({
    page,
    limit,
    ...(entityTypeFilter !== "all" ? { entityType: entityTypeFilter } : {}),
  } as any)

  const logs = (data as any)?.logs ?? []
  const total = (data as any)?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track all system activity and user actions</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Logs</Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>{isLoading ? "Loading…" : `${total} entries`}</CardDescription>
            </div>
            <Select value={entityTypeFilter} onValueChange={(v) => { setEntityTypeFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[150px] bg-muted/50"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="QUERY">Query</SelectItem>
                <SelectItem value="POLICY">Policy</SelectItem>
                <SelectItem value="DOCUMENT">Document</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="AUTH">Auth</SelectItem>
                <SelectItem value="SETTINGS">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : logs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No audit logs found</p>
            ) : (
              logs.map((log: any) => {
                const config = getConfig(log.entityType)
                const Icon = config.icon
                return (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${config.color}`}><Icon className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium text-foreground">{log.action}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{log.user?.email ?? log.userId ?? "System"}</span>
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={config.color}>{config.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(log.createdAt).toLocaleString("en-KE")}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
