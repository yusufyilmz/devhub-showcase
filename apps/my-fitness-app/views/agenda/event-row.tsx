"use client";

import type { CalendarItem } from "@shared/calendar";
import { EventRow as AgendaEventRow } from "@shared/calendar/event-row";
import type { AgendaEvent } from "@shared/lib/schedule";

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
    <AgendaEventRow
      busy={busy}
      compact={compact}
      completed={status === "done"}
      detail={task.kind.replaceAll("_", " ")}
      href={dayHref(date, task.id)}
      onOpen={() => onOpen(date, task.id)}
      onToggle={() => onStatus(event)}
      readOnly={readOnly}
      skipped={status === "skipped"}
      time={time ?? undefined}
      title={task.title}
    />
  );
}
