/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-PILOT-007
 * Route: /pilot/apply
 * Purpose: Closed beta pilot application form layout and noindex metadata
 * Sprint: SEO Sprint 1
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apply for the SheriaBot Pilot Programme | SheriaBot",
  description:
    "Apply for 90-day early access to SheriaBot Enterprise regulatory intelligence and compliance tools for Kenyan fintechs.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function PilotApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
