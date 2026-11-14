import { cn } from "cn";

import { SectionAccordion } from "@shared/ui/section";

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
          ? "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-faq [display:grid] [grid-template-columns:1fr_1.15fr] [gap:70px] [padding-top:65px] [margin-block:110px] [border-top:1px_solid_var(--border)] max-[1000px]:[gap:40px] max-[760px]:[grid-template-columns:1fr] [gap:28px] [padding-top:45px] [margin-block:65px]"
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
        <div
          className={
            landing
              ? "home-faq-list [&_:where(details)[open]_:where(summary)_>_:where(span)]:[transform:rotate(45deg)]"
              : "min-w-0"
          }
        >
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
