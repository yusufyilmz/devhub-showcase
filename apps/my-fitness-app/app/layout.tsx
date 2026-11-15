import "./fitness.css";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { PageShell } from "@shared/ui/page-shell";
import { createPageMetadata, createStructuredData } from "@shared/ui/seo";

import { fitnessSeo } from "@/features/seo";

/** Same platform theme record as MyDevStudio (`getPagePresentation` on platform routes). */
const platformAppearance = {
  accent: "cyan" as const,
  defaultTheme: "light" as const,
};

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

export const metadata: Metadata = {
  ...createPageMetadata({
    canonical: fitnessSeo.canonical,
    description: fitnessSeo.description,
    icons: { apple: "/icon-180.png", icon: "/icon-192.png" },
    image: { alt: fitnessSeo.title, url: fitnessSeo.image },
    robots: { follow: false, index: false },
    siteName: fitnessSeo.title,
    title: fitnessSeo.title,
  }),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: fitnessSeo.title,
  },
  manifest: "/manifest.webmanifest",
};

const structuredData = createStructuredData({
  "@type": "WebSite",
  description: fitnessSeo.description,
  name: fitnessSeo.title,
  url: fitnessSeo.canonical,
});

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#010d1a",
  width: "device-width",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell
      appearance={platformAppearance}
      bodyClassName={`${geistSans.variable} ${geistMono.variable} antialiased`}
      documentLanguage="en"
      structuredData={structuredData}
    >
      {children}
    </PageShell>
  );
}
