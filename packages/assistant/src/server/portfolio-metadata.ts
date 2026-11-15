import { type PortfolioProfile, urls } from "@shared/config";
import { createPageMetadata } from "@shared/ui/seo";

export function createPortfolioMetadata(
  profile: PortfolioProfile,
  username: string,
  platformSeo: { name: string; imagePath: string },
) {
  const canonical = urls.studio.portfolioUrl(username);
  const title = `${profile.name} | ${profile.title}`;
  return createPageMetadata({
    canonical,
    description: profile.summary,
    icons: {
      icon: [{ type: "image/svg+xml", url: `${canonical}/icon.svg` }],
      shortcut: `${canonical}/icon.svg`,
    },
    image: { alt: title, url: `${canonical}${platformSeo.imagePath}` },
    keywords: [
      profile.name,
      profile.title,
      "portfolio",
      "CV",
      ...Object.values(profile.skills).flat().slice(0, 20),
    ],
    locale: { en: "en_US", es: "es_ES", tr: "tr_TR" }[profile.portfolioLanguage ?? "en"],
    robots: {
      follow: !profile.publicationVisibility || profile.publicationVisibility === "public",
      index: !profile.publicationVisibility || profile.publicationVisibility === "public",
    },
    siteName: platformSeo.name,
    title,
    type: "profile",
  });
}
