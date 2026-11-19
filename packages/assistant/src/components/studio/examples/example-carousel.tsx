import type { CSSProperties, ReactNode } from "react";

import {
  getPortfolioThemeVariables,
  getPreviewAccent,
  type PortfolioProfile,
} from "@shared/config";

import { exampleViewProfile, portfolioExamples } from "./data";
import { ExampleCarouselClient } from "./example-carousel-client";
import { ExamplePortfolioPreview } from "./example-portfolio-preview";

export function ExampleCarousel({
  renderPortfolio,
}: {
  renderPortfolio: (props: { profile: PortfolioProfile; username: string }) => ReactNode;
}) {
  return (
    <ExampleCarouselClient
      items={portfolioExamples.map((item) => {
        const profile = exampleViewProfile(item);
        const theme = profile.appearance?.theme ?? "studio";
        return {
          ...item,
          preview: (
            <div className="example-preview-viewport">
              <div
                className="example-rendered-preview theme-preview"
                data-portfolio-theme={theme}
                data-theme={profile.appearance?.defaultTheme}
                style={
                  {
                    ...getPortfolioThemeVariables(theme),
                    ...getPreviewAccent(profile.appearance?.accent ?? "cyan"),
                  } as CSSProperties
                }
              >
                {profile.portfolioType === "engineer" ? (
                  <ExamplePortfolioPreview profile={profile} />
                ) : (
                  renderPortfolio({ profile, username: `p/examples/${item.slug}` })
                )}
              </div>
            </div>
          ),
        };
      })}
    />
  );
}
