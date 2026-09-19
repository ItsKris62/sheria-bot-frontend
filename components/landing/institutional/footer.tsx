'use client'

import React from 'react'
import Link from 'next/link'

export function InstitutionalFooter() {
  const footerSections = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Knowledge Base', href: '/knowledge-base' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'Data Protection', href: '/data-protection' },
    ],
  }

  return (
    <footer className="bg-white border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#00875A] flex items-center justify-center">
                <span className="text-white font-bold text-xs">⚖</span>
              </div>
              <span className="font-bold text-zinc-900">
                Sheria<span className="text-[#00875A]">Bot</span>
              </span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              AI-powered regulatory intelligence for African FinTechs. Navigate compliance with confidence.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerSections.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-[#00875A] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-[#00875A] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerSections.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-[#00875A] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
            <p>
              © {new Date().getFullYear()} SheriaBot. All rights reserved.
            </p>
            <p>
              <strong>Disclaimer:</strong> SheriaBot provides AI regulatory intelligence and gap analysis. It does not constitute formal legal counsel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
