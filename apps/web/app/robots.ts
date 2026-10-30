import type { MetadataRoute } from "next";

import { siteUrl } from "../lib/site-url";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/admin", "/api/", "/auth/", "/*/edit", "/p/", "/*/cv.pdf"],
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

export const dynamic = "force-dynamic";
