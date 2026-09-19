import type { Metadata } from "next"
import SheriaBotLandingPage from "@/components/landing/sheriabot-landing-page"

import { absoluteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "SheriaBot — AI Regulatory Intelligence for African FinTech",
  description:
    "Ask any African regulatory question and get an answer cited to primary law — with gap analysis, policies, checklists and change alerts your examiners can actually follow.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "SheriaBot — AI Regulatory Intelligence for African FinTech",
    description:
      "Answers grounded in primary African regulation. Turn compliance research from days into minutes.",
    url: absoluteUrl("/"),
    type: "website",
  },
}

export default function HomePage() {
  return <SheriaBotLandingPage />
}
