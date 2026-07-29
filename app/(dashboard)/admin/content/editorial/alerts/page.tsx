"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldAlert } from "lucide-react"
import Link from "next/link"

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-red-100 text-red-700",
  ACKNOWLEDGED: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
  IGNORED: "bg-gray-100 text-gray-700",
}

export default function ContentOpsAlertsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = trpc.blogAutomation.adminListContentOpsAlerts.useQuery({ page, limit: 20 })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Ops Alerts</h1>
        <p className="text-muted-foreground mt-2">Manage critical pipeline anomalies and agent limits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Operations Alerts</CardTitle>
          <CardDescription>System-generated alerts for review.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : data?.alerts.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No alerts found.</div>
          ) : (
            <div className="space-y-4">
              {data?.alerts.map((alert: any) => (
                <div key={alert.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      <Link href={`/admin/content/editorial/alerts/${alert.id}`} className="font-medium text-lg hover:underline text-primary">
                        {alert.type}
                      </Link>
                      <Badge variant="outline" className={STATUS_STYLES[alert.status]}>
                        {alert.status}
                      </Badge>
                      <Badge variant="secondary">{alert.severity} SEVERITY</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{alert.message}</p>
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
                      <span>Created {format(new Date(alert.createdAt), 'PP p')}</span>
                      <span>Source: {alert.source || "System"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
