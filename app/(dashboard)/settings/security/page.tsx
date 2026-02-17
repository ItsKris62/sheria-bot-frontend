"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Smartphone, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

const sessions = [
  { device: "Chrome on MacOS", location: "Nairobi, Kenya", lastActive: "Active now", current: true },
  { device: "Safari on iPhone", location: "Nairobi, Kenya", lastActive: "2 hours ago", current: false },
  { device: "Firefox on Windows", location: "Mombasa, Kenya", lastActive: "3 days ago", current: false },
]

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account security and authentication</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" />Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" className="bg-muted/50" />
            </div>
            <Button className="bg-primary text-primary-foreground">Update Password</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" />Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Use an authenticator app for 2FA codes</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">SMS Authentication</p>
                  <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Active Sessions</CardTitle>
            <CardDescription>Manage your active login sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{session.device}</p>
                    {session.current && <Badge className="bg-primary/10 text-primary text-xs">Current</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location} - {session.lastActive}</p>
                </div>
                {!session.current && <Button variant="outline" size="sm">Revoke</Button>}
              </div>
            ))}
            <Button variant="outline" className="w-full text-destructive bg-transparent">Revoke All Other Sessions</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <Button variant="outline" className="mt-4 text-destructive border-destructive bg-transparent">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
