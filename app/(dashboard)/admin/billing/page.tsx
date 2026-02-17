"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, TrendingUp, Users, DollarSign, Download, ArrowUpRight } from "lucide-react"

const subscriptions = [
  { plan: "Starter", users: 45, revenue: "KES 225,000", growth: "+12%" },
  { plan: "Professional", users: 32, revenue: "KES 640,000", growth: "+8%" },
  { plan: "Enterprise", users: 12, revenue: "KES 600,000", growth: "+15%" },
]

const recentTransactions = [
  { user: "Safaricom PLC", amount: "KES 50,000", plan: "Enterprise", date: "2024-01-28", status: "completed" },
  { user: "M-Pesa Foundation", amount: "KES 20,000", plan: "Professional", date: "2024-01-27", status: "completed" },
  { user: "KCB Group", amount: "KES 5,000", plan: "Starter", date: "2024-01-26", status: "completed" },
  { user: "Equity Bank", amount: "KES 50,000", plan: "Enterprise", date: "2024-01-25", status: "pending" },
]

export default function BillingAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Revenue</h1>
          <p className="text-muted-foreground mt-1">Manage subscriptions and payments</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">KES 2.4M</p>
              </div>
            </div>
            <Badge className="mt-2 bg-primary/10 text-primary"><TrendingUp className="h-3 w-3 mr-1" />+15% vs last month</Badge>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Subscribers</p>
                <p className="text-2xl font-bold text-foreground">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Revenue/User</p>
                <p className="text-2xl font-bold text-foreground">KES 27K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-warning/10"><ArrowUpRight className="h-5 w-5 text-warning" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-2xl font-bold text-foreground">2.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
            <CardDescription>Revenue by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub.plan} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{sub.plan}</p>
                    <p className="text-sm text-muted-foreground">{sub.users} subscribers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{sub.revenue}</p>
                    <Badge className="bg-primary/10 text-primary text-xs">{sub.growth}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-foreground">{tx.user}</p>
                    <p className="text-xs text-muted-foreground">{tx.plan} - {new Date(tx.date).toLocaleDateString("en-KE")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-foreground">{tx.amount}</p>
                    <Badge className={tx.status === "completed" ? "bg-primary/10 text-primary text-xs" : "bg-warning/10 text-warning text-xs"}>
                      {tx.status}
                    </Badge>
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
