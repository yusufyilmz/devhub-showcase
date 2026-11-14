"use client";
import { type DragEvent, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { type AgendaEvent, AgendaService } from "@shared/lib/schedule";
import type { Workspace } from "@shared/lib/types";
import { dateKey, dateLabel, monday, shiftDate } from "@shared/lib/types";
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
    <section className="card [padding:24px] [margin-bottom:20px] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:12px] max-[700px]:[padding:18px] [box-shadow:0_2px_10px_var(--shadow-color)] calendar-board max-[700px]:[padding:12px]">
      <div className="section-heading [position:sticky] [top:118px] [align-self:start] [&_.eyebrow]:[margin-bottom:12px] [&_h2]:[margin-bottom:16px] [font-size:30px] [font-weight:600] [line-height:1.25] [letter-spacing:-0.04em] [&_>_p:last-child]:[font-size:13px] [line-height:1.7] [color:var(--muted-foreground)] max-[767px]:[position:static] max-[767px]:[&_h2]:[margin-bottom:8px] [font-size:26px] [display:flex] [gap:14px] [align-items:center] [justify-content:space-between] [margin-bottom:20px] [&_h2]:[display:flex] [gap:8px] max-[700px]:[margin-bottom:16px] max-[700px]:[&_h2]:[font-size:17px] calendar-toolbar [flex-wrap:wrap] [&_.row]:[flex-wrap:wrap]">
        <h2>
          {mode === "month"
            ? new Date(`${first}T12:00Z`).toLocaleDateString("en-GB", {
                month: "long",
                timeZone: "UTC",
                year: "numeric",
              })
            : `${dateLabel(start)} – ${dateLabel(days[6] ?? start)}`}
        </h2>
        <div className="row [display:flex] [gap:10px] [align-items:center]">
          <div className="tabs [display:flex] [gap:7px] [overflow:auto] [&_button]:[padding:8px_13px] [font-size:11px] [color:var(--muted)] [white-space:nowrap] [background:transparent] [border:1px_solid_transparent] [border-radius:6px] [&_button.selected]:[color:var(--ink)] [background:var(--surface-soft)] [border-color:var(--line)] max-[700px]:[&_button]:[font-size:11px] [&_button.selected]:[color:var(--accent)] [background:var(--accent-soft)]">
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
            className="text-btn [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:32px] [padding:4px_0] [font-size:12px] [font-weight:550] [color:var(--ink)] [background:transparent] [border:0] max-[700px]:[font-size:11px] [color:var(--accent)]"
            onClick={() => setDate(today)}
            type="button"
            variant="unstyled"
          >
            Today
          </LibraryButton>
          <LibraryButton
            aria-label={`Previous ${mode}`}
            className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
            onClick={() => page(-1)}
            type="button"
            variant="unstyled"
          >
            <ChevronLeft size={18} />
          </LibraryButton>
          <LibraryButton
            aria-label={`Next ${mode}`}
            className="icon-btn [display:inline-flex] [align-items:center] [justify-content:center] [min-width:34px] [min-height:34px] [padding:8px] [color:var(--muted)] [background:transparent] [border:0] [border-radius:6px] hover:[background:var(--surface-soft)] hover:[color:var(--accent)] [background:var(--surface-soft)]"
            onClick={() => page(1)}
            type="button"
            variant="unstyled"
          >
            <ChevronRight size={18} />
          </LibraryButton>
        </div>
      </div>
      <p className="hint [font-size:11px] [line-height:1.7] [color:var(--muted)] calendar-help [margin-bottom:18px]">
        Select a date for its agenda, or an activity for details.
        {!readOnly &&
          " Drag a pending activity to another date; in Week view, drop it into an hour. Exact times can be edited in details."}
      </p>
      <div className="calendar-scroll [max-height:75vh] [overflow:auto] [border:1px_solid_var(--line)] [border-radius:10px]">
        {mode === "month" ? (
          <div className="event-month [display:grid] [grid-template-columns:repeat(7,_minmax(150px,_1fr))] [min-width:1050px] [&_>_.weekday]:[position:sticky] [top:0] [z-index:2] [background:var(--surface)] [border-bottom:1px_solid_var(--line)]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span
                className="weekday [padding:10px] [font-size:11px] [color:var(--muted)] [text-align:center] max-[700px]:[padding:8px_0] [font-size:9px]"
                key={d}
              >
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
                <div className="month-events [display:grid] [gap:5px] [margin-top:5px]">
                  {events.get(day)?.map(renderEvent)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="event-week [min-width:1150px]">
            <div className="week-heading [display:grid] [grid-template-columns:65px_repeat(7,_minmax(150px,_1fr))] [position:sticky] [top:0] [z-index:2] [background:var(--surface)] [border-bottom:1px_solid_var(--line)] [&_>_div]:[padding:5px] [border-left:1px_solid_var(--line)]">
              <span className="hour-label [padding:12px_7px] [font-size:10px] [color:var(--muted)]">
                Time
              </span>
              {days.map((day) => (
                <div key={day}>{dayLink(day)}</div>
              ))}
            </div>
            <div className="week-hour [display:grid] [grid-template-columns:65px_repeat(7,_minmax(150px,_1fr))]">
              <span className="hour-label [padding:12px_7px] [font-size:10px] [color:var(--muted)]">
                No time
              </span>
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
                <div
                  className="week-hour [display:grid] [grid-template-columns:65px_repeat(7,_minmax(150px,_1fr))]"
                  key={hour}
                >
                  <span className="hour-label [padding:12px_7px] [font-size:10px] [color:var(--muted)]">
                    {hour}:00
                  </span>
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
