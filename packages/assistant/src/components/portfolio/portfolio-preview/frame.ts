import { getPortfolioThemeVariables, getPreviewAccent } from "@shared/config";

import type { ResponsivePortfolioPreviewProps } from "./types";

export function preparePreviewFrame(
  doc: Document,
  appearance: ResponsivePortfolioPreviewProps["appearance"],
) {
  doc.head.querySelectorAll("[data-preview-style]").forEach((node) => node.remove());
  document.head.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const copy = node.cloneNode(true) as HTMLElement;
    copy.setAttribute("data-preview-style", "");
    doc.head.append(copy);
  });
  const safety = doc.createElement("style");
  safety.setAttribute("data-preview-style", "");
  safety.textContent =
    ".appearance-launcher, .skip-link { display: none !important; } html { scroll-behavior: auto !important; }";
  doc.head.append(safety);
  doc.body.className = document.body.className;
  const root = doc.documentElement;
  root.lang = document.documentElement.lang;
  root.dataset.platform = "mydevstudio";
  root.dataset.portfolioTheme = appearance?.theme ?? "studio";
  root.dataset.accent = appearance?.accent ?? "cyan";
  const preferred = appearance?.defaultTheme ?? "system";
  root.dataset.theme =
    preferred === "system" ? (document.documentElement.dataset.theme ?? "light") : preferred;
  const variables = {
    ...getPortfolioThemeVariables(appearance?.theme ?? "studio"),
    ...getPreviewAccent(appearance?.accent ?? "cyan"),
  };
  for (const [key, value] of Object.entries(variables)) root.style.setProperty(key, value);
}
