"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
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
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/hero-logo.png"
              alt="SheriaBot"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold text-foreground tracking-tight">SheriaBot</span>
              <span className="text-[10px] text-primary/80 font-semibold tracking-[0.15em] uppercase mt-0.5">Kenya Fintech</span>
            </div>
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
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/hero-logo.png"
                alt="SheriaBot"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-foreground tracking-tight">SheriaBot</span>
                <span className="text-[9px] text-primary/80 font-semibold tracking-[0.15em] uppercase mt-0.5">Kenya Fintech</span>
              </div>
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
