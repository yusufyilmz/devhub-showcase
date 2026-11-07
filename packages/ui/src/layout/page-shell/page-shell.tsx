"use client";

import { useEffect, useMemo } from "react";

import { themeBootstrapScript } from "@shared/runtime/storage";
import { safeJson } from "@shared/utils";

import { MouseCircle } from "../../customizers/mouse-circle";
import { PageProviders } from "../../providers";
import { getPublicThemeStyle } from "./page-theme";
import type { EmbeddedDocumentOptions, PageShellOptions } from "./types";

function EmbeddedDocument({
  appearance,
  bodyClassName,
  children,
  documentLanguage,
  portfolioTheme,
  themeStyle,
  request,
}: EmbeddedDocumentOptions) {
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
      >
        <MouseCircle />
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
  structuredData,
  request,
}: PageShellOptions) {
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
        themeStyle={themeStyle}
      >
        {children}
      </EmbeddedDocument>
    );
  }

  const themeScript = themeBootstrapScript(appearance.defaultTheme).replace(/</g, "\\u003c");

  return (
    <html
      data-accent={appearance.accent}
      data-platform="mydevstudio"
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
        >
          <MouseCircle />
          {children}
        </PageProviders>
      </body>
    </html>
  );
}
