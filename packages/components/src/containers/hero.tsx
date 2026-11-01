import type { PageAction } from "./action";
import { PortfolioPreview } from "./portfolio-preview";

export function Hero({ action, exampleHref }: { action: PageAction; exampleHref: string | null }) {
  return (
    <section aria-labelledby="home-title" className="home-container home-hero">
      <div className="home-hero-copy">
        <p className="home-eyebrow">
          <span /> A LITTLE SPACE. A LOT OF YOU.
        </p>
        <h1 id="home-title">
          Your work.
          <br />
          Your story.
          <br />
          <span>One place.</span>
        </h1>
        <p className="home-hero-description">
          A portfolio that feels like you, with a CV to match. Bring your projects, experience and
          ideas together in a place you can call your own.
        </p>
        <div className="home-hero-actions">
          <a className="home-button home-button-primary" href={action.href}>
            {action.label} <span aria-hidden="true">↗</span>
          </a>
          <a
            className="home-example-link"
            href={exampleHref ?? "https://mydevstudio.vercel.app/yusufyilmz"}
          >
            See a real portfolio <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="home-hero-notes">
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
  );
}
