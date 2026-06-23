import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erp-king.vercel.app";

// Only the publicly reachable pages belong here. Lesson/module pages are
// behind authentication (see middleware.ts), so crawlers can't index them.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/pricing", priority: 0.7 },
    { path: "/login", priority: 0.4 },
    { path: "/register", priority: 0.5 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));
}
