"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, MessageSquare, AlertTriangle, FileText, Calendar, Save } from "lucide-react"

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">Manage how you receive notifications and alerts</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Email Notifications</CardTitle>
            <CardDescription>Configure email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: AlertTriangle, title: "Regulatory Updates", desc: "Get notified about new regulations and changes" },
              { icon: Calendar, title: "Deadline Reminders", desc: "Receive reminders for upcoming compliance deadlines" },
              { icon: FileText, title: "Report Ready", desc: "Get notified when reports and analyses are complete" },
              { icon: MessageSquare, title: "Support Responses", desc: "Receive email when support replies to your tickets" },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" />In-App Notifications</CardTitle>
            <CardDescription>Configure in-app notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Real-time Alerts", desc: "Show notifications for important updates in real-time" },
              { title: "Sound Notifications", desc: "Play a sound when new notifications arrive" },
              { title: "Desktop Notifications", desc: "Show browser notifications on your desktop" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={index === 0} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Email Digest</CardTitle>
            <CardDescription>Configure summary email preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Daily Digest", desc: "Receive a daily summary of all activities" },
              { title: "Weekly Report", desc: "Receive a weekly compliance status report" },
              { title: "Monthly Newsletter", desc: "Receive monthly regulatory insights and tips" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={index === 1} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-2" />Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
