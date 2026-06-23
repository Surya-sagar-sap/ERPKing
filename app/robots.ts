import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erp-king.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // These are login-gated or non-public — keep them out of search results.
      disallow: ["/admin", "/api", "/dashboard", "/learn", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
