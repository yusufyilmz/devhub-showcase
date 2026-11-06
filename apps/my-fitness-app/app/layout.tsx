import "@shared/ui/styles.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { PageShell } from "@shared/ui/page-shell";

/** Same platform theme record as MyDevStudio (`getPagePresentation` on platform routes). */
const platformAppearance = { accent: "cyan" as const, defaultTheme: "light" as const };

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Fitness Studio",
  },
  description: "Your meals, movement, and daily momentum.",
  icons: { apple: "/icon-180.png", icon: "/icon-192.png" },
  manifest: "/manifest.webmanifest",
  robots: { follow: false, index: false },
  title: "My Fitness Studio",
};
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
    >
      {children}
    </PageShell>
  );
}
