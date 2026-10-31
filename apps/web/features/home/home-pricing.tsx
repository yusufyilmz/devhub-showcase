import type { HomeAction } from "@/lib/home-links";
import { PlanDetails } from "../billing/plan-details";
import "./home-pricing.css";
export function HomePricing({ action }: { action: HomeAction }) {
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
        <article className="home-plan">
          <h3>Free</h3>
          <p className="home-plan-price">Free</p>
          <p>A home for your work.</p>
          <ul>
            <li>Your portfolio website and downloadable CV</li>
            <li>Four layouts, themes and language settings</li>
            <li>Section library, custom sections and reusable templates</li>
            <li>Private drafts and explicit publication</li>
            <li>CV import when the extraction service is available</li>
          </ul>
          <a className="home-button home-button-secondary" href={action.href}>
            {action.label}
          </a>
        </article>
        <article className="home-plan home-plan-pro">
          <p className="home-eyebrow">SANDBOX PREVIEW</p>
          <h3>Pro</h3>
          <PlanDetails />
          <ul>
            <li>Everything in Free</li>
            <li>Optional visitor chat grounded in your published work</li>
            <li>Private AI editing proposals with review and draft apply</li>
            <li>One assigned portfolio per account</li>
            <li>Usage tracking and subscription management</li>
          </ul>
          <a
            className="home-button home-button-primary"
            href={action.signedIn ? "/admin/billing" : "/admin/login"}
          >
            {action.signedIn ? "Try Pro sandbox" : "Sign in to try Pro"}
          </a>
        </article>
      </div>
      <p className="home-plan-note">
        Pro is currently a test environment. Use test cards; no real payments are enabled.
        Allowances count reserved attempts, including failed or uncertain requests. AI can make
        mistakes: review edits before saving. You choose whether to enable public chat.
      </p>
    </section>
  );
}
