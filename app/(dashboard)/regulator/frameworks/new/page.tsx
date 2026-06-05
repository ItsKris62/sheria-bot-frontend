"use client"

import Link from "next/link"
import { ArrowLeft, Layers, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeatureGate, LockedFeatureCard } from "@/components/plan/feature-gate"

function ComingSoonState() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/regulator/frameworks"
          className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Frameworks
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Custom Frameworks</h1>
        <p className="mt-1 text-muted-foreground">
          Custom framework creation is coming soon. Enterprise customers can contact SheriaBot to configure private frameworks.
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="font-semibold text-foreground">Managed by SheriaBot Admin</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Organization-owned framework ingestion, approval workflows, and private RAG scoping are not enabled from this workspace yet.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Enterprise gated
                </span>
                <span className="rounded-md border border-border px-2 py-1">No mock submissions</span>
                <span className="rounded-md border border-border px-2 py-1">Server-side setup required</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/support">Contact SheriaBot</Link>
        </Button>
      </div>
    </div>
  )
}

export default function NewFrameworkPage() {
  return (
    <FeatureGate
      feature="customFrameworks"
      fallback={
        <LockedFeatureCard
          feature="customFrameworks"
          requiredPlan="ENTERPRISE"
          title="Custom Frameworks"
          description="Custom frameworks are available on Enterprise plans."
        />
      }
    >
      <ComingSoonState />
    </FeatureGate>
  )
}
