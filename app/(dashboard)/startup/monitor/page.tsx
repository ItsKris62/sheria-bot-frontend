"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  Settings,
  Filter,
  RefreshCw,
} from "lucide-react"

const regulatoryUpdates = [
  {
    id: 1,
    title: "CBK Revises Mobile Money Transaction Limits",
    source: "Central Bank of Kenya",
    date: "2024-01-28",
    type: "regulation",
    impact: "high",
    summary: "New daily transaction limits for mobile money operators effective March 2024. Maximum daily transactions increased to KES 500,000.",
    isRead: false,
  },
  {
    id: 2,
    title: "ODPC Issues Guidelines on Cross-Border Data Transfers",
    source: "Office of Data Protection Commissioner",
    date: "2024-01-25",
    type: "guideline",
    impact: "medium",
    summary: "New requirements for Standard Contractual Clauses and adequacy assessments for international data transfers.",
    isRead: false,
  },
  {
    id: 3,
    title: "FRC Updates Suspicious Transaction Reporting Form",
    source: "Financial Reporting Centre",
    date: "2024-01-22",
    type: "compliance",
    impact: "medium",
    summary: "New STR form with additional fields for crypto-related transactions. Effective February 1, 2024.",
    isRead: true,
  },
  {
    id: 4,
    title: "CMA Proposes Digital Asset Regulations",
    source: "Capital Markets Authority",
    date: "2024-01-20",
    type: "proposal",
    impact: "high",
    summary: "Draft regulations for cryptocurrency exchanges and digital asset service providers open for public comment.",
    isRead: true,
  },
  {
    id: 5,
    title: "CBK Sandbox Cohort 3 Applications Open",
    source: "Central Bank of Kenya",
    date: "2024-01-18",
    type: "announcement",
    impact: "low",
    summary: "Applications for the third cohort of the CBK regulatory sandbox are now open until March 31, 2024.",
    isRead: true,
  },
]

const alertSettings = [
  { id: "cbk", label: "Central Bank of Kenya", enabled: true },
  { id: "odpc", label: "ODPC Kenya", enabled: true },
  { id: "frc", label: "Financial Reporting Centre", enabled: true },
  { id: "cma", label: "Capital Markets Authority", enabled: false },
  { id: "ira", label: "Insurance Regulatory Authority", enabled: false },
]

const impactConfig = {
  high: { label: "High Impact", color: "bg-destructive/10 text-destructive" },
  medium: { label: "Medium Impact", color: "bg-warning/10 text-warning" },
  low: { label: "Low Impact", color: "bg-muted text-muted-foreground" },
}

const typeConfig = {
  regulation: { label: "Regulation", color: "bg-primary/10 text-primary" },
  guideline: { label: "Guideline", color: "bg-primary/10 text-primary" },
  compliance: { label: "Compliance", color: "bg-warning/10 text-warning" },
  proposal: { label: "Proposal", color: "bg-muted text-muted-foreground" },
  announcement: { label: "Announcement", color: "bg-muted text-muted-foreground" },
}

export default function MonitorPage() {
  const [updates, setUpdates] = useState(regulatoryUpdates)
  const [settings, setSettings] = useState(alertSettings)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const unreadCount = updates.filter((u) => !u.isRead).length

  const markAsRead = (id: number) => {
    setUpdates(updates.map((u) => (u.id === id ? { ...u, isRead: true } : u)))
  }

  const markAllAsRead = () => {
    setUpdates(updates.map((u) => ({ ...u, isRead: true })))
  }

  const toggleAlertSetting = (id: string) => {
    setSettings(settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regulatory Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest regulatory changes and announcements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Updates</p>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Impact</p>
                <p className="text-2xl font-bold text-foreground">
                  {updates.filter((u) => u.impact === "high").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Regulations</p>
                <p className="text-2xl font-bold text-foreground">
                  {updates.filter((u) => u.type === "regulation").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sources Monitored</p>
                <p className="text-2xl font-bold text-foreground">
                  {settings.filter((s) => s.enabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="updates" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>Latest regulatory changes and announcements</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className={`p-4 rounded-lg transition-colors cursor-pointer ${
                    update.isRead ? "bg-muted/30" : "bg-primary/5 border-l-4 border-l-primary"
                  }`}
                  onClick={() => markAsRead(update.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!update.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <h3 className="font-medium text-foreground">{update.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{update.summary}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{update.source}</span>
                        <span>{new Date(update.date).toLocaleDateString("en-KE")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={impactConfig[update.impact as keyof typeof impactConfig].color}>
                        {impactConfig[update.impact as keyof typeof impactConfig].label}
                      </Badge>
                      <Badge variant="outline" className={typeConfig[update.type as keyof typeof typeConfig].color}>
                        {typeConfig[update.type as keyof typeof typeConfig].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Read Full Update <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>
                Configure which regulatory bodies you want to receive updates from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{setting.label}</span>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleAlertSetting(setting.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
