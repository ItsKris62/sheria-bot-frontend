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
        "/dashboard",
        "/startup",
        "/enterprise",
        "/settings",
        "/api",
        "/login",
        "/register",
        "/verify-email",
        "/reset-password"
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
