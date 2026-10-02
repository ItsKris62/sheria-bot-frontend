"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

const SIDEBAR_STORAGE_KEY = "sheriabot_sidebar_collapsed"

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const [collapsed, setCollapsedState] = useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Hydration-safe initial sync from localStorage without triggering cascading render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        const val = stored === "true"
        queueMicrotask(() => setCollapsedState(val))
      }
    } catch {
      // Storage unavailable / blocked
    }
  }, [])

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v)
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(v))
    } catch {
      // Storage unavailable / blocked
    }
  }

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}

