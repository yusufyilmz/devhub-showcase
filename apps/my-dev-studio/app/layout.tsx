import "@shared/ui/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";

import { urls } from "@shared/config";
import { PageShell } from "@shared/ui/page-shell";

import { StudioCompanion } from "@/features/companion/studio-companion";
import { platformMetadata } from "@/features/platform/metadata";
import { getPagePresentation } from "@/features/platform/page-presentation";
import { isPlatformPage } from "@/features/platform/structured-data";
import { getProfileStructuredData } from "@/features/portfolio/profile-structured-data";
import { getActiveProfile } from "@/features/portfolio/profiles/active-profile";

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
  const showPublicCompanion =
    path === "/login" || path.endsWith("/access") || path.startsWith("/p/examples/");
  const { profile, documentLanguage, appearance, portfolioTheme, example } = getPagePresentation(
    path,
    platform,
    snapshot,
  );
  const publicPortfolio =
    !example &&
    !path.startsWith("/admin") &&
    !path.endsWith("/edit") &&
    snapshot?.isPublic &&
    snapshot.username;
  const structuredData = getProfileStructuredData(
    publicPortfolio ? profile : undefined,
    publicPortfolio ? urls.studio.portfolioUrl(snapshot.username as string) : undefined,
  );

  return (
    <PageShell
      appearance={appearance}
      bodyClassName={`${geistSans.variable} ${geistMono.variable} antialiased`}
      documentLanguage={documentLanguage}
      portfolioTheme={portfolioTheme}
      structuredData={structuredData}
    >
      {children}
      {showPublicCompanion && <StudioCompanion onLoginPage={path === "/login"} />}
    </PageShell>
  );
}
