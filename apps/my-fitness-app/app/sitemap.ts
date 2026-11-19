import type { MetadataRoute } from "next";

import { fitnessSeo } from "../services/site/seo";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: fitnessSeo.previewUrl }];
}
