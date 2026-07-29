export type KnowledgeBaseAuthor = {
  id: string;
  name: string | null;
  avatar: string | null;
};

export type KnowledgeBaseArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  subcategory: string | null;
  tags: string[];
  publishedAt: string | Date | null;
  updatedAt: string | Date;
  viewCount: number;
  readingTime?: number;
  author: KnowledgeBaseAuthor | null;
};

export type KnowledgeBaseArticleDetail = KnowledgeBaseArticle & {
  contentType: string;
  content: string | null;
  htmlContent?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  helpfulCount?: number;
  notHelpfulCount?: number;
};

export type PublishedKnowledgeBaseResponse = {
  items: KnowledgeBaseArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
