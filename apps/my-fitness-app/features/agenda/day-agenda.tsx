"use client";
import { type AgendaEvent, AgendaService } from "@shared/lib/schedule";
import type { Workspace } from "@shared/lib/types";
import { EmptyState } from "@shared/ui/empty-state";

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
    <section aria-label="Daily agenda by hour" className="day-agenda [display:grid] [gap:24px]">
      {events.length === 0 && (
        <EmptyState
          description={
            readOnly
              ? "There are no demo activities on this date."
              : "Use Add task to plan an activity for this date."
          }
          height="auto"
          title="No activities planned for this day"
        />
      )}
      {Array.from(groups, ([hour, items]) => (
        <div
          className="agenda-hour [display:grid] [grid-template-columns:76px_minmax(0,_1fr)] [gap:18px] [&_>_h3]:[padding-top:17px] [font-size:12px] [font-weight:500] [color:var(--muted)] max-[700px]:[grid-template-columns:54px_minmax(0,_1fr)] [gap:5px] max-[700px]:[&_>_h3]:[font-size:10px]"
          key={hour}
        >
          <h3>{hour}</h3>
          <div className="agenda-hour-events [display:grid] [gap:9px] [padding-left:20px] [border-left:1px_solid_var(--line)] max-[700px]:[padding-left:10px]">
            {items.map((event) => (
              <EventRow key={event.task.id} {...{ busy, event, onOpen, onStatus, readOnly }} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
