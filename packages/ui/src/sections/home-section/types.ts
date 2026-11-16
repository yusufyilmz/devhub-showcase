import type { CSSProperties, ReactNode } from "react";

export type Group = "All" | "Story" | "Work" | "Media" | "Connect";

export type HomeCTASectionOptions = { action: PageAction };

export type HomeFooterOptions = { action: PageAction };

export type HomeHeaderOptions = { action: PageAction; accountMenu?: ReactNode };

export type HomeHeroSectionOptions = {
  action: PageAction;
  exampleHref: string | null;
};

export type LibraryPickerOptions = {
  items: { id: string; title: string; description: string; content: ReactNode }[];
};

export type HomeLibrarySectionOptions = { href: string };

export type HomePricingSectionOptions = {
  action: PageAction;
  children?: React.ReactNode;
};

export type PageAction = { href: string; label: string; signedIn: boolean };

export type PortfolioPreviewInlineStyle1Values = [CSSProperties["backgroundColor"]];
