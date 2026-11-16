import { cn } from "cn";

import { SectionAccordion } from "../section";
import type { FAQBlockProps } from "./types";

const faqLayouts = {
  "faq-reversed": {
    intro: "min-w-0 md:col-start-2 md:row-start-1",
    list: "min-w-0 md:col-start-1 md:row-start-1",
    wrapper: "grid min-w-0 items-start gap-lg md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-xl",
  },
  "faq-stacked": {
    intro: "mx-auto max-w-prose text-center",
    list: "min-w-0",
    wrapper: "mx-auto grid min-w-0 max-w-3xl gap-lg",
  },
  landing: {
    intro: "home-section-intro",
    list: "home-faq-list",
    wrapper: "home-container home-faq",
  },
  standard: {
    intro: "min-w-0",
    list: "min-w-0",
    wrapper: "grid min-w-0 items-start gap-lg md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-xl",
  },
} as const;

export function FAQBlock({
  title,
  headingId,
  eyebrow,
  description,
  items,
  variant = "standard",
  layout,
  className,
  ...props
}: FAQBlockProps) {
  const landing = variant === "landing";
  const classes = faqLayouts[landing ? "landing" : (layout ?? "standard")];
  return (
    <section aria-labelledby={headingId} className={cn(classes.wrapper, className)} {...props}>
      <div className={classes.intro}>
        {eyebrow && (
          <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>
            {eyebrow}
          </p>
        )}
        <h2
          className={
            landing
              ? undefined
              : "m-0 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
          }
          id={headingId}
        >
          {title}
        </h2>
        {description && <p className="mt-s leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {items.length > 0 && (
        <div className={classes.list}>
          <SectionAccordion
            items={items}
            label={typeof title === "string" ? title : "Common questions"}
            surface="portfolio"
            type={landing ? "reveal" : undefined}
          />
        </div>
      )}
    </section>
  );
}
