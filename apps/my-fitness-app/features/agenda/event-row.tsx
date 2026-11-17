"use client";

import { ChevronRight } from "lucide-react";

import type { CalendarItem } from "@shared/calendar";
import type { AgendaEvent } from "@shared/lib/schedule";
import { Input as LibraryInput } from "@shared/ui/input";

import { dayHref } from "./use-agenda-navigation";

export function toCalendarItem({ date, status, task, time }: AgendaEvent): CalendarItem {
  return {
    completed: status === "done",
    date,
    href: dayHref(date, task.id),
    id: task.id,
    source: "fitness",
    time: time ?? undefined,
    title: task.title,
    type: "event",
  };
}

export interface EventRowProps {
  busy: boolean;
  compact?: boolean;
  event: AgendaEvent;
  onOpen: (date: string, id: string) => void;
  onStatus: (event: AgendaEvent) => void;
  readOnly: boolean;
}

export function EventRow({ event, readOnly, busy, compact, onOpen, onStatus }: EventRowProps) {
  const { task, date, time, status } = event;
  return (
    <article
      className={`flex min-w-0 items-center rounded-md border border-border bg-background text-foreground ${compact ? "gap-1.5 px-1.5 py-1" : "gap-3 px-3 py-2.5"}`}
    >
      <LibraryInput
        aria-label={`Complete ${task.title}`}
        checked={status === "done"}
        className={`shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed ${compact ? "size-4" : "size-6"}`}
        disabled={readOnly || busy}
        onChange={() => onStatus(event)}
        type="checkbox"
        unstyled
      />
      <a
        className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        draggable={false}
        href={dayHref(date, task.id)}
        onClick={(event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          event.preventDefault();
          onOpen(date, task.id);
        }}
      >
        <span className="grid min-w-0 [overflow-wrap:anywhere]">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {time ?? "No time"}
            {status === "skipped" ? " · Skipped" : ""}
          </span>
          <strong
            className={`font-medium ${compact ? "text-xs" : "text-sm"} ${status === "done" ? "text-muted-foreground line-through" : ""}`}
          >
            {task.title}
          </strong>
          {!compact && (
            <span className="text-xs text-muted-foreground capitalize">
              {task.kind.replaceAll("_", " ")}
            </span>
          )}
        </span>
        {!compact && (
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        )}
      </a>
    </article>
  );
}
