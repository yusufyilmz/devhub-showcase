import type { ReactNode } from "react";

import type { PortfolioTheme } from "@shared/config";
import type { StudioRequest } from "@shared/runtime/studio";

import type { PageAppearance } from "../layout/page-shell/page-theme";
import { ThemeProvider } from "../theme";
import { NotificationProvider } from "./NotificationProvider";
import { StudioRequestProvider } from "./StudioRequestProvider";

export function PageProviders({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
  storageKey,
  request,
}: {
  accent: PageAppearance["accent"];
  children: ReactNode;
  defaultTheme: PageAppearance["defaultTheme"];
  portfolioTheme?: PortfolioTheme;
  storageKey: string;
  request?: StudioRequest;
}) {
  return (
    <ThemeProvider
      accent={accent}
      defaultTheme={defaultTheme}
      portfolioTheme={portfolioTheme}
      storageKey={storageKey}
    >
      <NotificationProvider>
        <StudioRequestProvider request={request}>{children}</StudioRequestProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
