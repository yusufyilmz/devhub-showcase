import { ArrowUpRight, Check } from "lucide-react";

import { safeLink } from "@shared/utils";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { ItemMedia } from "../item-media/ItemMedia";
import type { SectionProps } from "../types";

export function PlanCards({ language, section }: Pick<SectionProps, "language" | "section">) {
  if (!section.items.length) return null;
  return (
    <div className="section-view-grid grid gap-md">
      {section.items.map((item) => (
        <Card asChild interaction="static" key={item.id} layout="plain">
          <article className="flex min-w-0 flex-col gap-sm border-border/75 bg-linear-to-b from-primary/5 to-card p-md sm:p-lg">
            {item.imageUrl && <ItemMedia item={item} language={language} video={false} />}
            <h3 className="m-0 text-base font-semibold tracking-tight">{item.title}</h3>
            {item.value && (
              <strong className="text-3xl font-semibold tracking-tight tabular-nums">
                {item.value}
              </strong>
            )}
            {item.period && <small className="text-muted-foreground">{item.period}</small>}
            {item.body && (
              <div className="whitespace-pre-line text-sm text-muted-foreground">{item.body}</div>
            )}
            {item.details?.length ? (
              <ul className="m-0 grid list-none gap-s border-t border-border/70 p-0 pt-sm">
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
                className="mt-auto h-auto min-h-10 w-full max-w-full whitespace-normal"
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
