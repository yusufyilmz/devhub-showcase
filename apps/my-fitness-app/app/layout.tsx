import "./globals.css";
import "./themes.css";

import type { Metadata, Viewport } from "next";

import { themeBootstrap } from "@/features/theme/theme-script";
export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fitness OS",
  },
  description: "Your meals, movement, and daily momentum.",
  icons: { apple: "/icon-180.png", icon: "/icon-192.png" },
  manifest: "/manifest.webmanifest",
  robots: { follow: false, index: false },
  title: "Yusuf • Fitness OS",
};
export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#010d1a",
  width: "device-width",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="dark" lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: This is a static first-party theme bootstrap, with no user-supplied content. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
