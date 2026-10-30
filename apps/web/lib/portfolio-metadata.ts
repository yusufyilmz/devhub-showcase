import type { PortfolioProfile } from "@shared/content";
import type { Metadata } from "next";

import { portfolioUrl, siteUrl } from "./site-url";

export function portfolioMetadata(profile: PortfolioProfile, username: string): Metadata {
  const canonical = portfolioUrl(username);
  const title = `${profile.name} | ${profile.title}`;
  const images = [{ alt: title, height: 630, url: `${canonical}/share.png`, width: 1200 }];
  return {
    alternates: { canonical },
    description: profile.summary,
    icons: {
      icon: [{ type: "image/svg+xml", url: `${canonical}/icon.svg` }],
      shortcut: `${canonical}/icon.svg`,
    },
    keywords: [
      profile.name,
      profile.title,
      "portfolio",
      "CV",
      ...Object.values(profile.skills).flat().slice(0, 20),
    ],
    metadataBase: new URL(siteUrl),
    openGraph: {
      description: profile.summary,
      images,
      locale: { en: "en_US", es: "es_ES", tr: "tr_TR" }[profile.portfolioLanguage ?? "en"],
      siteName: "MyDevStudio",
      title,
      type: "profile",
      url: canonical,
    },
    robots: { follow: true, index: true },
    title,
    twitter: {
      card: "summary_large_image",
      description: profile.summary,
      images,
      title,
    },
  };
}
