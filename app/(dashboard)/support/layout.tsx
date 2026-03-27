"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { LOGOS } from "@/lib/constants/logos"

function dashboardHref(role?: string): string {
  if (role === "REGULATOR") return "/regulator"
  if (role === "ADMIN") return "/admin"
  return "/startup"
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = useAuthStore((s) => s.user?.role)
  const backHref = dashboardHref(role)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGOS.navigationBar}
              alt="SheriaBot"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
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
