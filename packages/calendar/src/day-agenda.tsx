"use client";

import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

import { Badge } from "@shared/ui/badge";
import { EmptyState } from "@shared/ui/empty-state";
import { dateLabel } from "@shared/utils/date";

import type { CalendarItem } from "./model";

export interface DayAgendaProps {
  date: string;
  emptyMessage?: string;
  items: readonly CalendarItem[];
  renderItem?: (item: CalendarItem) => ReactNode;
}

const sourceLabels: Record<CalendarItem["source"], string> = {
  fitness: "Fitness",
  "google-calendar": "Google Calendar",
  "google-tasks": "Google Tasks",
  studio: "Studio",
};

function itemLink(href?: string) {
  if (!href || /[\s\\]/u.test(href)) return undefined;
  if (/^[/?#]/.test(href) && !href.startsWith("//")) {
    return { href };
  }
  if (!/^https?:\/\//i.test(href)) return undefined;
  const url = URL.parse(href);
  if (!url) return undefined;
  return { href: url.href, rel: "noopener noreferrer", target: "_blank" };
}

export function AgendaItem({ item }: { item: CalendarItem }) {
  const link = itemLink(item.href);
  const titleClass = `min-w-0 text-sm font-medium [overflow-wrap:anywhere] ${item.completed ? "line-through" : ""}`;
  return (
    <article className="grid gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-card-foreground">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {item.time && (
          <time className="tabular-nums" dateTime={item.time}>
            {item.time}
          </time>
        )}
        <Badge className="whitespace-normal text-left [overflow-wrap:anywhere]" variant="secondary">
          {item.sourceLabel || sourceLabels[item.source]}
        </Badge>
        {item.completed && <span>Completed</span>}
      </div>
      {link ? (
        <a
          {...link}
          className={`${titleClass} inline-flex w-fit items-center gap-1 rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
        >
          {item.title}
          {link.target && <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />}
        </a>
      ) : (
        <div className={titleClass}>{item.title}</div>
      )}
      {item.description && (
        <p className="text-sm whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere]">
          {item.description}
        </p>
      )}
    </article>
  );
}

export function DayAgenda({
  date,
  items,
  renderItem,
  emptyMessage = "Nothing scheduled",
}: DayAgendaProps) {
  const sorted = [...items].sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const groups = Map.groupBy(sorted, (item) =>
    item.time ? `${item.time.slice(0, 2)}:00` : "No time set",
  );

  return (
    <section aria-label={`Agenda for ${dateLabel(date)}`} className="grid min-w-0 gap-4 sm:gap-5">
      {items.length === 0 && (
        <EmptyState
          className="rounded-lg border border-dashed border-border bg-muted/30 py-6 [&_p:empty]:hidden"
          description=""
          height="auto"
          title={emptyMessage}
        />
      )}
      {Array.from(groups, ([hour, entries]) => (
        <div className="grid min-w-0 gap-2 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-3" key={hour}>
          <h3 className="text-xs font-medium tabular-nums text-muted-foreground sm:pt-3">{hour}</h3>
          <ul className="grid min-w-0 list-none gap-2 border-l border-border pl-3">
            {entries.map((item) => (
              <li key={`${item.source}:${item.type}:${item.id}`}>
                {renderItem ? renderItem(item) : <AgendaItem item={item} />}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
