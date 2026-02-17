"use client"

import React from "react"
import Link from "next/link"
import { Scale } from "lucide-react"
import { GuestGuard } from "@/components/auth-guard"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-card border-r border-border p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SheriaBot</span>
          </Link>

          <div className="max-w-md">
            <blockquote className="space-y-4">
              <p className="text-xl leading-relaxed text-foreground">
                &ldquo;SheriaBot has revolutionized how we handle regulatory compliance. What used to take our legal team weeks now takes hours.&rdquo;
              </p>
              <footer>
                <p className="font-semibold text-foreground">James Ochieng</p>
                <p className="text-sm text-muted-foreground">Chief Compliance Officer, PayWise Kenya</p>
              </footer>
            </blockquote>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SheriaBot. All rights reserved.
          </p>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between px-6 lg:hidden border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SheriaBot</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center p-6">
            {children}
          </div>
        </div>
      </div>
    </GuestGuard>
  )
}
