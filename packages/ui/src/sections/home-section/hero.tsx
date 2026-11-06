import { Button } from "../../buttons/button";
import { Background } from "../../layout/background";
import { Section } from "../../layout/section";
import { PortfolioPreview } from "./portfolio-preview";
import { heroStyles } from "./styles";
import type { HomeHeroSectionOptions } from "./types";

export function HomeHeroSection({ action, exampleHref }: HomeHeroSectionOptions) {
  return (
    <Background className="home-hero-background rounded-none" effect="aurora" variant="transparent">
      <Section asChild>
        <section aria-labelledby="home-title" className={heroStyles.element1}>
          <div className={heroStyles.element2}>
            <p className={heroStyles.element3}>
              <span /> A LITTLE SPACE. A LOT OF YOU.
            </p>
            <h1 id="home-title">
              Your work.
              <br />
              Your story.
              <br />
              <span>One place.</span>
            </h1>
            <p className={heroStyles.element4}>
              A portfolio that feels like you, with a CV to match. Bring your projects, experience
              and ideas together in a place you can call your own.
            </p>
            <div className={heroStyles.element5}>
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
            </div>
            <div className={heroStyles.element8}>
              <span>
                <i aria-hidden="true">✓</i> No code needed
              </span>
              <span>
                <i aria-hidden="true">✓</i> Private until you publish
              </span>
            </div>
          </div>
          <PortfolioPreview />
        </section>
      </Section>
    </Background>
  );
}
