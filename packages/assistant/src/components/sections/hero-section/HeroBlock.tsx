import { cn } from "cn";

import type { HeroBlockProps } from "./types";

export function HeroBlock({
  title,
  headingId,
  headingLevel: Heading = "h2",
  eyebrow,
  description,
  actions,
  notes,
  visual,
  variant = "standard",
  className,
  children,
  ...props
}: HeroBlockProps) {
  const landing = variant === "landing";
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        landing
          ? "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-hero [position:relative] [display:grid] [grid-template-columns:1fr_1fr] [gap:70px] [align-items:center] [padding-block:90px_85px] [&_:where(h1)]:[margin:25px_0] [font-size:clamp(65px,_6.2vw,_90px)] [font-weight:550] [line-height:1.02] [letter-spacing:-0.065em] [&_:where(h1)_>_:where(span)]:[color:var(--primary)] min-[1450px]:[gap:100px] max-[1000px]:[gap:35px] [padding-block:65px] max-[1000px]:[&_:where(h1)]:[font-size:65px] max-[760px]:[grid-template-columns:1fr] [gap:43px] [padding-block:50px] max-[760px]:[&_:where(h1)]:[margin-block:20px] [font-size:clamp(62px,_12vw,_80px)] max-[380px]:[&_:where(h1)]:[font-size:59px] motion-safe:[&_>_.home-preview-wrap]:[animation:home-enter_var(--transition-slow,_550ms)_cubic-bezier(0.22,_1,_0.36,_1)_both] motion-safe:[&_>_.home-preview-wrap]:[animation-delay:180ms] motion-safe:[&_>_.home-preview-wrap:focus-within]:[animation:none]"
          : "grid items-center gap-lg",
        !landing && visual && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
        className,
      )}
      {...props}
    >
      <div className={landing ? "home-hero-copy" : "grid min-w-0 gap-sm"}>
        {eyebrow && (
          <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>
            {eyebrow}
          </p>
        )}
        <Heading
          className={landing ? undefined : "m-0 text-4xl leading-tight tracking-tight md:text-5xl"}
          id={headingId}
        >
          {title}
        </Heading>
        {description && (
          <p
            className={landing ? "home-hero-description" : "m-0 max-w-prose text-muted-foreground"}
          >
            {description}
          </p>
        )}
        {actions && (
          <div className={landing ? "home-hero-actions" : "flex flex-wrap items-center gap-s"}>
            {actions}
          </div>
        )}
        {notes && (
          <div className={landing ? "home-hero-notes" : "text-sm text-muted-foreground"}>
            {notes}
          </div>
        )}
      </div>
      {visual}
      {children}
    </section>
  );
}
