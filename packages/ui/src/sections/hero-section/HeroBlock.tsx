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
        landing ? "home-container home-hero" : "grid min-w-0 items-center gap-lg md:gap-xl",
        !landing && visual && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
        className,
      )}
      {...props}
    >
      <div className={landing ? "home-hero-copy" : "grid min-w-0 gap-md"}>
        {eyebrow && (
          <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>
            {eyebrow}
          </p>
        )}
        <Heading
          className={
            landing
              ? undefined
              : "m-0 max-w-[20ch] text-balance wrap-anywhere text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl"
          }
          id={headingId}
        >
          {title}
        </Heading>
        {description && (
          <p
            className={
              landing
                ? "home-hero-description"
                : "m-0 max-w-[55ch] wrap-anywhere leading-relaxed text-muted-foreground"
            }
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
