"use client";

import { ChevronRight } from "lucide-react";

import { Input } from "@shared/ui/input";

export interface EventRowProps {
  busy: boolean;
  compact?: boolean;
  completed: boolean;
  detail?: string;
  href: string;
  onOpen: () => void;
  onToggle: () => void;
  readOnly: boolean;
  skipped?: boolean;
  time?: string;
  title: string;
}

export function EventRow({
  busy,
  compact,
  completed,
  detail,
  href,
  onOpen,
  onToggle,
  readOnly,
  skipped,
  time,
  title,
}: EventRowProps) {
  return (
    <article
      className={`flex min-w-0 items-center rounded-md border border-border bg-background text-foreground ${compact ? "gap-1.5 px-1.5 py-1" : "gap-3 px-3 py-2.5"}`}
    >
      <Input
        aria-label={`Complete ${title}`}
        checked={completed}
        className={`shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed ${compact ? "size-4" : "size-6"}`}
        disabled={readOnly || busy}
        onChange={onToggle}
        type="checkbox"
        unstyled
      />
      <a
        className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        draggable={false}
        href={href}
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
          onOpen();
        }}
      >
        <span className="grid min-w-0 [overflow-wrap:anywhere]">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {time ?? "No time"}
            {skipped ? " · Skipped" : ""}
          </span>
          <strong
            className={`font-medium ${compact ? "text-xs" : "text-sm"} ${completed ? "text-muted-foreground line-through" : ""}`}
          >
            {title}
          </strong>
          {!compact && detail && (
            <span className="text-xs text-muted-foreground capitalize">{detail}</span>
          )}
        </span>
        {!compact && (
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        )}
      </a>
    </article>
  );
}
