import { Quote } from "lucide-react";

import { safeLink } from "@shared/utils";

import { Card } from "../../cards";
import type { SectionProps } from "../types";

export function TestimonialCards({ section }: Pick<SectionProps, "section">) {
  if (!section.items.length) return null;
  return (
    <div className="section-view-grid grid gap-s">
      {section.items.map((item) => (
        <Card asChild interaction="static" key={item.id} layout="plain">
          <figure className="m-0 flex min-w-0 flex-col gap-md p-md">
            <Quote aria-hidden="true" className="size-6 text-primary" />
            {item.body && (
              <blockquote className="border-0 p-0 text-lg leading-relaxed whitespace-pre-line">
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
            <figcaption className="mt-auto flex items-center gap-s border-t pt-s">
              {item.imageUrl && safeLink(item.imageUrl) ? (
                <img
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover"
                  height={40}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src={item.imageUrl}
                  width={40}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary"
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
