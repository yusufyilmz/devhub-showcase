import type { CSSProperties } from "react";

import type { PortfolioPreviewInlineStyle1Values } from "./types";

export const capabilitiesStyles = {
  element1: "home-container home-capabilities",
} as const;

export const chatLauncherStyles = {
  element1: "home-container home-chat-launcher",
  element2: "home-eyebrow",
} as const;

export const featuresStyles = {
  element1: "home-container home-features",
  element2: "home-section-intro",
  element3: "home-eyebrow",
  element4: "home-feature-grid",
  element5: "home-feature-card home-feature-main",
  element6: "home-feature-index",
  element7: "home-url-demo",
  element8: "home-feature-details",
  element9: "home-feature-card",
  element10: "home-feature-index",
  element11: "home-style-demo",
  element12: "home-feature-details",
  element13: "home-feature-card home-feature-wide",
  element14: "home-file-icon",
  element15: "home-feature-index",
  element16: "home-file-tag",
} as const;

export const portfolioPreviewStyles = {
  element1: "home-preview-wrap",
  element2: "home-preview-tools",
  element3: "home-preview-tabs",
  element4: "home-preview-caption",
  element5: "home-preview-browser",
  element6: "home-preview-chrome",
  element7: "home-window-dots",
  element8: "home-preview-panel",
  element9: "home-sample-site",
  element10: "home-sample-nav",
  element11: "home-sample-intro",
  element12: "home-sample-avatar",
  element13: "home-sample-role",
  element14: "home-sample-bio",
  element15: "home-sample-work",
  element16: "home-sample-projects",
  element17: "home-project-art",
  element18: "home-project-art",
  element19: "home-sample-footer",
  element20: "home-sample-cv",
  element21: "home-cv-paper",
  element22: "home-cv-label",
  element23: "home-cv-contact",
  element24: "home-cv-role",
  element25: "home-cv-footnote",
  element26: "home-preview-bottom",
  element27: "home-preview-colors home-preview-accents",
  element28: "sr-only",
  element29: "home-accent",
  element30: "home-preview-colors home-preview-themes",
  element31: "sr-only",
  element32: "home-preview-note",
} as const;

export const heroStyles = {
  element6: "home-button home-button-primary",
  element7: "home-example-link",
} as const;

export const libraryPickerStyles = {
  element1: "home-library-demo",
  element2: "home-library-buttons",
  element3: "sr-only",
  element4: "home-library-number",
  element5: "home-library-preview",
  element6: "home-library-preview-bar",
  element7: "home-library-preview-content",
  element8: "home-sample-note",
} as const;

export const sectionCatalogStyles = {
  element1: "home-library-catalog section-catalog",
  element2: "section-catalog-heading",
  element3: "home-eyebrow",
  element4: "section-catalog-search",
  element5: "section-catalog-filters",
  element6: "sr-only",
  element7: "section-catalog-count",
  element8: "section-catalog-grid",
  element9: "section-catalog-icon",
  element10: "section-catalog-reveal",
  element11: "section-catalog-empty",
} as const;

export const libraryStyles = {
  element1: "home-container home-library",
  element2: "home-library-header",
  element3: "home-section-intro",
  element4: "home-eyebrow",
  element5: "home-library-count",
  element6: "home-library-workflows",
  element7: "home-feature-index",
  element8: "home-button home-button-primary",
  element9: "home-sample-note",
  element10: "home-feature-index",
  element11: "home-text-link",
} as const;

export const optionsStyles = {
  element1: "home-container home-options",
  element2: "home-section-intro",
  element3: "home-eyebrow",
  element4: "home-options-grid",
  element5: "home-theme-list",
  element6: "home-format-list",
  element7: "home-language-note",
  element8: "home-eyebrow",
} as const;

export const pricingStyles = {
  element1: "home-container home-pricing",
  element2: "home-section-intro",
  element3: "home-eyebrow",
  element4: "home-plan-grid",
  element5: "home-plan",
  element6: "home-plan-price",
  element7: "home-button home-button-secondary",
  element8: "home-plan home-plan-pro",
  element9: "home-eyebrow",
  element10: "home-button home-button-primary",
  element11: "home-plan-note",
} as const;

export const processStyles = {
  element1: "home-container home-process",
  element2: "home-section-intro",
  element3: "home-eyebrow",
} as const;

export function homeOptionsSectionClassName(...values: unknown[]): string {
  return `home-theme-swatch home-theme-${values[0]}`;
}

export function portfolioPreviewClassName(...values: unknown[]): string {
  return `home-accent home-accent-${values[0]}`;
}

export function portfolioPreviewInlineStyle1(
  ...values: PortfolioPreviewInlineStyle1Values
): CSSProperties {
  return { backgroundColor: values[0] };
}
