import { type PageLayoutId, type PageRegionId, pageLayoutIds } from "./types";

/** Regions a layout can show. Content in any other region is invalid for that layout. */
export const pageLayoutRegions = {
  cover: ["header", "hero", "main", "footer"],
  editorial: ["header", "hero", "main", "aside", "footer"],
  flow: ["header", "hero", "main", "footer"],
  gallery: ["header", "hero", "main", "footer"],
  "split-scroll": ["header", "hero", "main", "aside", "footer"],
  "split-sticky": ["header", "hero", "main", "aside", "footer"],
} as const satisfies Record<PageLayoutId, readonly PageRegionId[]>;

export function layoutSupportsRegion(layout: PageLayoutId, region: PageRegionId) {
  return (pageLayoutRegions[layout] as readonly PageRegionId[]).includes(region);
}

export const pageLayoutChoices = pageLayoutIds;
