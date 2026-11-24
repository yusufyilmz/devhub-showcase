import { studioButtonClass } from "../../buttons";
import { eyebrowClass } from "../../display/typography";

export const summarySectionStyles = {
  element1: "portfolio-hero",
  element2:
    "hero-orbit [position:absolute] [top:50px] [right:-270px] [width:570px] [height:570px] [pointer-events:none] [border:1px_solid_color-mix(in_srgb,_var(--primary)_9%,_transparent)] [border-radius:50%] [box-shadow:0_0_0_70px_color-mix(in_srgb,_var(--primary)_3%,_transparent),_0_0_0_140px_color-mix(in_srgb,_var(--primary)_2%,_transparent)] max-[767px]:[right:-440px] [opacity:0.5]",
  element3:
    "hero-copy [position:relative] [z-index:1] [max-width:850px] [&_.eyebrow]:[display:flex] [gap:10px] [align-items:center] [margin:0_0_26px] max-[767px]:[&_h2]:[font-size:22px]",
  element4: eyebrowClass,
  element5: "status-dot",
  element6: "accent-period [color:var(--primary)]",
  element7:
    "hero-intro [max-width:680px] [font-size:15px] [line-height:1.85] [color:var(--muted-foreground)] max-[767px]:[font-size:13px]",
  element8: "hero-actions [display:flex] [flex-wrap:wrap] [gap:12px] [margin:34px_0]",
  element9: studioButtonClass.primary,
  element10: studioButtonClass.secondary,
  element11:
    "hero-details [display:flex] [flex-wrap:wrap] [gap:32px] [font-size:11px] [color:var(--muted-foreground)] [&_strong]:[font-weight:600] [&_strong]:[color:var(--foreground)] max-[767px]:[gap:12px_22px] [line-height:1.8]",
  element12:
    "hero-scroll [position:absolute] [bottom:18px] [display:flex] [gap:18px] [align-items:center] [font:10px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.13em] [&_span]:[font-size:20px] [color:var(--primary)]",
  element13:
    "hero-frame [position:relative] [z-index:1] [width:100%] [max-width:1200px] [margin-inline:auto] [padding-inline:40px] max-[767px]:[padding-inline:22px]",
} as const;
