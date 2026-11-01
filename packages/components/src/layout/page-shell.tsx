"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo } from "react";

import type { PortfolioTheme } from "@shared/config";
import { NotificationProvider } from "@shared/ui/providers";
import { ThemeProvider } from "@shared/ui/theme";

import { type DocumentAppearance, getPublicThemeStyle } from "./public-theme-style";

function themeBootstrapScript(
  storageKey: string,
  defaultTheme: DocumentAppearance["defaultTheme"],
) {
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)});var d=${JSON.stringify(defaultTheme)};var t=s==='light'||s==='dark'?s:d==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):d;document.documentElement.dataset.theme=t}catch(e){}})()`;
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function DocumentProviders({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
  storageKey,
}: {
  accent: DocumentAppearance["accent"];
  children: ReactNode;
  defaultTheme: DocumentAppearance["defaultTheme"];
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
}) {
  return (
    <ThemeProvider
      accent={accent}
      defaultTheme={defaultTheme}
      portfolioTheme={portfolioTheme}
      storageKey={storageKey}
    >
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeProvider>
  );
}

function EmbeddedDocument({
  appearance,
  bodyClassName,
  children,
  documentLanguage,
  portfolioTheme,
  storageKey,
  themeStyle,
}: {
  appearance: DocumentAppearance;
  bodyClassName?: string;
  children: ReactNode;
  documentLanguage: string;
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  themeStyle?: CSSProperties;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = {
      accent: root.dataset.accent,
      lang: root.lang,
      portfolioTheme: root.dataset.portfolioTheme,
      theme: root.dataset.theme,
    };
    root.lang = documentLanguage;
    root.dataset.accent = appearance.accent;
    root.dataset.theme = appearance.defaultTheme === "light" ? "light" : "dark";
    if (portfolioTheme) root.dataset.portfolioTheme = portfolioTheme;
    else delete root.dataset.portfolioTheme;
    for (const [key, value] of Object.entries(themeStyle ?? {})) {
      if (value != null) root.style.setProperty(key, String(value));
    }
    return () => {
      root.lang = previous.lang;
      if (previous.accent) root.dataset.accent = previous.accent;
      else delete root.dataset.accent;
      if (previous.theme) root.dataset.theme = previous.theme;
      else delete root.dataset.theme;
      if (previous.portfolioTheme) root.dataset.portfolioTheme = previous.portfolioTheme;
      else delete root.dataset.portfolioTheme;
    };
  }, [appearance, documentLanguage, portfolioTheme, themeStyle]);

  return (
    <div className={bodyClassName}>
      <DocumentProviders
        accent={appearance.accent}
        defaultTheme={appearance.defaultTheme}
        portfolioTheme={portfolioTheme}
        storageKey={storageKey}
      >
        {children}
      </DocumentProviders>
    </div>
  );
}

export function PageShell({
  appearance,
  bodyClassName,
  children,
  documentLanguage,
  embed = false,
  portfolioTheme,
  storageKey,
  structuredData,
}: {
  appearance: DocumentAppearance;
  bodyClassName?: string;
  children: ReactNode;
  documentLanguage: string;
  /** Storybook and other hosts that already own `html` and `body`. */
  embed?: boolean;
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  structuredData?: unknown;
}) {
  const themeStyle = useMemo(
    () => getPublicThemeStyle(portfolioTheme, appearance.accent),
    [appearance.accent, portfolioTheme],
  );

  if (embed) {
    return (
      <EmbeddedDocument
        appearance={appearance}
        bodyClassName={bodyClassName}
        documentLanguage={documentLanguage}
        portfolioTheme={portfolioTheme}
        storageKey={storageKey}
        themeStyle={themeStyle}
      >
        {children}
      </EmbeddedDocument>
    );
  }

  const themeScript = themeBootstrapScript(storageKey, appearance.defaultTheme).replace(
    /</g,
    "\\u003c",
  );

  return (
    <html
      data-accent={appearance.accent}
      data-portfolio-theme={portfolioTheme}
      data-theme={appearance.defaultTheme === "light" ? "light" : "dark"}
      lang={documentLanguage}
      style={themeStyle}
      suppressHydrationWarning
    >
      <head>
        <script>{themeScript}</script>
        {structuredData ? (
          <script type="application/ld+json">{safeJson(structuredData)}</script>
        ) : null}
      </head>
      <body className={bodyClassName}>
        <DocumentProviders
          accent={appearance.accent}
          defaultTheme={appearance.defaultTheme}
          portfolioTheme={portfolioTheme}
          storageKey={storageKey}
        >
          {children}
        </DocumentProviders>
      </body>
    </html>
  );
}
