/**
 * SheriaBot SEO
 * File ID: SEO-S03-KB-STATIC-REGISTRY-017
 * Purpose: Centralized registry for statutory Knowledge Base authority articles with discovery, search, filtering, and duplicate-slug protection
 * Sprint: SEO Sprint 3
 */

import type { KnowledgeBaseArticle, PublishedKnowledgeBaseResponse } from "@/components/knowledge-base/types";
import { absoluteUrl } from "@/lib/site-url";

export interface StaticKnowledgeBaseRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  subcategory: string;
  tags: string[];
  jurisdiction: string;
  jurisdictionCode: string;
  regulator: string;
  canonicalPath: string;
  publishedAt: string;
  updatedAt: string;
  lastReviewedAt: string;
  readingTime: number;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export const STATIC_KNOWLEDGE_BASE_REGISTRY: readonly StaticKnowledgeBaseRecord[] = [
  {
    id: "seo-s03-ke-kb-dpia-008",
    slug: "dpia-data-protection-impact-assessment-kenya",
    title: "Data Protection Impact Assessment (DPIA) Guide for Kenyan FinTechs",
    excerpt:
      "Step-by-step practical guide to conducting a Data Protection Impact Assessment (DPIA) in Kenya under Section 31 DPA 2019 and Regulation 49 General Regulations 2021.",
    category: "Data Protection",
    subcategory: "ODPC Compliance",
    tags: ["DPIA", "ODPC", "Data Protection", "Kenya", "FinTech", "Compliance"],
    jurisdiction: "Kenya",
    jurisdictionCode: "KE",
    regulator: "Office of the Data Protection Commissioner (ODPC)",
    canonicalPath: "/knowledge-base/dpia-data-protection-impact-assessment-kenya",
    publishedAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    lastReviewedAt: "August 2026",
    readingTime: 6,
    author: {
      id: "sheriabot-editorial",
      name: "SheriaBot Regulatory Intelligence",
      avatar: null,
    },
  },
  {
    id: "seo-s03-ke-kb-dcp-annual-009",
    slug: "cbk-dcp-annual-compliance-return-fees-guide",
    title: "CBK DCP Annual Compliance Return & Annual Fee Guide",
    excerpt:
      "Operational compliance manual for licensed Kenyan Digital Credit Providers. Understand Regulation 5(6) annual fees, Regulation 5(7) compliance returns, and December 31 deadlines.",
    category: "Digital Lending",
    subcategory: "CBK Compliance",
    tags: ["CBK", "DCP", "Digital Credit", "Annual Return", "Kenya", "FinTech", "Compliance"],
    jurisdiction: "Kenya",
    jurisdictionCode: "KE",
    regulator: "Central Bank of Kenya (CBK)",
    canonicalPath: "/knowledge-base/cbk-dcp-annual-compliance-return-fees-guide",
    publishedAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    lastReviewedAt: "August 2026",
    readingTime: 5,
    author: {
      id: "sheriabot-editorial",
      name: "SheriaBot Regulatory Intelligence",
      avatar: null,
    },
  },
  {
    id: "seo-s04-ke-kb-odpc-renewal-012",
    slug: "odpc-data-protection-registration-renewal-kenya",
    title: "ODPC Data Protection Certificate Renewal Guide for Kenyan FinTechs",
    excerpt:
      "Complete operational manual for renewing your ODPC Data Controller and Data Processor registration certificate under Regulation 11 of the 2021 Regulations.",
    category: "Data Protection",
    subcategory: "ODPC Compliance",
    tags: ["ODPC", "Renewal", "Data Protection", "Kenya", "FinTech", "Compliance"],
    jurisdiction: "Kenya",
    jurisdictionCode: "KE",
    regulator: "Office of the Data Protection Commissioner (ODPC)",
    canonicalPath: "/knowledge-base/odpc-data-protection-registration-renewal-kenya",
    publishedAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    lastReviewedAt: "August 2026",
    readingTime: 5,
    author: {
      id: "sheriabot-editorial",
      name: "SheriaBot Regulatory Intelligence",
      avatar: null,
    },
  },
  {
    id: "seo-s04-ke-kb-frc-goaml-013",
    slug: "frc-goaml-registration-str-reporting-guide",
    title: "FRC goAML Portal Registration & STR Reporting Guide for FinTechs",
    excerpt:
      "Operational step-by-step manual for registering reporting institutions on goAML and filing Suspicious Transaction Reports (STRs) within two days under POCAMLA Cap. 59A.",
    category: "Anti-Money Laundering",
    subcategory: "FRC Compliance",
    tags: ["FRC", "goAML", "STR", "AML", "POCAMLA", "Kenya", "FinTech", "Compliance"],
    jurisdiction: "Kenya",
    jurisdictionCode: "KE",
    regulator: "Financial Reporting Centre (FRC)",
    canonicalPath: "/knowledge-base/frc-goaml-registration-str-reporting-guide",
    publishedAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    lastReviewedAt: "August 2026",
    readingTime: 6,
    author: {
      id: "sheriabot-editorial",
      name: "SheriaBot Regulatory Intelligence",
      avatar: null,
    },
  },
  {
    id: "seo-s04-ke-kb-checklist-014",
    slug: "kenya-fintech-compliance-checklist-calendar",
    title: "Kenya FinTech Compliance Checklist & Statutory Deadlines Manual",
    excerpt:
      "Consolidated operational compliance checklist and annual statutory calendar for fintechs in Kenya covering CBK, ODPC, FRC, and CMA filing obligations.",
    category: "FinTech Compliance",
    subcategory: "Multi-Regulator Governance",
    tags: ["Checklist", "Deadlines", "Calendar", "CBK", "ODPC", "FRC", "Kenya", "FinTech", "Compliance"],
    jurisdiction: "Kenya",
    jurisdictionCode: "KE",
    regulator: "Multi-Regulator (CBK, ODPC, FRC, CMA)",
    canonicalPath: "/knowledge-base/kenya-fintech-compliance-checklist-calendar",
    publishedAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    lastReviewedAt: "August 2026",
    readingTime: 7,
    author: {
      id: "sheriabot-editorial",
      name: "SheriaBot Regulatory Intelligence",
      avatar: null,
    },
  },
];

