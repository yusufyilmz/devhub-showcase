import type { CSSProperties, ReactNode } from "react";

import type { PortfolioProfile, PortfolioTheme } from "@shared/config";
import type { StudioRequest } from "@shared/runtime/studio";

export type EmbeddedDocumentOptions = {
  appearance: PageAppearance;
  bodyClassName?: string;
  children: ReactNode;
  documentLanguage: string;
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  themeStyle?: CSSProperties;
  request?: StudioRequest;
};

export type PageShellOptions = {
  appearance: PageAppearance;
  bodyClassName?: string;
  children: ReactNode;
  documentLanguage: string;
  /** Storybook and other hosts that already own `html` and `body`. */
  embed?: boolean;
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  structuredData?: unknown;
  request?: StudioRequest;
};

export type PageAppearance = NonNullable<PortfolioProfile["appearance"]>;
