import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - SheriaBot",
  description: "System administration and platform management",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
