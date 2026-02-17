"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Database, Server, Shield, Mail, RefreshCw, Save, AlertTriangle } from "lucide-react"

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-1">Platform configuration and maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Restart Services</Button>
          <Button className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" />System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Server</span>
              <Badge className="bg-primary/10 text-primary">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <Badge className="bg-primary/10 text-primary">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AI Service</span>
              <Badge className="bg-primary/10 text-primary">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <Badge className="bg-warning/10 text-warning">78% Used</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-medium text-foreground">99.9% (30 days)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Require 2FA for all admin users</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">IP Whitelisting</p>
                <p className="text-xs text-muted-foreground">Restrict admin access by IP</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Audit Logging</p>
                <p className="text-xs text-muted-foreground">Log all system activities</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Email Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input defaultValue="smtp.sendgrid.net" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input defaultValue="587" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input defaultValue="noreply@sheriabot.co.ke" className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connection Pool</span>
              <span className="text-sm font-medium text-foreground">45/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="text-sm text-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database Size</span>
              <span className="text-sm text-foreground">2.4 GB</span>
            </div>
            <Button variant="outline" className="w-full bg-transparent">Run Manual Backup</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2 border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                <p className="text-sm text-muted-foreground mt-1">Enable maintenance mode to temporarily disable the platform for updates or maintenance. Users will see a maintenance page.</p>
                <Button variant="outline" className="mt-4 bg-transparent">Enable Maintenance Mode</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
