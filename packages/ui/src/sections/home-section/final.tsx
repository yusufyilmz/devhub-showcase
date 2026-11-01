import { Button } from "../../buttons/button";
import type { PageAction } from "./action";

export function HomeCTASection({ action }: { action: PageAction }) {
  return (
    <section className="home-container home-final">
      <div className="home-final-inner">
        <p className="home-eyebrow">YOUR WORK IS ALREADY THERE.</p>
        <h2>
          Give it a place
          <br />
          to live<span className="home-final-period">.</span>
        </h2>
        <p>Start with your story. Make the rest yours.</p>
        <Button className="home-button home-button-primary" href={action.href}>
          {action.label} <span aria-hidden="true">↗</span>
        </Button>
        <span className="home-final-note">Your portfolio. Your pace.</span>
      </div>
      <span aria-hidden="true" className="home-final-glyph">
        ↗
      </span>
    </section>
  );
}
