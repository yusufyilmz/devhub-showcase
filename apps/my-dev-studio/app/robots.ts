import type { MetadataRoute } from "next";

import { urls } from "@shared/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/admin", "/api/", "/auth/", "/*/edit", "/p/", "/*/cv.pdf"],
      userAgent: "*",
    },
    sitemap: `${urls.studio.siteUrl().toString()}/sitemap.xml`,
  };
}

export const dynamic = "force-dynamic";
