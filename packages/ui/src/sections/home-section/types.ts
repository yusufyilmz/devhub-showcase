import type { CSSProperties, ReactNode } from "react";

export type HomeCTASectionOptions = { action: PageAction };

export type HomeFooterOptions = { action: PageAction };

export type HomeHeaderOptions = { action: PageAction; accountMenu?: ReactNode };

export type HomeHeroSectionOptions = {
  action: PageAction;
  exampleHref: string | null;
};

export type HomeLibrarySectionOptions = { action: PageAction };

export type HomePricingSectionOptions = {
  action: PageAction;
  children?: React.ReactNode;
};

export type PageAction = { href: string; label: string; signedIn: boolean };

export type PortfolioPreviewInlineStyle1Values = [CSSProperties["backgroundColor"]];
