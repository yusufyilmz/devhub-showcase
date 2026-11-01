import "@shared/design-system/globals.css";
import "@shared/design-system/legacy.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";

import { PageShell } from "@shared/components/page";

import { getPagePresentation } from "@/features/platform/page-presentation";
import { isPlatformPage, platformMetadata } from "@/features/platform/platform";
import { portfolioUrl } from "@/features/platform/site-url";
import { getActiveProfile } from "@/features/portfolio/active-profile";
import { getProfileStructuredData } from "@/features/portfolio/profile-structured-data";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Personal metadata belongs only to the published username route.
export const metadata: Metadata = platformMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const platform = await isPlatformPage();
  const snapshot = platform ? null : await getActiveProfile();
  const path = (await headers()).get("x-profile-path") ?? "/";
  const { profile, documentLanguage, storageKey, appearance, portfolioTheme, example } =
    getPagePresentation(path, platform, snapshot);
  const publicPortfolio =
    !example &&
    !path.startsWith("/admin") &&
    !path.endsWith("/edit") &&
    snapshot?.isPublic &&
    snapshot.username;
  const structuredData = getProfileStructuredData(
    publicPortfolio ? profile : undefined,
    publicPortfolio ? portfolioUrl(snapshot.username as string) : undefined,
  );

  return (
    <PageShell
      appearance={appearance}
      bodyClassName={`${geistSans.variable} ${geistMono.variable} antialiased`}
      documentLanguage={documentLanguage}
      portfolioTheme={portfolioTheme}
      storageKey={storageKey}
      structuredData={structuredData}
    >
      {children}
    </PageShell>
  );
}
