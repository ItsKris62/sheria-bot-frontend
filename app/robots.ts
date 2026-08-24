/**
 * SheriaBot SEO
 * File ID: SEO-S01-CORE-ROBOTS-001
 * Route: /robots.txt
 * Purpose: Dynamic robots metadata generation, staging indexing protection, and crawler disallow rules
 * Sprint: SEO Sprint 1
 */

import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const preventIndexing =
    process.env.NEXT_PUBLIC_DISABLE_INDEXING === "true" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "development";

  if (preventIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/dashboard",
        "/dashboard/",
        "/startup",
        "/startup/",
        "/enterprise",
        "/enterprise/",
        "/regulator",
        "/regulator/",
        "/settings",
        "/settings/",
        "/support",
        "/support/",
        "/api",
        "/api/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/change-password",
        "/unsubscribe",
        "/unsubscribe/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
