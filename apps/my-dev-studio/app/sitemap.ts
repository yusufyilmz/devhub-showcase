import type { MetadataRoute } from "next";

import { urls } from "@shared/config";
import { listPublishedPortfolioLinks } from "@shared/services/published-profile";
// No build-time database snapshot or stale entries after unpublishing.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await listPublishedPortfolioLinks();
  return [
    { url: urls.studio.siteUrl().toString() },
    ...profiles.map(({ username, updatedAt }) => ({
      url: urls.studio.portfolioUrl(username),
      ...(updatedAt ? { lastModified: updatedAt } : {}),
    })),
  ];
}
