"use client";

import { useMemo } from "react";

import type { CalendarItem } from "@shared/calendar";
import { CalendarGrid as SharedCalendarGrid } from "@shared/calendar/calendar-grid";
import { type AgendaEvent, AgendaService } from "@shared/lib/schedule";
import { dateKey, type Workspace } from "@shared/lib/types";

import { EventRow, toCalendarItem } from "../agenda/event-row";
import { dayHref } from "../agenda/use-agenda-navigation";

const agenda = new AgendaService();

export interface CalendarGridProps {
  busy: boolean;
  date: string;
  onMove: (id: string, from: string, to: string, time: string | null) => void;
  onOpen: (date: string, id: string) => void;
  onStatus: (event: AgendaEvent) => void;
  openDay: (date: string) => void;
  readOnly: boolean;
  setDate: (date: string) => void;
  workspace: Workspace;
}

export function CalendarGrid({
  workspace,
  date,
  readOnly,
  busy,
  setDate,
  openDay,
  onOpen,
  onStatus,
  onMove,
}: CalendarGridProps) {
  const { events, getItems } = useMemo(() => {
    const events = new WeakMap<CalendarItem, AgendaEvent>();
    return {
      events,
      getItems(day: string) {
        return agenda.events(workspace, day).map((event) => {
          const item = toCalendarItem(event);
          events.set(item, event);
          return item;
        });
      },
    };
  }, [workspace]);

  return (
    <SharedCalendarGrid
      canMove={(item) => {
        const event = events.get(item);
        return event?.task.scope === "scheduled" && event.status === "pending";
      }}
      date={date}
      dayHref={dayHref}
      getItems={getItems}
      onDateChange={setDate}
      onMove={
        readOnly || busy ? undefined : (id, from, to, time) => onMove(id, from, to, time ?? null)
      }
      onOpenDay={openDay}
      renderItem={(item) => {
        const event = events.get(item);
        return event && <EventRow compact {...{ busy, event, onOpen, onStatus, readOnly }} />;
      }}
      today={dateKey(workspace.settings.timezone)}
    />
  );
}
