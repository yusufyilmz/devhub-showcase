import { cache } from "react";

import type { Metadata } from "next";
import { headers } from "next/headers";

import { siteUrl } from "./site-url";

export { siteUrl } from "./site-url";
export const platformDescription =
  "Create a portfolio that feels like you. Share your projects, tell your story, and download a CV from the same information.";
export const platformMetadata: Metadata = {
  alternates: { canonical: siteUrl },
  description: platformDescription,
  icons: { icon: "/studio-icon.svg" },
  keywords: ["portfolio", "portfolio builder", "developer portfolio", "CV", "MyDevStudio"],
  metadataBase: new URL(siteUrl),
  openGraph: {
    description: platformDescription,
    siteName: "MyDevStudio",
    title: "MyDevStudio | A home for your work",
    type: "website",
    url: siteUrl,
  },
  title: "MyDevStudio | A home for your work",
  twitter: {
    card: "summary",
    description: platformDescription,
    title: "MyDevStudio | A home for your work",
  },
};
export const platformStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  description: platformDescription,
  name: "MyDevStudio",
  url: siteUrl,
};
/** The proxy overwrites this header from the actual pathname. */
export const isPlatformPath = (path: string) =>
  path === "/" ||
  path === "/admin/login" ||
  path === "/admin/portfolios" ||
  path.startsWith("/admin/portfolios/") ||
  path === "/p/examples" ||
  path.startsWith("/p/examples/");
export const isPlatformPage = cache(async () => {
  const path = (await headers()).get("x-profile-path") ?? "/";
  return isPlatformPath(path);
});
