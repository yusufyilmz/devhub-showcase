import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Section } from "@shared/ui/section";

import { pricingStyles } from "./styles";
import type { HomePricingSectionOptions } from "./types";

export function HomePricingSection({ action, children }: HomePricingSectionOptions) {
  return (
    <Section asChild>
      <section aria-labelledby="pricing-title" className={pricingStyles.element1} id="pricing">
        <div className={pricingStyles.element2}>
          <p className={pricingStyles.element3}>YOUR STUDIO, YOUR CHOICE</p>
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
        <div className={pricingStyles.element4}>
          <Card asChild layout="plain" surface="portfolio">
            <article className={pricingStyles.element5}>
              <h3>Free</h3>
              <p className={pricingStyles.element6}>Free</p>
              <p>A home for your work.</p>
              <ul>
                <li>Your portfolio website and downloadable CV</li>
                <li>Every layout, plus themes and language settings</li>
                <li>Section library, custom sections and reusable templates</li>
                <li>Private drafts and explicit publication</li>
                <li>CV import when the extraction service is available</li>
              </ul>
              <Button className={pricingStyles.element7} href={action.href} variant="outline">
                {action.label}
              </Button>
            </article>
          </Card>
          <Card asChild layout="plain" surface="portfolio">
            <article className={pricingStyles.element8}>
              <p className={pricingStyles.element9}>SANDBOX PREVIEW</p>
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
                className={pricingStyles.element10}
                href={action.signedIn ? "/admin/billing" : "/login"}
              >
                {action.signedIn ? "Try Pro sandbox" : "Sign in to try Pro"}
              </Button>
            </article>
          </Card>
        </div>
        <p className={pricingStyles.element11}>
          Pro is currently a test environment. Use test cards; no real payments are enabled.
          Allowances count reserved attempts, including failed or uncertain requests. AI can make
          mistakes: review edits before saving. You choose whether to enable public chat.
        </p>
      </section>
    </Section>
  );
}
