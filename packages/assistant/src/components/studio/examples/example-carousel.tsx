import type { CSSProperties } from "react";

import { getPortfolioThemeVariables, getPreviewAccent } from "@shared/config";

import { PortfolioLayout } from "../../portfolio/index";
import { exampleViewProfile, portfolioExamples } from "./data";
import { ExampleCarouselClient } from "./example-carousel-client";
import { ExamplePortfolioPreview } from "./example-portfolio-preview";

export function ExampleCarousel() {
  return (
    <ExampleCarouselClient
      items={portfolioExamples.map((item) => {
        const profile = exampleViewProfile(item);
        const theme = profile.appearance?.theme ?? "studio";
        return {
          ...item,
          preview: (
            <div className="example-preview-viewport [position:relative] [width:100%] [height:100%] [overflow:hidden]">
              <div
                className="example-rendered-preview [position:absolute] [inset:0] [width:calc(100%\_/\_var(--gallery-preview-scale,_0.8))] [height:calc(100%\_/\_var(--gallery-preview-scale,_0.8))] [overflow:auto] [color:var(--foreground)] [text-align:left] [background:var(--background)] [transform:scale(var(--gallery-preview-scale,_0.8))] [transform-origin:top_left] [&_>_.folio]:[min-height:100%] [&_>_main]:[min-height:100%] [&_.site-header]:[position:relative] [&_.folio]:[padding-inline:var(--spacing-md)] [&_.portfolio-inner]:[padding-inline:var(--spacing-md)] [&_.hero]:[min-height:auto] [padding-block:var(--spacing-lg)] [&_.folio-intro]:[min-height:auto] [&_:where(h1)]:[font-size:clamp(32px,_5vw,_64px)] [&_.work-media_img]:[display:block] [width:100%] theme-preview min-w-0 wrap-anywhere rounded-xl border border-border bg-background p-8 text-foreground max-[600px]:p-[22px]"
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
