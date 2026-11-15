import { studioButtonClass } from "@shared/ui/button";
import { eyebrowClass } from "@shared/ui/typography";

export const summarySectionStyles = {
  element1:
    "portfolio-hero [position:relative] [display:flex] [align-items:center] [min-height:min(800px,_calc(100svh_-_78px))] [padding:100px_0_80px] [&_h1]:[margin:0_0_22px] [font-size:clamp(52px,_7vw,_96px)] [font-weight:650] [line-height:1.04] [letter-spacing:-0.07em] [&_h2]:[max-width:780px] [margin:0_0_24px] [font-size:clamp(21px,_2.6vw,_32px)] [font-weight:450] [line-height:1.4] [color:var(--muted-foreground)] [letter-spacing:-0.025em] max-[767px]:[align-items:flex-start] [min-height:680px] [padding:74px_0_70px] max-[767px]:[&_h1]:[font-size:55px] [&[data-featured]]:[display:grid] [&[data-featured]_.hero-featured-backdrop]:[--aurora-accent:var(--primary)] [&[data-featured]_.hero-copy_.eyebrow]:[margin-block-end:1.125rem] [&[data-featured]_.hero-copy_h1]:[margin-block-end:0.875rem] [&[data-featured]_.hero-copy_h2]:[margin-block-end:0.875rem] [&[data-featured]_.hero-intro]:[max-width:64ch] [&[data-featured]_.hero-actions]:[gap:0.625rem] [&[data-featured]_.hero-actions_>_a]:[gap:0.5rem] [&[data-featured]_.hero-details]:[gap:0.5rem_1rem] [&[data-featured]_.hero-featured-work_h2]:[margin:0_0_0.75rem] min-[900px]:[&[data-featured][data-spotlight]]:[grid-template-columns:minmax(0,_1.8fr)_minmax(16rem,_1fr)] max-[767px]:[&[data-featured]_.hero-featured-backdrop]:[inset-inline:-1.375rem]",
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
    "hero-details [display:flex] [flex-wrap:wrap] [gap:32px] [font-size:11px] [color:var(--muted-foreground)] [&_strong]:[font-weight:600] [color:var(--foreground)] max-[767px]:[gap:12px_22px] [line-height:1.8]",
  element12:
    "hero-scroll [position:absolute] [bottom:18px] [display:flex] [gap:18px] [align-items:center] [font:10px_var(--font-geist-mono),_monospace] [color:var(--muted-foreground)] [letter-spacing:0.13em] [&_span]:[font-size:20px] [color:var(--primary)]",
} as const;
