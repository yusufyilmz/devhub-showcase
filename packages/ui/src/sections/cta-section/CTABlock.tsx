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
      className={cn(landing ? "home-container home-final home-cta mb-lg" : "py-lg", className)}
      {...props}
    >
      <div
        className={
          landing
            ? "home-final-inner"
            : "grid min-w-0 grid-cols-[minmax(0,1fr)] justify-items-center gap-md rounded-xl border border-border/75 bg-linear-to-br from-primary/10 via-card to-card p-md text-center wrap-anywhere sm:p-xl"
        }
      >
        {eyebrow && (
          <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>
            {eyebrow}
          </p>
        )}
        <h2
          className={
            landing
              ? undefined
              : "m-0 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl"
          }
          id={headingId}
        >
          {title}
        </h2>
        {description && (
          <p
            className={
              landing ? undefined : "m-0 max-w-prose leading-relaxed text-muted-foreground"
            }
          >
            {description}
          </p>
        )}
        {children}
        {actions &&
          (landing ? (
            actions
          ) : (
            <div className="flex min-w-0 max-w-full flex-wrap justify-center gap-s [&_[data-slot=button]]:h-auto [&_[data-slot=button]]:min-h-10 [&_[data-slot=button]]:min-w-0 [&_[data-slot=button]]:max-w-full [&_[data-slot=button]]:whitespace-normal">
              {actions}
            </div>
          ))}
        {note && (
          <span className={landing ? "home-final-note" : "text-sm text-muted-foreground"}>
            {note}
          </span>
        )}
      </div>
      {landing && (
        <span aria-hidden="true" className="home-final-glyph">
          ↗
        </span>
      )}
    </section>
  );
}
