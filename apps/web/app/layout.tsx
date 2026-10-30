import "@shared/sections/styles.css";
import "@shared/ui/globals.css";
import "../features/portfolio/themes.css";
import "../features/portfolio/portfolio.css";
import { StyledEngineProvider } from "@mui/material";
import { NotificationProvider } from "@shared/ui/context";
import { ThemeProvider } from "@shared/ui/theme";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";

import { getActiveProfile } from "../lib/active-profile";
import { getPagePresentation } from "../lib/page-presentation";
import { isPlatformPage, platformMetadata } from "../lib/platform";
import { getPublicThemeStyle } from "../lib/portfolio-theme";
import { getProfileStructuredData } from "../lib/profile-structured-data";
import { portfolioUrl } from "../lib/site-url";

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
  const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)});var d=${JSON.stringify(appearance.defaultTheme)};var t=s==='light'||s==='dark'?s:d==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):d;document.documentElement.dataset.theme=t}catch(e){}})()`;
  return (
    <html
      data-accent={appearance.accent}
      data-portfolio-theme={portfolioTheme}
      data-theme={appearance.defaultTheme === "light" ? "light" : "dark"}
      lang={documentLanguage}
      style={getPublicThemeStyle(portfolioTheme, appearance.accent)}
      suppressHydrationWarning
    >
      <head>
        <script>{themeScript.replace(/</g, "\\u003c")}</script>
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider
            accent={appearance.accent}
            defaultTheme={appearance.defaultTheme}
            portfolioTheme={portfolioTheme}
            storageKey={storageKey}
          >
            <NotificationProvider>{children}</NotificationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
