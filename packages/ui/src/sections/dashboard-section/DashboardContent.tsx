import { safeLink } from "@shared/utils";

import { Card } from "../../cards";
import type { SectionProps } from "../types";

export function DashboardContent({ section }: Pick<SectionProps, "section">) {
  if (!section.items.length) return null;
  const metrics = section.items.filter((item) => item.value);
  return (
    <div className="grid gap-md">
      {metrics.length > 0 && (
        <dl className="section-view-grid grid gap-s">
          {metrics.map((item) => (
            <Card asChild interaction="static" key={item.id} layout="plain">
              <div className="min-w-0 p-md">
                <dt className="text-sm font-medium text-muted-foreground">{item.title}</dt>
                <dd className="mt-xs text-3xl font-semibold tabular-nums text-foreground">
                  {item.value}
                </dd>
              </div>
            </Card>
          ))}
        </dl>
      )}
      <ul
        aria-label={section.title}
        className="m-0 grid list-none divide-y divide-border rounded-xl border bg-card p-md"
      >
        {section.items.map((item) => (
          <li className="grid gap-xs py-s sm:grid-cols-[minmax(0,1fr)_auto]" key={item.id}>
            <div className="min-w-0">
              <strong>
                {safeLink(item.url) ? <a href={item.url}>{item.title}</a> : item.title}
              </strong>
              {item.body && (
                <div className="whitespace-pre-line text-sm text-muted-foreground">{item.body}</div>
              )}
              {item.details?.length ? (
                <div className="text-sm text-muted-foreground">{item.details.join(" · ")}</div>
              ) : null}
            </div>
            {item.period && <span className="text-sm text-muted-foreground">{item.period}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
