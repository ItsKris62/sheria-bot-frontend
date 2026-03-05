import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from '@/components/providers'
import { JsonLd } from '@/components/seo/json-ld'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const BASE_URL = 'https://sheriabot.com'

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SheriaBot — AI-Powered Regulatory Intelligence for Kenya Fintech',
    template: '%s | SheriaBot',
  },
  description:
    "Navigate Kenya's fintech regulatory landscape with AI-powered compliance intelligence. Generate policies, track regulations, and ensure compliance with CBK, Data Protection Act, AML/KYC, and more.",
  keywords: [
    'Kenya fintech compliance',
    'CBK regulations',
    'AML KYC Kenya',
    'Data Protection Act Kenya',
    'fintech regulatory intelligence',
    'compliance automation',
    'regulatory sandbox Kenya',
    'SheriaBot',
  ],
  authors: [{ name: 'SheriaBot', url: BASE_URL }],
  creator: 'SheriaBot',
  publisher: 'SheriaBot',

  // ── Canonical & Alternates ────────────────────────────────────────────────
  alternates: {
    canonical: '/',
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: BASE_URL,
    siteName: 'SheriaBot',
    title: 'SheriaBot — AI-Powered Regulatory Intelligence for Kenya Fintech',
    description:
      "Navigate Kenya's fintech regulatory landscape with AI-powered compliance intelligence. Generate policies, track regulations, and ensure compliance.",
    images: [
      {
        url: '/open-graph-logo.png',
        width: 1200,
        height: 630,
        alt: 'SheriaBot — AI Compliance Intelligence for Kenya Fintech',
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'SheriaBot — AI-Powered Regulatory Intelligence for Kenya Fintech',
    description:
      "Navigate Kenya's fintech regulatory landscape with AI-powered compliance intelligence.",
    images: ['/twitter-header-logo.png'],
    // creator: '@sheriabot',   // uncomment when you have a Twitter handle
    // site: '@sheriabot',
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon-logo.png' },
      { url: '/android-chrome-icon-logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-icon-logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-logo.png',
    apple: '/apple-touch-icon-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0e17',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Global JSON-LD: WebSite + Organization schema */}
        <JsonLd />

        <Providers>{children}</Providers>

        {/* Vercel Analytics — tracks page views and custom events */}
        <Analytics />

        {/* Vercel Speed Insights — tracks Core Web Vitals */}
        <SpeedInsights />
      </body>
    </html>
  )
}
