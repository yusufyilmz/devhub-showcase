"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo } from "react";

import type { PortfolioTheme } from "@shared/config";
import { storageThemeScript } from "@shared/ui/stores";

import { PageProviders } from "../../providers";
import type { StudioRequest } from "../../studio";
import { getPublicThemeStyle, type PageAppearance } from "../theme/page-theme";

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function EmbeddedDocument({
  appearance,
  bodyClassName,
  children,
  documentLanguage,
  portfolioTheme,
  storageKey,
  themeStyle,
  request,
}: {
  appearance: PageAppearance;
  bodyClassName?: string;
  children: ReactNode;
  documentLanguage: string;
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  themeStyle?: CSSProperties;
  request?: StudioRequest;
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
      <PageProviders
        accent={appearance.accent}
        defaultTheme={appearance.defaultTheme}
        portfolioTheme={portfolioTheme}
        request={request}
        storageKey={storageKey}
      >
        {children}
      </PageProviders>
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
  request,
}: {
  appearance: PageAppearance;
  bodyClassName?: string;
  children: ReactNode;
  documentLanguage: string;
  /** Storybook and other hosts that already own `html` and `body`. */
  embed?: boolean;
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  structuredData?: unknown;
  request?: StudioRequest;
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
        request={request}
        storageKey={storageKey}
        themeStyle={themeStyle}
      >
        {children}
      </EmbeddedDocument>
    );
  }

  const themeScript = storageThemeScript(storageKey, appearance.defaultTheme).replace(
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
        <PageProviders
          accent={appearance.accent}
          defaultTheme={appearance.defaultTheme}
          portfolioTheme={portfolioTheme}
          request={request}
          storageKey={storageKey}
        >
          {children}
        </PageProviders>
      </body>
    </html>
  );
}
