"use client"

import { Card } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

/**
 * Marketing Campaigns List — Placeholder (B2)
 *
 * The full campaign list view is coming in B3.
 * This stub exists so the admin nav and campaign detail back-link don't 404.
 */
export default function CampaignsListPlaceholderPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Marketing Campaigns</h1>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur p-8 text-center">
        <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Campaign list view is coming in B3. For now, you can navigate directly to a campaign by ID.
        </p>
      </Card>
    </div>
  )
}
