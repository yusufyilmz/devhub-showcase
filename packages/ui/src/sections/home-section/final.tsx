import { Button } from "../../buttons/button";
import { Section } from "../../layout/section";
import { finalStyles } from "./styles";
import type { HomeCTASectionOptions } from "./types";

export function HomeCTASection({ action }: HomeCTASectionOptions) {
  return (
    <Section asChild className="home-cta mb-lg">
      <section className={finalStyles.element1}>
        <div className={finalStyles.element2}>
          <p className={finalStyles.element3}>YOUR WORK IS ALREADY THERE.</p>
          <h2>
            Give it a place
            <br />
            to live<span className={finalStyles.element4}>.</span>
          </h2>
          <p>Start with your story. Make the rest yours.</p>
          <Button className={finalStyles.element5} href={action.href}>
            {action.label} <span aria-hidden="true">↗</span>
          </Button>
          <span className={finalStyles.element6}>
            Your portfolio. Your pace.
          </span>
        </div>
        <span aria-hidden="true" className={finalStyles.element7}>
          ↗
        </span>
      </section>
    </Section>
  );
}
