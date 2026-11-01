"use client";
import { ChevronRight } from "lucide-react";

import type { AgendaEvent } from "@shared/services/schedule";

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
      className={`agenda-event event-${task.kind} ${compact ? "compact-event" : ""} event-status-${status}`}
      draggable={!readOnly && !busy && task.scope === "scheduled" && status === "pending"}
      onDragStart={(e) => {
        e.dataTransfer.setData(eventDragType, JSON.stringify({ date, id: task.id, time }));
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <input
        aria-label={`Complete ${task.title}`}
        checked={status === "done"}
        className="event-checkbox"
        disabled={readOnly || busy}
        onChange={() => onStatus(event)}
        type="checkbox"
      />
      <a
        className="event-link"
        href={dayHref(date, task.id)}
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            onOpen(date, task.id);
          }
        }}
      >
        <span className="event-copy">
          <span className="event-time">
            {time ?? "No time"}
            {status === "skipped" ? " · Skipped" : ""}
          </span>
          <strong>{task.title}</strong>
          {!compact && <span className="event-kind">{task.kind.replaceAll("_", " ")}</span>}
        </span>
        <ChevronRight aria-hidden="true" size={17} />
      </a>
    </article>
  );
}
