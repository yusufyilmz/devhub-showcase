export const sectionNavigatorStyles = {
  link: "section-navigator-link [position:relative] [display:flex] [flex:0_1_auto] [align-items:center] [justify-content:flex-end] [width:32px] [height:min(24px,_calc(60dvh_/_var(--section-count)))] [min-height:4px] [padding:2px_4px] [text-decoration:none] [background:transparent] [&[aria-current]_.section-navigator-marker]:[width:26px]",
  marker:
    "section-navigator-marker [display:block] [width:10px] [height:3px] [background:color-mix(in_srgb,_var(--muted-foreground)_35%,_transparent)] [border-radius:4px] [transition:width_160ms_ease,_background_160ms_ease] motion-reduce:[transition:none]",
  preview:
    "section-navigator-preview [position:absolute] [top:50%] [right:100%] [display:grid] [visibility:hidden] [gap:8px] [width:min(260px,_calc(100vw_-_72px))] [padding:16px] [color:var(--foreground)] [pointer-events:none] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:12px] [box-shadow:0_8px_24px_color-mix(in_srgb,_var(--foreground)_12%,_transparent)] [opacity:0] [transform:translateY(-50%)] [&_strong]:[font-size:13px] [font-weight:600] [line-height:1.4] [&_>_span]:[font-size:12px] [line-height:1.6] [color:var(--muted-foreground)]",
  root: "section-navigator [position:fixed] [top:50%] [right:8px] [z-index:40] [display:flex] [flex-direction:column] [gap:2px] [max-height:65dvh] [transform:translateY(-50%)] max-[900px]:[right:2px]",
} as const;

import type { CSSProperties } from "react";

export const sectionNavigatorStyle = (count: number) =>
  ({ "--section-count": count }) as CSSProperties;
