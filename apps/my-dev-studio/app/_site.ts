import { headers } from "next/headers";
import { cache } from "react";

import { createProfileStructuredData } from "@shared/assistant/structured-data";
import { type PortfolioProfile, urls } from "@shared/config";
import { createPageMetadata, createStructuredData } from "@shared/ui/seo";

export const platformSeo = {
  description:
    "Create a portfolio that feels like you. Share your projects, tell your story, and download a CV from the same information.",
  imagePath: "/share.png",
  name: "MyDevStudio",
  shareSubtitle: "Build a portfolio, tell your story, and download your CV.",
  shareTitle: "A home for your work",
  url: urls.studio.siteUrl().toString(),
};

export const platformDescription = platformSeo.description;
const platformTitle = `${platformSeo.name} | ${platformSeo.shareTitle}`;

export const platformMetadata = createPageMetadata({
  canonical: urls.studio.siteUrl().toString(),
  description: platformDescription,
  icons: { icon: "/studio-icon.svg" },
  image: { alt: platformTitle, url: new URL(platformSeo.imagePath, platformSeo.url).href },
  keywords: ["portfolio", "portfolio builder", "developer portfolio", "CV", platformSeo.name],
  siteName: platformSeo.name,
  title: platformTitle,
});

export const platformStructuredData = createStructuredData({
  "@type": "WebSite",
  description: platformDescription,
  name: platformSeo.name,
  url: platformSeo.url,
});
/** The proxy overwrites this header from the actual pathname. */
export const isPlatformPath = (path: string) =>
  path === "/" ||
  path === "/login" ||
  /^\/[a-z0-9-]+\/(?:access|chat)$/.test(path) ||
  path === "/admin/chat" ||
  path === "/admin/portfolios" ||
  path.startsWith("/admin/portfolios/") ||
  path === "/p/examples" ||
  path.startsWith("/p/examples/");
export const isPlatformPage = cache(async () => {
  const path = (await headers()).get("x-profile-path") ?? "/";
  return isPlatformPath(path);
});

export const getProfileStructuredData = (profile?: PortfolioProfile, canonicalUrl?: string) =>
  profile ? createProfileStructuredData(profile, canonicalUrl) : platformStructuredData;
