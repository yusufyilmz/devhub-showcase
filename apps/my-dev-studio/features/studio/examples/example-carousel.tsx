import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent } from "@shared/config";

import { PortfolioLayout } from "@/features/portfolio/sections/portfolio-layout";
import { EngineerPortfolio } from "@/features/portfolio/variants/engineer-portfolio";

import { exampleViewProfile, portfolioExamples } from "./data";
import { ExampleCarouselClient } from "./example-carousel-client";

export function ExampleCarousel() {
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
                  <EngineerPortfolio profile={profile} />
                ) : (
                  <PortfolioLayout profile={profile} username={`p/examples/${item.slug}`} />
                )}
              </div>
            </div>
          ),
        };
      })}
    />
  );
}
