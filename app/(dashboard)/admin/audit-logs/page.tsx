"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Download, Filter, User, Settings, FileText, Shield } from "lucide-react"

const logs = [
  { id: 1, user: "john@safaricom.co.ke", action: "Generated compliance checklist", type: "query", ip: "192.168.1.1", timestamp: "2024-01-28T10:30:00Z" },
  { id: 2, user: "admin@sheriabot.co.ke", action: "Updated AI configuration", type: "settings", ip: "192.168.1.2", timestamp: "2024-01-28T10:25:00Z" },
  { id: 3, user: "mary@mpesa.co.ke", action: "Uploaded document", type: "document", ip: "192.168.1.3", timestamp: "2024-01-28T10:20:00Z" },
  { id: 4, user: "peter@cbk.go.ke", action: "Login successful", type: "auth", ip: "192.168.1.4", timestamp: "2024-01-28T10:15:00Z" },
  { id: 5, user: "admin@sheriabot.co.ke", action: "Published knowledge base article", type: "content", ip: "192.168.1.2", timestamp: "2024-01-28T10:10:00Z" },
  { id: 6, user: "jane@kcb.co.ke", action: "Queried KYC requirements", type: "query", ip: "192.168.1.5", timestamp: "2024-01-28T10:05:00Z" },
]

const typeConfig = {
  query: { label: "Query", icon: Activity, color: "bg-primary/10 text-primary" },
  settings: { label: "Settings", icon: Settings, color: "bg-warning/10 text-warning" },
  document: { label: "Document", icon: FileText, color: "bg-muted text-muted-foreground" },
  auth: { label: "Auth", icon: Shield, color: "bg-primary/10 text-primary" },
  content: { label: "Content", icon: FileText, color: "bg-muted text-muted-foreground" },
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || log.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || log.type === typeFilter
    return matchesSearch && matchesType
  })

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
              <CardDescription>{filteredLogs.length} entries</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-[250px] bg-muted/50" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] bg-muted/50"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="auth">Auth</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const config = typeConfig[log.type as keyof typeof typeConfig]
              const Icon = config.icon
              return (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${config.color}`}><Icon className="h-4 w-4" /></div>
                    <div>
                      <p className="font-medium text-foreground">{log.action}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{log.user}</span>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={config.color}>{config.label}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(log.timestamp).toLocaleString("en-KE")}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
