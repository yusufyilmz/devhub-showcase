import { createShareImage } from "@shared/ui/seo";

import { platformSeo } from "@/features/platform/seo";

export function GET() {
  return createShareImage({
    accent: "#22d3ee",
    brand: platformSeo.name,
    initials: "M",
    subtitle: platformSeo.shareSubtitle,
    title: platformSeo.shareTitle,
    url: new URL(platformSeo.url).host,
  });
}
