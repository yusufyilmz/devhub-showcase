import type { CSSProperties } from "react";
export const previewSizes = { Desktop: 1280, Mobile: 375, Tablet: 768 } as const;
export const previewSizeLabels = ["Mobile", "Tablet", "Desktop"] as const;
export const previewWidthStyle = (width: number) =>
  ({ maxWidth: "none", minWidth: width, width }) as CSSProperties;
export const previewDocument =
  '<!doctype html><html><head></head><body><div id="portfolio-preview-root"></div></body></html>';
