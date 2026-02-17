"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Scale, Menu, ChevronDown, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  sectionId?: string
}

const navigation: NavItem[] = [
  { name: "Features", href: "/#features", sectionId: "features" },
  { name: "Solutions", href: "/#solutions", sectionId: "solutions" },
  { name: "Pricing", href: "/#pricing", sectionId: "pricing" },
  { name: "Testimonials", href: "/#testimonials", sectionId: "testimonials" },
  { name: "Knowledge Base", href: "/knowledge-base" },
  { name: "Blog", href: "/blog" },
]

const solutions = [
  { name: "For Regulators", href: "/solutions/regulators", description: "Policy generation & corpus management" },
  { name: "For Startups", href: "/solutions/startups", description: "Compliance queries & checklists" },
  { name: "For Enterprise", href: "/solutions/enterprise", description: "Multi-org management & integrations" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const pathname = usePathname()
  const isHome = pathname === "/"

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  // Scroll listener for background transition
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // IntersectionObserver for active section detection
  useEffect(() => {
    if (!isHome) {
      setActiveSection("")
      return
    }

    const sectionIds = navigation
      .filter((item) => item.sectionId)
      .map((item) => item.sectionId as string)

    const observers: IntersectionObserver[] = []

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) continue

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                setActiveSection(id)
              }
            }
          },
          {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0,
          }
        )

        observer.observe(element)
        observers.push(observer)
      }
    }, 100)

    return () => {
      clearTimeout(timeout)
      for (const obs of observers) obs.disconnect()
    }
  }, [isHome])

  const handleNavClick = (item: NavItem) => {
    if (item.sectionId && isHome) {
      const el = document.getElementById(item.sectionId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-6 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          scrolled
            ? "bg-background/60 backdrop-blur-2xl backdrop-saturate-150 border border-primary/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(34,197,94,0.05)] translate-y-0"
            : "bg-background/20 backdrop-blur-md border border-transparent translate-y-0"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-all duration-300 hover:opacity-90"
        >
          <div className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-500",
            scrolled
              ? "bg-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              : "bg-primary/80"
          )}>
            <Scale className="h-4.5 w-4.5 text-primary-foreground transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold text-foreground tracking-tight">SheriaBot</span>
            <span className="text-[9px] text-primary/80 font-semibold tracking-[0.15em] uppercase mt-0.5">Kenya Fintech</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => {
            const isActive = item.sectionId
              ? activeSection === item.sectionId
              : pathname === item.href

            if (item.name === "Solutions") {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300 outline-none",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300" />
                      {isActive && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-primary transition-all duration-500" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-72 rounded-2xl border-border/30 bg-background/80 backdrop-blur-2xl backdrop-saturate-150 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.4)] animate-slide-down"
                  >
                    {solutions.map((sol) => (
                      <DropdownMenuItem key={sol.name} asChild className="rounded-xl focus:bg-primary/10 cursor-pointer">
                        <Link href={sol.href} className="flex flex-col items-start gap-1 py-3 px-3">
                          <span className="font-medium text-foreground">{sol.name}</span>
                          <span className="text-xs text-muted-foreground">{sol.description}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavClick(item)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300 outline-none",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.sectionId && isHome ? (
                  <span>{item.name}</span>
                ) : (
                  <Link href={item.href}>{item.name}</Link>
                )}

                {/* Active indicator pill */}
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isActive ? "w-5 opacity-100" : "w-0 opacity-0"
                  )}
                />
              </button>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            asChild
            className="text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300 rounded-xl h-9"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            className={cn(
              "relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-9 text-sm font-semibold transition-all duration-500",
              scrolled
                ? "shadow-[0_0_20px_rgba(34,197,94,0.25)]"
                : "shadow-[0_0_12px_rgba(34,197,94,0.15)]"
            )}
          >
            <Link href="/register" className="flex items-center gap-1.5">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-foreground/5 transition-all duration-300 h-9 w-9"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 bg-background/95 backdrop-blur-2xl backdrop-saturate-150 border-l border-border/30"
          >
            <div className="flex flex-col gap-8 pt-8">
              {/* Mobile Logo */}
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <Scale className="h-4.5 w-4.5 text-primary-foreground" />
                </div>
                <span className="text-base font-bold text-foreground">SheriaBot</span>
              </Link>

              {/* Mobile Solutions */}
              <div className="flex flex-col gap-2">
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-1">Solutions</p>
                {solutions.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="group rounded-xl px-3 py-3 transition-all duration-300 hover:bg-primary/5 border border-transparent hover:border-primary/10"
                  >
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors duration-300">{item.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </Link>
                ))}
              </div>

              {/* Mobile Navigation */}
              <div className="flex flex-col gap-1">
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 mb-2">Navigation</p>
                {navigation
                  .filter((item) => item.name !== "Solutions")
                  .map((item) => {
                    const isActive = item.sectionId
                      ? activeSection === item.sectionId
                      : pathname === item.href

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground border border-transparent"
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
              </div>

              {/* Mobile CTA */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  asChild
                  className="w-full rounded-xl bg-transparent border-border/30 hover:bg-foreground/5 hover:border-primary/20 h-11"
                >
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.25)] h-11"
                >
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
