"use client";
import { type DragEvent, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { type AgendaEvent, AgendaService } from "@shared/services/schedule";
import type { Workspace } from "@shared/services/types";
import { dateKey, dateLabel, monday, shiftDate } from "@shared/services/types";
import { Button as LibraryButton } from "@shared/ui/button";

import { EventRow, eventDragType } from "@/features/agenda/event-row";
import { dayHref } from "@/features/agenda/use-agenda-navigation";

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
  const [mode, setMode] = useState<"month" | "week">("month");
  const first = `${date.slice(0, 7)}-01`;
  const start = mode === "week" ? monday(date) : monday(first);
  const days = useMemo(
    () => Array.from({ length: mode === "week" ? 7 : 42 }, (_, i) => shiftDate(start, i)),
    [start, mode],
  );
  const events = useMemo(
    () => new Map(days.map((d) => [d, agenda.events(workspace, d)])),
    [workspace, days],
  );
  const [hover, setHover] = useState<string | null>(null);
  const today = dateKey(workspace.settings.timezone);
  const dropZone = (day: string, time?: string | null) => ({
    onDragLeave: () => setHover(null),
    onDragOver: (e: DragEvent) => {
      if (readOnly || busy || !e.dataTransfer.types.includes(eventDragType)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setHover(`${day}:${time}`);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setHover(null);
      if (readOnly || busy) return;
      try {
        const value = JSON.parse(e.dataTransfer.getData(eventDragType));
        if (typeof value.id !== "string" || typeof value.date !== "string") return;
        onMove(value.id, value.date, day, time === undefined ? value.time : time);
      } catch {
        /* Ignore unrelated drag payloads. */
      }
    },
  });
  const renderEvent = (event: AgendaEvent) => (
    <EventRow compact key={event.task.id} {...{ busy, event, onOpen, onStatus, readOnly }} />
  );
  const dayLink = (day: string) => (
    <a
      aria-label={`Open ${dateLabel(day)}`}
      className={`calendar-date ${day === today ? "is-today" : ""}`}
      href={dayHref(day)}
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
          e.preventDefault();
          openDay(day);
        }
      }}
    >
      <span>{mode === "week" ? dateLabel(day) : Number(day.slice(-2))}</span>
    </a>
  );
  function page(direction: number) {
    if (mode === "week") setDate(shiftDate(date, 7 * direction));
    else {
      const d = new Date(`${first}T12:00Z`);
      d.setUTCMonth(d.getUTCMonth() + direction);
      setDate(d.toISOString().slice(0, 10));
    }
  }
  return (
    <section className="card calendar-board">
      <div className="section-heading calendar-toolbar">
        <h2>
          {mode === "month"
            ? new Date(`${first}T12:00Z`).toLocaleDateString("en-GB", {
                month: "long",
                timeZone: "UTC",
                year: "numeric",
              })
            : `${dateLabel(start)} – ${dateLabel(days[6] ?? start)}`}
        </h2>
        <div className="row">
          <div className="tabs">
            <LibraryButton
              className={mode === "month" ? "selected" : ""}
              onClick={() => setMode("month")}
              type="button"
              variant="unstyled"
            >
              Month
            </LibraryButton>
            <LibraryButton
              className={mode === "week" ? "selected" : ""}
              onClick={() => setMode("week")}
              type="button"
              variant="unstyled"
            >
              Week
            </LibraryButton>
          </div>
          <LibraryButton
            className="text-btn"
            onClick={() => setDate(today)}
            type="button"
            variant="unstyled"
          >
            Today
          </LibraryButton>
          <LibraryButton
            aria-label={`Previous ${mode}`}
            className="icon-btn"
            onClick={() => page(-1)}
            type="button"
            variant="unstyled"
          >
            <ChevronLeft size={18} />
          </LibraryButton>
          <LibraryButton
            aria-label={`Next ${mode}`}
            className="icon-btn"
            onClick={() => page(1)}
            type="button"
            variant="unstyled"
          >
            <ChevronRight size={18} />
          </LibraryButton>
        </div>
      </div>
      <p className="hint calendar-help">
        Select a date for its agenda, or an activity for details.
        {!readOnly &&
          " Drag a pending activity to another date; in Week view, drop it into an hour. Exact times can be edited in details."}
      </p>
      <div className="calendar-scroll">
        {mode === "month" ? (
          <div className="event-month">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span className="weekday" key={d}>
                {d}
              </span>
            ))}
            {days.map((day) => (
              <div
                className={`event-day ${day === date ? "selected-day" : ""} ${day.slice(0, 7) !== date.slice(0, 7) ? "outside-month" : ""} ${hover === `${day}:undefined` ? "drop-hover" : ""}`}
                key={day}
                {...dropZone(day)}
              >
                {dayLink(day)}
                <div className="month-events">{events.get(day)?.map(renderEvent)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="event-week">
            <div className="week-heading">
              <span className="hour-label">Time</span>
              {days.map((day) => (
                <div key={day}>{dayLink(day)}</div>
              ))}
            </div>
            <div className="week-hour">
              <span className="hour-label">No time</span>
              {days.map((day) => (
                <div
                  className={`week-slot ${hover === `${day}:null` ? "drop-hover" : ""}`}
                  key={day}
                  {...dropZone(day, null)}
                >
                  {events
                    .get(day)
                    ?.filter((e) => !e.time)
                    .map(renderEvent)}
                </div>
              ))}
            </div>
            {Array.from({ length: 24 }, (_, h) => {
              const hour = String(h).padStart(2, "0");
              return (
                <div className="week-hour" key={hour}>
                  <span className="hour-label">{hour}:00</span>
                  {days.map((day) => (
                    <div
                      className={`week-slot ${hover === `${day}:${hour}:00` ? "drop-hover" : ""}`}
                      key={day}
                      {...dropZone(day, `${hour}:00`)}
                      title={`${dateLabel(day)} ${hour}:00`}
                    >
                      {events
                        .get(day)
                        ?.filter((e) => e.time?.startsWith(`${hour}:`))
                        .map(renderEvent)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
