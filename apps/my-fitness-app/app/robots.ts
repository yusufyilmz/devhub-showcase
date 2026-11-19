import type { MetadataRoute } from "next";

import { fitnessSeo } from "../services/site/seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: "/", disallow: ["/api/", "/auth/"], userAgent: "*" },
    sitemap: new URL("/sitemap.xml", fitnessSeo.canonical).href,
  };
}
