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
        <span aria-hidden="true" className="home-final-glyph">
          ↗
        </span>
      )}
    </section>
  );
}
