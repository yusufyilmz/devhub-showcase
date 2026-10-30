import type { Metadata } from "next";
import { headers } from "next/headers";
import { cache } from "react";

import { siteUrl } from "./site-url";

export { siteUrl } from "./site-url";
export const platformDescription =
  "Create a portfolio that feels like you. Share your projects, tell your story, and download a CV from the same information.";
export const platformMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MyDevStudio | A home for your work",
  description: platformDescription,
  keywords: [
    "portfolio",
    "portfolio builder",
    "developer portfolio",
    "CV",
    "MyDevStudio",
  ],
  icons: { icon: "/studio-icon.svg" },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    title: "MyDevStudio | A home for your work",
    description: platformDescription,
    url: siteUrl,
    siteName: "MyDevStudio",
  },
  twitter: {
    card: "summary",
    title: "MyDevStudio | A home for your work",
    description: platformDescription,
  },
};
export const platformStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MyDevStudio",
  url: siteUrl,
  description: platformDescription,
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
