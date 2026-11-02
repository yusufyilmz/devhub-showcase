import type { CSSProperties } from "react";

export const configuredSectionStyles = {
  element1: "folio-section configured-section",
  element2: "configured-timeline",
} as const;

export const customSectionsEditorStyles = {
  element1: "studio-primary",
  element2: "editor-card",
  element3: "editor-actions",
  element4: "studio-secondary",
  element5: "danger-button",
} as const;

export const sectionOrderEditorStyles = {
  element1: "editor-card",
  element2: "studio-secondary",
} as const;

export const sectionSettingsEditorStyles = {
  element1: "editor-card",
  element2: "editor-card",
  element3: "studio-secondary",
} as const;

export const sectionTemplatesEditorStyles = {
  element1: "editor-card template-library",
  element2: "editor-actions",
  element3: "studio-secondary",
  element4: "studio-secondary",
  element5: "template-library-list",
  element6: "editor-card",
  element7: "studio-primary",
} as const;

export function customPortfolioSectionClassName(...values: unknown[]): string {
  return `folio-section configured-section composition-${values[0]}`;
}

export const configuredSectionInlineStyle1: CSSProperties = { height: "auto", maxWidth: "100%" };

export const customPortfolioSectionInlineStyle1: CSSProperties = { whiteSpace: "pre-line" };

export const sectionSettingsEditorInlineStyle1: CSSProperties = { display: "block" };
