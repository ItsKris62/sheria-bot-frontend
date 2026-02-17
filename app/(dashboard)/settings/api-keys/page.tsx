"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Key, Plus, Copy, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react"

const apiKeys = [
  { id: 1, name: "Production API Key", key: "sk_live_xxxxxxxxxxxxxxxxxxxxx", created: "2024-01-15", lastUsed: "2024-01-28" },
  { id: 2, name: "Development API Key", key: "sk_test_xxxxxxxxxxxxxxxxxxxxx", created: "2024-01-10", lastUsed: "2024-01-27" },
]

export default function APIKeysSettingsPage() {
  const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({})
  const [copied, setCopied] = useState<number | null>(null)

  const toggleShowKey = (id: number) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyKey = (id: number, key: string) => {
    navigator.clipboard.writeText(key)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">API Keys</h1>
        <p className="text-muted-foreground mt-1">Manage API keys for integrating with SheriaBot</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" />Your API Keys</CardTitle>
              <CardDescription>Use these keys to authenticate API requests</CardDescription>
            </div>
            <Button className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Create New Key</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{apiKey.name}</p>
                  <p className="text-xs text-muted-foreground">Created: {new Date(apiKey.created).toLocaleDateString("en-KE")} - Last used: {new Date(apiKey.lastUsed).toLocaleDateString("en-KE")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleShowKey(apiKey.id)}>
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => copyKey(apiKey.id, apiKey.key)}>
                    {copied === apiKey.id ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={showKeys[apiKey.id] ? apiKey.key : "sk_xxxx_xxxxxxxxxxxxxxxxxxxxxxxx"}
                  className="font-mono text-sm bg-muted/50"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Your current API usage this billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-foreground">12,456</p>
              <p className="text-sm text-muted-foreground">API Calls</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-foreground">50,000</p>
              <p className="text-sm text-muted-foreground">Monthly Limit</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-foreground">24.9%</p>
              <p className="text-sm text-muted-foreground">Usage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
