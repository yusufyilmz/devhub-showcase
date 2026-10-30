import { listPublishedPortfolioLinks } from "@shared/lib/published-profile";
import type { MetadataRoute } from "next";
import { portfolioUrl, siteUrl } from "../lib/site-url";

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
