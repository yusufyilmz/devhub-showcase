"use client";
import { ChevronRight } from "lucide-react";

import type { AgendaEvent } from "@shared/lib/schedule";
import { Input as LibraryInput } from "@shared/ui/input";

import { dayHref } from "./use-agenda-navigation";
export const eventDragType = "application/x-fitness-event";
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
      className={`agenda-event [&[draggable='true']]:[cursor:grab] [&[draggable='true']:active]:[cursor:grabbing] event-${task.kind} ${compact ? "compact-event" : ""} event-status-${status}`}
      draggable={!readOnly && !busy && task.scope === "scheduled" && status === "pending"}
      onDragStart={(e) => {
        e.dataTransfer.setData(eventDragType, JSON.stringify({ date, id: task.id, time }));
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <LibraryInput
        aria-label={`Complete ${task.title}`}
        checked={status === "done"}
        className="event-checkbox [display:block] [flex-shrink:0] [width:26px] [height:26px] [padding:0] [margin:0] [accent-color:var(--accent)] [cursor:pointer] disabled:[cursor:not-allowed]"
        disabled={readOnly || busy}
        onChange={() => onStatus(event)}
        type="checkbox"
        unstyled
      />
      <a
        className="event-link [display:flex] [flex:1] [gap:12px] [align-items:center] [justify-content:space-between] [min-width:0] [&_>_svg]:[flex-shrink:0] [color:var(--accent)]"
        href={dayHref(date, task.id)}
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            onOpen(date, task.id);
          }
        }}
      >
        <span className="event-copy [display:flex] [flex-direction:column] [gap:5px] [min-width:0] [&_strong]:[font-size:13px] [overflow-wrap:anywhere] max-[700px]:[&_strong]:[font-size:12px]">
          <span className="event-time [font-size:10px] [font-variant-numeric:tabular-nums] [color:var(--accent)]">
            {time ?? "No time"}
            {status === "skipped" ? " · Skipped" : ""}
          </span>
          <strong>{task.title}</strong>
          {!compact && (
            <span className="event-kind [font-size:10px] [color:var(--muted)] [text-transform:capitalize]">
              {task.kind.replaceAll("_", " ")}
            </span>
          )}
        </span>
        <ChevronRight aria-hidden="true" size={17} />
      </a>
    </article>
  );
}
