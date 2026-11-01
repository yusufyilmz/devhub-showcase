import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import type { PageAction } from "./action";

export function HomePricingSection({
  action,
  children,
}: {
  action: PageAction;
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="pricing-title" className="home-container home-pricing" id="pricing">
      <div className="home-section-intro">
        <p className="home-eyebrow">YOUR STUDIO, YOUR CHOICE</p>
        <h2 id="pricing-title">
          Start free.
          <br />
          <span>Add AI when you need it.</span>
        </h2>
        <p>
          Build a portfolio website and a CV together. Pro adds optional help for you and your
          visitors.
        </p>
      </div>
      <div className="home-plan-grid">
        <Card asChild layout="plain" surface="portfolio">
          <article className="home-plan">
            <h3>Free</h3>
            <p className="home-plan-price">Free</p>
            <p>A home for your work.</p>
            <ul>
              <li>Your portfolio website and downloadable CV</li>
              <li>Every layout, plus themes and language settings</li>
              <li>Section library, custom sections and reusable templates</li>
              <li>Private drafts and explicit publication</li>
              <li>CV import when the extraction service is available</li>
            </ul>
            <Button
              className="home-button home-button-secondary"
              href={action.href}
              variant="outline"
            >
              {action.label}
            </Button>
          </article>
        </Card>
        <Card asChild layout="plain" surface="portfolio">
          <article className="home-plan home-plan-pro">
            <p className="home-eyebrow">SANDBOX PREVIEW</p>
            <h3>Pro</h3>
            {children}
            <ul>
              <li>Everything in Free</li>
              <li>Optional visitor chat grounded in your published work</li>
              <li>Private AI editing proposals with review and draft apply</li>
              <li>One assigned portfolio per account</li>
              <li>Usage tracking and subscription management</li>
            </ul>
            <Button
              className="home-button home-button-primary"
              href={action.signedIn ? "/admin/billing" : "/login"}
            >
              {action.signedIn ? "Try Pro sandbox" : "Sign in to try Pro"}
            </Button>
          </article>
        </Card>
      </div>
      <p className="home-plan-note">
        Pro is currently a test environment. Use test cards; no real payments are enabled.
        Allowances count reserved attempts, including failed or uncertain requests. AI can make
        mistakes: review edits before saving. You choose whether to enable public chat.
      </p>
    </section>
  );
}
