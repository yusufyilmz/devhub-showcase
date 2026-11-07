import { urls } from "@shared/config";
import { createPageMetadata } from "@shared/ui/seo";

import { platformSeo } from "./seo";

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
