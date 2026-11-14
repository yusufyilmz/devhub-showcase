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
          ? "home-container [width:min(var(--home-width,_1200px),_calc(100%_-_80px))] [margin-inline:auto] max-[1000px]:[width:calc(100%_-_52px)] max-[760px]:[width:calc(100%_-_40px)] max-[380px]:[width:calc(100%_-_32px)] home-faq [display:grid] [grid-template-columns:1fr_1.15fr] [gap:70px] [padding-top:65px] [margin-block:110px] [border-top:1px_solid_var(--border)] max-[1000px]:[gap:40px] max-[760px]:[grid-template-columns:1fr] max-[760px]:[gap:28px] max-[760px]:[padding-top:45px] max-[760px]:[margin-block:65px]"
          : "grid gap-md md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-xl",
        className,
      )}
      {...props}
    >
      <div className={landing ? "home-section-intro [&_h2]:my-[17px] [&_h2]:mb-[20px] [&_h2]:text-[clamp(34px,4vw,51px)] [&_h2]:font-medium [&_h2]:leading-[1.16] [&_h2]:tracking-[-0.045em] [&_p:not(.home-eyebrow)]:max-w-[510px] [&_p:not(.home-eyebrow)]:text-[14px] [&_p:not(.home-eyebrow)]:leading-[1.9] [&_p:not(.home-eyebrow)]:text-muted-foreground max-[760px]:[&_h2]:text-[36px] max-[760px]:[&_p:not(.home-eyebrow)]:text-[13px]" : "min-w-0"}>
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
              ? "home-faq-list [&_details]:border-b [&_details]:border-border [&_details]:py-[23px] [&_details:first-child]:pt-[4px] [&_summary]:flex [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-[22px] [&_summary]:text-[13px] [&_summary]:font-medium [&_summary]:leading-[1.6] [&_summary]:cursor-pointer [&_summary]:list-none [&_summary>span]:text-[19px] [&_summary>span]:font-light [&_summary>span]:text-primary [&_summary>span]:transition-transform [&_details>p]:mt-[16px] [&_details>p]:max-w-[470px] [&_details>p]:text-[12px] [&_details>p]:leading-[1.9] [&_details>p]:text-muted-foreground [&_:where(details)[open]_:where(summary)_>_:where(span)]:[transform:rotate(45deg)]"
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
