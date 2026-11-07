import { cn } from "cn";

import { SectionAccordion } from "../../layout/section";
import type { FAQBlockProps } from "./types";

export function FAQBlock({
  title,
  headingId,
  eyebrow,
  description,
  items,
  variant = "standard",
  className,
  ...props
}: FAQBlockProps) {
  const landing = variant === "landing";
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        landing
          ? "home-container home-faq"
          : "grid gap-md md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-xl",
        className,
      )}
      {...props}
    >
      <div className={landing ? "home-section-intro" : "min-w-0"}>
        {eyebrow && (
          <p className={landing ? "home-eyebrow" : "text-sm font-semibold text-primary"}>
            {eyebrow}
          </p>
        )}
        <h2 className={landing ? undefined : "m-0 text-3xl tracking-tight"} id={headingId}>
          {title}
        </h2>
        {description && <p className="mt-s text-muted-foreground">{description}</p>}
      </div>
      {items.length > 0 && (
        <div className={landing ? "home-faq-list" : "min-w-0"}>
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
