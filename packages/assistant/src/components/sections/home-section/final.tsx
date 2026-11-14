import { Button } from "@shared/ui/button";

import { CTABlock } from "../cta-section/CTABlock";
import type { HomeCTASectionOptions } from "./types";

export function HomeCTASection({ action }: HomeCTASectionOptions) {
  return (
    <CTABlock
      actions={
        <Button
          className="home-button [display:inline-flex] [gap:30px] [align-items:center] [justify-content:center] [min-height:48px] [padding:14px_20px] [font-size:12px] [font-weight:650] [text-decoration:none] [border-radius:6px] [transition:transform_0.2s,_box-shadow_0.2s] hover:[box-shadow:0_7px_24px_color-mix(in_srgb,_var(--primary)_15%,_transparent)] [transform:translateY(-2px)] motion-reduce:[transition:none] motion-reduce:hover:[transform:none] home-button-primary [color:var(--background)] [background:var(--primary)]"
          href={action.href}
        >
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
          to live<span className="home-final-period [color:var(--primary)]">.</span>
        </>
      }
      variant="landing"
    />
  );
}
