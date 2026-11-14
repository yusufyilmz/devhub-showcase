export const brandStyles = {
  element1:
    "home-brand [display:inline-flex] [flex-shrink:0] [gap:10px] [align-items:center] [color:var(--primary)] [text-decoration:none] [&_>_:where(span)]:[font-size:19px] [font-weight:650] [color:var(--foreground)] [letter-spacing:-0.8px] [&_:where(b)]:[color:var(--primary)] max-[760px]:[&_>_:where(span)]:[font-size:17px] max-[760px]:[&_:where(svg)]:[width:28px] [height:28px]",
  element2: "home-brand-light [font-weight:400]",
} as const;
