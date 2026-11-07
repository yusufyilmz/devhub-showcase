import { Button } from "../../buttons/button";
import { Background } from "../../layout/background";
import { HeroBlock } from "../hero-section/HeroBlock";
import { PortfolioPreview } from "./portfolio-preview";
import { heroStyles } from "./styles";
import type { HomeHeroSectionOptions } from "./types";

export function HomeHeroSection({ action, exampleHref }: HomeHeroSectionOptions) {
  return (
    <Background className="home-hero-background rounded-none" effect="aurora" variant="transparent">
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
        description="A portfolio that feels like you, with a CV to match. Bring your projects, experience and ideas together in a place you can call your own."
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
