"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}