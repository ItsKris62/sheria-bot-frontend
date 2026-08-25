/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-UNSUB-010
 * Route: /unsubscribe
 * Purpose: Fallback page for direct /unsubscribe visits without token
 * Sprint: SEO Sprint 1
 */

import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnsubscribeIndexPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <Mail className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-2xl font-bold">Email Preferences</h1>
        <p className="text-muted-foreground">
          To manage your email preferences or unsubscribe from marketing emails, please use the
          personalized unsubscribe link found at the bottom of any email from SheriaBot.
        </p>
        <p className="text-sm text-muted-foreground">
          If you need assistance, please contact{" "}
          <a href="mailto:support@sheriabot.com" className="underline text-primary">
            support@sheriabot.com
          </a>.
        </p>
        <div className="pt-4">
          <Button asChild variant="outline">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
