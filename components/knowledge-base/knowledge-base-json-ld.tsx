import { absoluteUrl } from "@/lib/site-url";

type KnowledgeBaseJsonLdProps = {
  slug: string;
  title: string;
  description?: string | null;
  author?: string | null;
  datePublished?: string | Date | null;
  dateModified?: string | Date | null;
  category?: string | null;
  tags?: string[];
};

export function KnowledgeBaseJsonLd({
  slug,
  title,
  description,
  author,
  datePublished,
  dateModified,
  category,
  tags = [],
}: KnowledgeBaseJsonLdProps) {
  const url = absoluteUrl(`/knowledge-base/${slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description || undefined,
    url,
    mainEntityOfPage: url,
    datePublished: datePublished ? new Date(datePublished).toISOString() : undefined,
    dateModified: dateModified ? new Date(dateModified).toISOString() : undefined,
    articleSection: category || undefined,
    keywords: tags.length ? tags.join(", ") : undefined,
    author: {
      "@type": "Organization",
      name: author || "SheriaBot Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "SheriaBot",
      url: absoluteUrl("/"),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
