import type { ReactNode } from "react";

import type { PortfolioTheme } from "@shared/config";
import { ThemeProvider } from "@shared/ui/theme";

import { NotificationProvider } from "../../providers/NotificationProvider";
import { StudioRequestProvider } from "../../providers/StudioRequestProvider";
import type { StudioRequest } from "../../studio/context/studio-request";
import type { PageAppearance } from "../theme/page-theme";

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
