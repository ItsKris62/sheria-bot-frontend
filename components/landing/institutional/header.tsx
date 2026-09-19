'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InstitutionalHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Regulatory Guides', href: '/knowledge-base' },
    { label: 'Knowledge Base', href: '/knowledge-base' },
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 border-b border-zinc-200 shadow-sm backdrop-blur-sm'
          : 'bg-white border-b border-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#00875A] flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖</span>
            </div>
            <span className="font-bold text-lg text-zinc-900 hidden sm:block">
              Sheria<span className="text-[#00875A]">Bot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-[#00875A] transition-colors rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Sign In
            </Link>
            <Button
              asChild
              className="bg-[#00875A] hover:bg-[#006844] text-white font-semibold px-6 py-2 rounded-lg"
            >
              <Link href="/signup">Book a Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-zinc-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-zinc-600 hover:text-[#00875A] hover:bg-zinc-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex gap-2">
              <Link
                href="/login"
                className="flex-1 px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 text-center rounded-lg border border-zinc-200"
              >
                Sign In
              </Link>
              <Button
                asChild
                className="flex-1 bg-[#00875A] hover:bg-[#006844] text-white font-semibold rounded-lg"
              >
                <Link href="/signup">Book a Demo</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
