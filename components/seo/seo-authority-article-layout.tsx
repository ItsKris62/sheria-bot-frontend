/**
 * SheriaBot SEO
 * File ID: SEO-S03-COMP-AUTHORITY-LAYOUT-010
 * Purpose: Reusable Server Component presentation wrapper for legal authority pages
 * Sprint: SEO Sprint 3
 */

import React from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  ShieldCheck,
  Scale,
  ExternalLink,
  BookOpen,
  Calendar,
  Building2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SeoBreadcrumbJsonLd, type BreadcrumbItem } from './seo-breadcrumb-json-ld'

export interface PrimarySource {
  title: string
  instrument: string
  url: string
  authority: string
}

export interface SeoAuthorityArticleLayoutProps {
  breadcrumbs: BreadcrumbItem[]
  badgeText?: string
  h1: string
  subtitle?: string
  jurisdiction?: string
  lastReviewed?: string
  governingAuthority?: string
  quickAnswer: React.ReactNode
  appliesTo: React.ReactNode
  primarySources: PrimarySource[]
  ctaTitle?: string
  ctaDescription?: string
  ctaButtonText?: string
  ctaHref?: string
  children: React.ReactNode
}

export function SeoAuthorityArticleLayout({
  breadcrumbs,
  badgeText = 'Kenya Regulatory Authority Guide',
  h1,
  subtitle,
  jurisdiction = 'Kenya',
  lastReviewed = 'August 2026',
  governingAuthority,
  quickAnswer,
  appliesTo,
  primarySources,
  ctaTitle = 'Verify Your FinTech Regulatory Compliance',
  ctaDescription = 'Evaluate compliance readiness against primary Kenyan statutory instruments with SheriaBot automated intelligence.',
  ctaButtonText = 'Explore Compliance Plans',
  ctaHref = '/pricing',
  children,
}: SeoAuthorityArticleLayoutProps) {
  return (
    <article className="min-h-screen bg-background text-foreground">
      {/* Structured Data */}
      <SeoBreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero / Header Section */}
      <header className="border-b border-border/40 bg-muted/20 py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          {/* Visual Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <li key={crumb.url} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                    {isLast ? (
                      <span className="font-medium text-foreground" aria-current="page">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.url}
                        className="transition-colors hover:text-foreground hover:underline"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* Badge & Meta */}
          <div className="flex flex-wrap items-center gap-2.5 pb-4">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-medium">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              {badgeText}
            </Badge>
            {governingAuthority && (
              <Badge variant="secondary" className="font-normal">
                <Building2 className="mr-1.5 h-3.5 w-3.5" />
                {governingAuthority}
              </Badge>
            )}
          </div>

          {/* H1 Heading */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground mb-4">
            {h1}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Authority Metadata Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-4">
            <span className="flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-primary" />
              Jurisdiction: <strong className="font-semibold text-foreground">{jurisdiction}</strong>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              Last reviewed: <strong className="font-semibold text-foreground">{lastReviewed}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-12">
        {/* Quick Answer Snippet Box */}
        <section aria-labelledby="quick-answer-heading" className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <div className="flex items-center gap-2.5 text-primary mb-3">
            <BookOpen className="h-5 w-5" />
            <h2 id="quick-answer-heading" className="text-lg font-semibold tracking-tight">
              Quick Regulatory Summary
            </h2>
          </div>
          <div className="text-base leading-relaxed text-foreground/90 space-y-2">
            {quickAnswer}
          </div>
        </section>

        {/* Who This Applies To */}
        <section aria-labelledby="applies-to-heading" className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 id="applies-to-heading" className="text-xl font-bold tracking-tight text-foreground mb-4">
            Who This Regulatory Guidance Applies To
          </h2>
          <div className="text-base leading-relaxed text-muted-foreground space-y-3">
            {appliesTo}
          </div>
        </section>

        {/* Core Article Body Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          {children}
        </div>

        {/* Primary Regulatory Sources Box */}
        <section aria-labelledby="primary-sources-heading" className="rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4">
            <Scale className="h-5 w-5 text-primary" />
            <h2 id="primary-sources-heading" className="text-xl font-bold tracking-tight text-foreground">
              Primary Regulatory Sources & References
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This guide is strictly grounded in official statutory instruments and regulator publications in Kenya:
          </p>
          <ul className="space-y-3">
            {primarySources.map((source) => (
              <li key={source.url} className="flex items-start gap-3 text-sm">
                <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {source.title}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {source.instrument} • {source.authority}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Statutory & Legal Disclaimer */}
        <section aria-labelledby="disclaimer-heading" className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium mb-1.5">
            <AlertTriangle className="h-4 w-4" />
            <h3 id="disclaimer-heading" className="text-sm font-semibold">
              Statutory Information Disclaimer
            </h3>
          </div>
          <p className="leading-relaxed">
            This publication provides general regulatory intelligence and educational guidance based on verified primary Kenyan statutes. Regulatory applicability varies based on specific corporate structures, licensing categories, and operational models. This guide does not constitute formal legal counsel. For organization-specific licensing applications, consult qualified Kenyan legal and compliance professionals.
          </p>
        </section>

        {/* Product Bridge CTA Card */}
        <section aria-labelledby="cta-heading">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h2 id="cta-heading" className="text-2xl font-bold tracking-tight text-foreground">
                  {ctaTitle}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {ctaDescription}
                </p>
              </div>
              <Button asChild size="lg" className="shrink-0">
                <Link href={ctaHref}>
                  {ctaButtonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </article>
  )
}
