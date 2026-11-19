import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent } from "@shared/config";

import { exampleViewProfile, portfolioExamples } from "@/services/examples/data";

import { ExamplePortfolioPreview } from "../engineer/ExamplePortfolioPreview";
import { PortfolioLayout } from "../published/PortfolioLayout";
import { ExampleCarouselClient } from "./ExampleCarouselClient";

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
                  <ExamplePortfolioPreview profile={profile} />
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
