/**
 * SheriaBot SEO
 * File ID: SEO-S03-COMP-BREADCRUMB-JSONLD-011
 * Purpose: Reusable BreadcrumbList JSON-LD structured data generator
 * Sprint: SEO Sprint 3
 */

import React from 'react'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface SeoBreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function SeoBreadcrumbJsonLd({ items }: SeoBreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
