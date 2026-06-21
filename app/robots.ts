import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

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
