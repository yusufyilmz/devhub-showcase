import type { MetadataRoute } from "next";

import { listPublishedPortfolioLinks } from "@shared/lib/published-profile";

import { portfolioUrl, siteUrl } from "@/features/platform/site-url";

// No build-time database snapshot or stale entries after unpublishing.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await listPublishedPortfolioLinks();
  return [
    { url: siteUrl },
    ...profiles.map(({ username, updatedAt }) => ({
      url: portfolioUrl(username),
      ...(updatedAt ? { lastModified: updatedAt } : {}),
    })),
  ];
}
