"use client";
import { type AgendaEvent, AgendaService } from "@shared/services/schedule";
import type { Workspace } from "@shared/services/types";

import { EventRow } from "./event-row";

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
  const events = agenda.events(workspace, date);
  const groups = Map.groupBy(events, (e) => (e.time ? `${e.time.slice(0, 2)}:00` : "No time set"));
  return (
    <section aria-label="Daily agenda by hour" className="day-agenda">
      {events.length === 0 && <p className="empty">No activities planned for this day.</p>}
      {Array.from(groups, ([hour, items]) => (
        <div className="agenda-hour" key={hour}>
          <h3>{hour}</h3>
          <div className="agenda-hour-events">
            {items.map((event) => (
              <EventRow key={event.task.id} {...{ busy, event, onOpen, onStatus, readOnly }} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
