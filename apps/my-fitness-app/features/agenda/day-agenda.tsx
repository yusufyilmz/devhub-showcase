"use client";

import { DayAgenda as SharedDayAgenda } from "@shared/calendar/day-agenda";
import { type AgendaEvent, AgendaService } from "@shared/lib/schedule";
import type { Workspace } from "@shared/lib/types";

import { EventRow, toCalendarItem } from "./event-row";

const agenda = new AgendaService();

export function DayAgenda({
  workspace,
  date,
  readOnly,
  busy,
  onOpen,
  onStatus,
}: {
  workspace: Workspace;
  date: string;
  readOnly: boolean;
  busy: boolean;
  onOpen: (date: string, id: string) => void;
  onStatus: (event: AgendaEvent) => void;
}) {
  const events = new Map(
    agenda.events(workspace, date).map((event) => [toCalendarItem(event), event]),
  );
  return (
    <SharedDayAgenda
      date={date}
      emptyMessage={
        readOnly
          ? "There are no demo activities on this date."
          : "Use Add task to plan an activity for this date."
      }
      items={[...events.keys()]}
      renderItem={(item) => {
        const event = events.get(item);
        return event && <EventRow {...{ busy, event, onOpen, onStatus, readOnly }} />;
      }}
    />
  );
}
