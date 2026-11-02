import type { CSSProperties } from "react";

export const presenterStyles = {
  element1: "section-native-video",
  element2: "section-item-value",
  element3: "section-item-period",
  element4: "section-masonry",
  element5: "section-prose",
  element6: "section-contact-form",
  element7: "section-action",
  element8: "section-description",
} as const;

export function collectionViewClassName(...values: unknown[]): string {
  return `section-${values[0]}`;
}

export function sectionPresentationClassName(...values: unknown[]): string {
  return `folio-section configured-section library-section composition-${values[0]} section-type-${values[1]} section-view-${values[2]}`;
}

export const presenterInlineStyle1: CSSProperties = { whiteSpace: "pre-line" };
