import { cn } from "cn";

import type { CTABlockProps } from "./types";

export function CTABlock({
  title,
  headingId,
  eyebrow,
  description,
  actions,
  note,
  variant = "standard",
  className,
  children,
  ...props
}: CTABlockProps) {
  const landing = variant === "landing";
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        landing
          ? "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-final [position:relative] [padding:62px_55px] [overflow:hidden] [background:radial-gradient(_ellipse_at_90%_100%,_color-mix(in_srgb,_var(--primary)_13%,_transparent),_transparent_65%_),_color-mix(in_srgb,_var(--card)_40%,_transparent)] [border:1px_solid_var(--border)] [border-radius:12px] [&_:where(h2)]:[margin-block:22px] [font-size:clamp(43px,_5vw,_68px)] [font-weight:500] [line-height:1.07] [letter-spacing:-0.05em] max-[760px]:[padding:36px_28px] max-[760px]:[&_:where(h2)]:[font-size:48px] home-cta mb-lg"
          : "py-lg",
        className,
      )}
      {...props}
    >
      <div
        className={
          landing
            ? "home-final-inner"
            : "grid justify-items-center gap-sm rounded-xl border bg-linear-to-br from-primary/10 via-card to-card p-lg text-center sm:p-xl"
        }
      >
        {eyebrow && (
          <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>
            {eyebrow}
          </p>
        )}
        <h2
          className={landing ? undefined : "m-0 text-3xl tracking-tight md:text-4xl"}
          id={headingId}
        >
          {title}
        </h2>
        {description && (
          <p className={landing ? undefined : "m-0 max-w-prose text-muted-foreground"}>
            {description}
          </p>
        )}
        {children}
        {actions &&
          (landing ? (
            actions
          ) : (
            <div className="flex flex-wrap justify-center gap-s">{actions}</div>
          ))}
        {note && (
          <span className={landing ? "home-final-note" : "text-sm text-muted-foreground"}>
            {note}
          </span>
        )}
      </div>
      {landing && (
        <span
          aria-hidden="true"
          className="home-final-glyph [position:absolute] [top:-35px] [right:55px] [font-size:330px] [font-weight:250] [line-height:1.3] [color:color-mix(in_srgb,_var(--primary)_12%,_transparent)] max-[760px]:[top:20px] [right:-30px] [font-size:240px]"
        >
          ↗
        </span>
      )}
    </section>
  );
}
