import "@shared/ui/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { cache } from "react";

import { StudioCompanion } from "@shared/assistant/studio-companion";
import { urls } from "@shared/config";
import { PageShell } from "@shared/ui/page-shell";

import { requireWorkspace } from "@/features/admin/admin-auth";

import { getPagePresentation } from "./_presentation";
import { getProfileStructuredData, isPlatformPage, platformMetadata } from "./_site";
import { getPublicProfile, getUsernameProfile } from "./[username]/_profile";
import { getPublishedProfile } from "./cv.pdf/_profile";

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

const getActiveProfile = cache(async () => {
  const path = (await headers()).get("x-profile-path") ?? "/";
  const match = path.match(/^\/p\/([^/]+)(?:\/|$)/);
  if (match?.[1]) return getPublicProfile(match[1]);
  if (path === "/admin" || /^\/[^/]+\/edit$/.test(path)) {
    try {
      const { repository } = await requireWorkspace();
      const snapshot = await repository.read();
      if (snapshot) return snapshot;
    } catch {
      /* The editor page handles authentication/setup failures. */
    }
    return null;
  }
  const username = path.match(/^\/([a-z0-9-]+)\/?$/)?.[1];
  if (username && !["admin", "reviews"].includes(username)) return getUsernameProfile(username);
  return getPublishedProfile();
});

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
