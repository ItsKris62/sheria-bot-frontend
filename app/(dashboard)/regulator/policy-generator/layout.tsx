"use client"

import React from "react"
import { ErrorBoundary } from "@/components/error-boundary"

export default function PolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
