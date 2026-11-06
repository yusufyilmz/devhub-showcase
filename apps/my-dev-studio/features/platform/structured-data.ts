import { headers } from "next/headers";
import { cache } from "react";

import { createStructuredData } from "@shared/ui/seo";

import { platformDescription } from "./metadata";
import { platformSeo } from "./seo";

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
