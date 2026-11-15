import type { CSSProperties } from "react";

import { Quote } from "lucide-react";

import { Card } from "@shared/ui/cards";
import { safeLink } from "@shared/utils";

import type { SectionProps } from "../types";

export function TestimonialCards({ section }: Pick<SectionProps, "section">) {
  if (!section.items.length) return null;
  const columns = Math.min(section.options?.columns ?? 3, section.items.length);
  return (
    <div
      className="section-view-grid [ul&]:[display:grid] grid gap-md"
      style={{ "--section-columns": columns } as CSSProperties}
    >
      {section.items.map((item) => (
        <Card asChild interaction="static" key={item.id} layout="plain">
          <figure className="m-0 flex min-w-0 flex-col gap-md p-md sm:p-lg">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary"
            >
              <Quote className="size-4" />
            </span>
            {item.body && (
              <blockquote className="section-testimonial-quote text-base leading-relaxed whitespace-pre-line sm:text-lg">
                {item.body}
              </blockquote>
            )}
            {item.details?.length ? (
              <div className="text-sm text-muted-foreground">{item.details.join(" · ")}</div>
            ) : null}
            {item.code && (
              <pre>
                <code>{item.code}</code>
              </pre>
            )}
            <figcaption className="mt-auto flex items-center gap-sm border-t border-border pt-sm">
              {item.imageUrl && safeLink(item.imageUrl) ? (
                <img
                  alt=""
                  className="size-9 shrink-0 rounded-full object-cover"
                  height={36}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src={item.imageUrl}
                  width={36}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary"
                >
                  {item.title.trim().slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <strong>
                  {safeLink(item.url) ? <a href={item.url}>{item.title}</a> : item.title}
                </strong>
                {(item.value || item.period) && (
                  <div className="text-sm text-muted-foreground">
                    {[item.value, item.period].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
            </figcaption>
          </figure>
        </Card>
      ))}
    </div>
  );
}
