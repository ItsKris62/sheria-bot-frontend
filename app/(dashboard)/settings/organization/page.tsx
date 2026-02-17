"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Upload, Save } from "lucide-react"

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your organization profile and details</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>Update your organization information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Upload Logo</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input defaultValue="Safaricom PLC" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input defaultValue="CPR/2023/123456" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input defaultValue="Financial Services / Fintech" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input defaultValue="https://safaricom.co.ke" className="bg-muted/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Textarea defaultValue="Safaricom House, Waiyaki Way, Nairobi, Kenya" className="bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Primary contact for regulatory matters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input defaultValue="John Kamau" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input defaultValue="Chief Compliance Officer" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="john.kamau@safaricom.co.ke" className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+254 712 345 678" className="bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
