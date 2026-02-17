import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'

import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'SheriaBot - AI-Powered Regulatory Intelligence for Kenya Fintech',
  description: 'Navigate Kenya\'s fintech regulatory landscape with AI-powered compliance intelligence. Generate policies, track regulations, and ensure compliance with CBK, Data Protection Act, and more.',
  keywords: ['Kenya fintech', 'regulatory compliance', 'CBK guidelines', 'AML/KYC', 'Data Protection Act', 'fintech regulations'],
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
