import type { ReactNode } from "react";

import type { PortfolioTheme } from "@shared/config";
import type { ChatIdentity } from "@shared/runtime/chat";
import type { StudioRequest } from "@shared/runtime/studio";

import type { PageAppearance } from "../layout/page-shell/page-theme";

export type StudioRequestProviderOptions = {
  children: ReactNode;
  request?: StudioRequest;
};

export type PageProvidersOptions = {
  accent: PageAppearance["accent"];
  children: ReactNode;
  defaultTheme: PageAppearance["defaultTheme"];
  portfolioTheme?: PortfolioTheme;
  request?: StudioRequest;
};

export type PortfolioChatScopeOptions = {
  identity: ChatIdentity;
  children: ReactNode;
};

export type PortfolioChatProviderOptions = { identity: ChatIdentity; children: ReactNode };
export interface NotificationProviderProps {
  children: React.ReactNode;
}
