import { ArrowUpRight, Check } from "lucide-react";

import { safeLink } from "@shared/utils";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { ItemMedia } from "../item-media/ItemMedia";
import type { SectionProps } from "../types";

export function PlanCards({ language, section }: Pick<SectionProps, "language" | "section">) {
  if (!section.items.length) return null;
  return (
    <div className="section-view-grid grid gap-s">
      {section.items.map((item) => (
        <Card asChild interaction="static" key={item.id} layout="plain">
          <article className="flex min-w-0 flex-col gap-s bg-linear-to-b from-primary/5 to-card p-md">
            {item.imageUrl && <ItemMedia item={item} language={language} video={false} />}
            <h3 className="m-0">{item.title}</h3>
            {item.value && <strong className="text-3xl tracking-tight">{item.value}</strong>}
            {item.period && <small className="text-muted-foreground">{item.period}</small>}
            {item.body && (
              <div className="whitespace-pre-line text-sm text-muted-foreground">{item.body}</div>
            )}
            {item.details?.length ? (
              <ul className="grid list-none gap-xs border-t pt-s">
                {[...new Set(item.details)].map((detail) => (
                  <li className="flex gap-xs text-sm" key={detail}>
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                    {detail}
                  </li>
                ))}
              </ul>
            ) : null}
            {item.code && (
              <pre>
                <code>{item.code}</code>
              </pre>
            )}
            {safeLink(item.url) && (
              <Button
                className="mt-auto w-full"
                endIcon={<ArrowUpRight />}
                href={item.url}
                variant="outline"
              >
                {item.title}
              </Button>
            )}
          </article>
        </Card>
      ))}
    </div>
  );
}
