import { ThemeProvider } from "../theme";
import { NotificationProvider } from "./NotificationProvider";
import { StudioRequestProvider } from "./StudioRequestProvider";
import type { PageProvidersOptions } from "./types";

export function PageProviders({
  accent,
  children,
  defaultTheme,
  portfolioTheme,
  storageKey,
  request,
}: PageProvidersOptions) {
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