export function getStaticKnowledgeBaseRecords(): readonly StaticKnowledgeBaseRecord[] {
  return STATIC_KNOWLEDGE_BASE_REGISTRY;
}

export function staticRecordToArticle(record: StaticKnowledgeBaseRecord): KnowledgeBaseArticle {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    category: record.category,
    subcategory: record.subcategory,
    tags: record.tags,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
    viewCount: 0,
    readingTime: record.readingTime,
    author: record.author,
  };
}

export function filterStaticKnowledgeBase(input: {
  search?: string;
  category?: string;
  tag?: string;
}): KnowledgeBaseArticle[] {
  const query = input.search?.trim().toLowerCase();
  const category = input.category?.trim().toLowerCase();
  const tag = input.tag?.trim().toLowerCase();

  return STATIC_KNOWLEDGE_BASE_REGISTRY.filter((record) => {
    if (category && record.category.toLowerCase() !== category) {
      return false;
    }

    if (tag && !record.tags.some((t) => t.toLowerCase() === tag)) {
      return false;
    }

    if (query) {
      const tokens = query.split(/\s+/).filter(Boolean);
      const searchableText = `${record.title} ${record.excerpt} ${record.tags.join(" ")} ${record.category} ${record.subcategory} ${record.regulator} ${record.jurisdiction}`.toLowerCase();
      const allTokensMatch = tokens.every((token) => searchableText.includes(token));
      if (!allTokensMatch) {
        return false;
      }
    }

    return true;
  }).map(staticRecordToArticle);
}

/**
 * Merges backend published articles with static registry articles while strictly enforcing duplicate-slug protection.
 * Throws an error (fails closed) if a backend article has the same slug as a static authority article.
 */
export function mergeKnowledgeBaseDiscovery(
  backendData: PublishedKnowledgeBaseResponse | null,
  input: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
  }
): PublishedKnowledgeBaseResponse {
  const page = input.page && input.page > 0 ? input.page : 1;
  const limit = input.limit && input.limit > 0 ? input.limit : 9;

  const staticArticles = filterStaticKnowledgeBase(input);
  const staticSlugs = new Set(STATIC_KNOWLEDGE_BASE_REGISTRY.map((r) => r.slug));

  const backendArticles = backendData?.items || [];

  // Strict Duplicate-Slug Protection
  for (const item of backendArticles) {
    if (staticSlugs.has(item.slug)) {
      throw new Error(
        `Duplicate Knowledge Base slug ownership: ${item.slug}. ` +
          `A static authority record already owns this canonical slug.`
      );
    }
  }

  // Combine static articles with backend articles
  // Static authority guides appear at the front of results when matching
  const allArticles = [...staticArticles, ...backendArticles];
  const total = (backendData?.pagination.total || 0) + staticArticles.length;
  const totalPages = Math.ceil(total / limit) || 1;

  // Slice pagination for combined set
  const startIndex = (page - 1) * limit;
  const paginatedItems = allArticles.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
