import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scale, ChevronLeft } from "lucide-react"

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/startup">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Support</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}
