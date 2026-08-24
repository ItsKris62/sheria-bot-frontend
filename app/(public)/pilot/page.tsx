/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-PILOT-006
 * Route: /pilot
 * Purpose: Closed beta pilot program overview (noindex)
 * Sprint: SEO Sprint 1
 */

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Scale, Shield, Zap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "SheriaBot Pilot Programme | Regulatory Intelligence Beta",
  description:
    "Apply for the SheriaBot 90-day Pilot Programme for Kenyan fintechs and regulated entities. Full Enterprise access with no payment required.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function PilotOverviewPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Closed Beta
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The SheriaBot Pilot Programme
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Early access for Kenyan fintechs, SACCOs, microfinance institutions, and banks to evaluate
            SheriaBot Enterprise tier capabilities for 90 days at zero cost.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/pilot/apply">
                Apply for Pilot Access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
