import { Button } from "../../buttons/button";
import { CTABlock } from "../cta-section/CTABlock";
import type { HomeCTASectionOptions } from "./types";

export function HomeCTASection({ action }: HomeCTASectionOptions) {
  return (
    <CTABlock
      actions={
        <Button className="home-button home-button-primary" href={action.href}>
          {action.label} <span aria-hidden="true">↗</span>
        </Button>
      }
      description="Start with your story. Make the rest yours."
      eyebrow="YOUR WORK IS ALREADY THERE."
      headingId="home-cta-title"
      note="Your portfolio. Your pace."
      title={
        <>
          Give it a place
          <br />
          to live<span className="home-final-period">.</span>
        </>
      }
      variant="landing"
    />
  );
}
