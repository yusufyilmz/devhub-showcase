import { Background } from "@shared/ui/background";
import { Button } from "@shared/ui/button";

import { HeroBlock } from "../hero-section/HeroBlock";
import { PortfolioPreview } from "./portfolio-preview";
import { heroStyles } from "./styles";
import type { HomeHeroSectionOptions } from "./types";

export function HomeHeroSection({ action, exampleHref }: HomeHeroSectionOptions) {
  return (
    <Background
      className="home-hero-background [--aurora-accent:var(--primary)] rounded-none"
      effect="aurora"
      variant="transparent"
    >
      <HeroBlock
        actions={
          <>
            <Button className={heroStyles.element6} href={action.href}>
              {action.label} <span aria-hidden="true">↗</span>
            </Button>
            <Button
              className={heroStyles.element7}
              href={exampleHref ?? "https://mydevstudio.vercel.app/yusufyilmz"}
              variant="link"
            >
              See a real portfolio <span aria-hidden="true">→</span>
            </Button>
          </>
        }
        description="Build a portfolio and a downloadable CV from the same saved details. Start with your existing CV or build your draft one section at a time."
        eyebrow={
          <>
            <span /> A LITTLE SPACE. A LOT OF YOU.
          </>
        }
        headingId="home-title"
        headingLevel="h1"
        notes={
          <>
            <span>
              <i aria-hidden="true">✓</i> No code needed
            </span>
            <span>
              <i aria-hidden="true">✓</i> Private until you publish
            </span>
          </>
        }
        title={
          <>
            Your work.
            <br />
            Your story.
            <br />
            <span>One place.</span>
          </>
        }
        variant="landing"
        visual={<PortfolioPreview />}
      />
    </Background>
  );
}
