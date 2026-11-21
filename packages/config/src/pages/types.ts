import type { PortfolioSectionId } from "../portfolio/portfolio-sections";
import type { CustomSectionId } from "../sections/custom-sections";

export const pageLayoutIds = [
  "flow",
  "split-sticky",
  "split-scroll",
  "cover",
  "editorial",
  "gallery",
] as const;
export type PageLayoutId = (typeof pageLayoutIds)[number];

export const pageRegionIds = ["header", "hero", "main", "aside", "footer"] as const;
export type PageRegionId = (typeof pageRegionIds)[number];

export const pageKinds = [
  "portfolio",
  "landing",
  "about",
  "work",
  "blog",
  "article",
  "contact",
  "pricing",
  "careers",
  "job",
  "shop",
  "product",
] as const;
export type PageKind = (typeof pageKinds)[number];

export const placementWidths = ["contained", "reading", "bleed"] as const;
export type PlacementWidth = (typeof placementWidths)[number];

export const placementSurfaces = ["plain", "muted", "card"] as const;
export type PlacementSurface = (typeof placementSurfaces)[number];

export const pageLimits = {
  bytes: 250_000,
  pages: 12,
  placementsPerPage: 80,
  placementsPerSite: 200,
} as const;

export type PlacementReference =
  | { type: "profile-intro" }
  | { type: "profile-contact" }
  | { type: "profile-section"; kind: PortfolioSectionId }
  | { type: "custom-section"; id: CustomSectionId };

export type PlacementPresentation = {
  renderer: string;
  width: PlacementWidth;
  surface: PlacementSurface;
};

export type SectionPlacement = {
  id: string;
  region: PageRegionId;
  visible: boolean;
  reference: PlacementReference;
  presentation: PlacementPresentation;
};

export type PageDocument = {
  id: string;
  title: string;
  description?: string;
  socialImage?: string;
  kind: PageKind;
  slug: string;
  published: boolean;
  layout: PageLayoutId;
  placements: SectionPlacement[];
};

export type PortfolioSiteDocument = {
  schemaVersion: 1;
  homePageId: string;
  pages: PageDocument[];
  navigation: { pageId: string }[];
};
