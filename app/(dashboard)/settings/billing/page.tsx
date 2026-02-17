"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, CheckCircle2, ArrowRight } from "lucide-react"

const invoices = [
  { id: "INV-2024-001", date: "2024-01-15", amount: "KES 50,000", status: "paid" },
  { id: "INV-2023-012", date: "2023-12-15", amount: "KES 50,000", status: "paid" },
  { id: "INV-2023-011", date: "2023-11-15", amount: "KES 50,000", status: "paid" },
]

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and payment methods</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Enterprise Plan</CardTitle>
                <CardDescription>Your current subscription plan</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold text-foreground">KES 50,000</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <div className="space-y-2 mb-6">
              {["Unlimited compliance queries", "Unlimited checklists & templates", "Priority support (4hr response)", "Custom integrations", "Dedicated account manager", "API access"].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Change Plan</Button>
              <Button variant="outline" className="text-destructive bg-transparent">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" />Payment Method</CardTitle>
            <CardDescription>Your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">M-Pesa Business</p>
                  <p className="text-sm text-muted-foreground">Paybill: 123456</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary">Default</Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent">Add Payment Method</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Download your past invoices</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString("en-KE")}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">{invoice.amount}</span>
                    <Badge className="bg-primary/10 text-primary">Paid</Badge>
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
