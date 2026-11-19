"use client";

import {
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { dateLabel, monday, shiftDate } from "@shared/utils/date";

import type { CalendarItem } from "../schemas/calendar";

export interface CalendarGridProps {
  canMove?: (item: CalendarItem) => boolean;
  date: string;
  dayHref?: (date: string) => string;
  getItems: (date: string) => readonly CalendarItem[];
  onAddDay?: (date: string) => void;
  onDateChange: (date: string) => void;
  onMove?: (id: string, from: string, to: string, time: string | undefined) => void;
  onOpenDay?: (date: string) => void;
  renderItem?: (item: CalendarItem) => ReactNode;
  today: string;
}

const dragType = "application/x-calendar-item";
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`);
const weekColumns = "grid grid-cols-[3.75rem_repeat(7,minmax(7rem,1fr))]";

function openDayLink(
  event: MouseEvent<HTMLAnchorElement>,
  onOpenDay: CalendarGridProps["onOpenDay"],
  day: string,
) {
  if (
    !onOpenDay ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  onOpenDay(day);
}

function ItemSummary({ item }: { item: CalendarItem }) {
  return (
    <div
      className={`min-w-0 rounded-md border border-l-2 border-border bg-background px-2 py-1.5 ${item.type === "task" ? "border-l-muted-foreground/60" : "border-l-primary"}`}
      title={item.title}
    >
      {item.time && (
        <time className="block text-[11px] tabular-nums text-muted-foreground" dateTime={item.time}>
          {item.time}
        </time>
      )}
      <span
        className={`block truncate text-xs font-medium ${item.completed ? "text-muted-foreground line-through" : ""}`}
      >
        {item.title}
      </span>
    </div>
  );
}

export function CalendarGrid({
  date,
  today,
  onDateChange,
  getItems,
  onOpenDay,
  onAddDay,
  dayHref,
  renderItem,
  onMove,
  canMove,
}: CalendarGridProps) {
  const headingId = useId();
  const [mode, setMode] = useState<"month" | "week">("month");
  const [preview, setPreview] = useState<{ baseDate: string; day: string }>();
  const [hover, setHover] = useState<string>();
  const dragged = useRef<CalendarItem | null>(null);
  const first = `${date.slice(0, 7)}-01`;
  const start = monday(mode === "week" ? date : first);
  const days = useMemo(
    () => Array.from({ length: mode === "week" ? 7 : 42 }, (_, i) => shiftDate(start, i)),
    [start, mode],
  );
  const itemsByDay = useMemo(
    () => new Map(days.map((day) => [day, getItems(day)])),
    [days, getItems],
  );

  function clearDrag() {
    dragged.current = null;
    setHover(undefined);
  }

  // Month cells preserve time, while the untimed Week row explicitly clears it.
  function dropZone(day: string, time?: string | null) {
    const key = `${day}:${time}`;
    return {
      "data-drop-active": hover === key || undefined,
      onDragLeave(event: DragEvent) {
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        )
          return;
        setHover((active) => (active === key ? undefined : active));
      },
      onDragOver(event: DragEvent) {
        if (!onMove || !dragged.current || !event.dataTransfer.types.includes(dragType)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setHover(key);
      },
      onDrop(event: DragEvent) {
        const previous = dragged.current;
        if (!previous || !onMove || !event.dataTransfer.types.includes(dragType)) return;
        event.preventDefault();
        clearDrag();
        const item = itemsByDay
          .get(previous.date)
          ?.find(
            (current) =>
              current.id === previous.id &&
              current.source === previous.source &&
              current.type === previous.type,
          );
        if (item && (canMove?.(item) ?? true)) {
          onMove(item.id, item.date, day, time === undefined ? item.time : (time ?? undefined));
        }
      },
    };
  }

  function renderEntry(item: CalendarItem) {
    const movable = !!onMove && (canMove?.(item) ?? true);
    return (
      <div
        className="min-w-0 data-[movable=true]:cursor-grab data-[movable=true]:active:cursor-grabbing"
        data-movable={movable || undefined}
        draggable={movable}
        key={`${item.source}:${item.type}:${item.id}`}
        onDragEnd={movable ? clearDrag : undefined}
        onDragStart={
          movable
            ? (event) => {
                event.dataTransfer.setData(dragType, item.id);
                event.dataTransfer.effectAllowed = "move";
                dragged.current = item;
              }
            : undefined
        }
      >
        {renderItem ? renderItem(item) : <ItemSummary item={item} />}
      </div>
    );
  }

  function renderDay(day: string, description?: string) {
    const label = dateLabel(day);
    const href = dayHref?.(day);
    const action = onOpenDay || href ? "Open" : "Select";
    const dayProps = {
      "aria-current": day === today ? ("date" as const) : undefined,
      "aria-description": description,
      "aria-label": `${action} ${label}`,
      className:
        "max-w-full px-2 text-xs aria-[current=date]:font-bold aria-[current=date]:underline aria-[current=date]:underline-offset-3",
      size: "sm" as const,
      variant: day === date ? ("default" as const) : ("ghost" as const),
    };
    const content = mode === "week" ? label : Number(day.slice(-2));
    if (href) {
      return (
        <Button {...dayProps} asChild>
          <a draggable={false} href={href} onClick={(event) => openDayLink(event, onOpenDay, day)}>
            {content}
          </a>
        </Button>
      );
    }
    return (
      <Button
        {...dayProps}
        aria-pressed={onOpenDay ? undefined : day === date}
        onClick={() => (onOpenDay ?? onDateChange)(day)}
        type="button"
      >
        {content}
      </Button>
    );
  }

  function renderMonthDay(day: string, description?: string) {
    return (
      <>
        <div
          className={onAddDay ? "[&_button]:after:absolute [&_button]:after:inset-0" : undefined}
        >
          {renderDay(day, description)}
        </div>
        {onAddDay && (
          <Button
            aria-label={`Add task for ${dateLabel(day)}`}
            className="absolute end-1.5 top-1.5 z-10 hidden @min-[44rem]/calendar:inline-flex"
            onClick={() => onAddDay(day)}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <span aria-hidden="true">+</span>
          </Button>
        )}
      </>
    );
  }

  function page(direction: number) {
    if (mode === "week") {
      onDateChange(shiftDate(date, 7 * direction));
      return;
    }
    const month = new Date(`${first}T12:00Z`);
    month.setUTCMonth(month.getUTCMonth() + direction);
    onDateChange(month.toISOString().slice(0, 10));
  }

  const previewDay = preview?.baseDate === date ? preview.day : date;
  const previewItems = itemsByDay.get(previewDay);

  return (
    <Card
      asChild
      className="@container/calendar grid min-w-0 gap-4 p-2.5 sm:p-5"
      interaction="static"
      layout="plain"
    >
      <section aria-labelledby={headingId}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            aria-live="polite"
            className="text-lg font-semibold tracking-tight sm:text-xl"
            id={headingId}
          >
            {mode === "month"
              ? new Date(`${first}T12:00Z`).toLocaleDateString("en-GB", {
                  month: "long",
                  timeZone: "UTC",
                  year: "numeric",
                })
              : `${dateLabel(start)} – ${dateLabel(shiftDate(start, 6))}`}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <fieldset
              aria-label="Calendar view"
              className="flex min-w-0 gap-0.5 rounded-lg bg-muted p-0.5"
            >
              <Button
                aria-pressed={mode === "month"}
                onClick={() => setMode("month")}
                size="sm"
                type="button"
                variant={mode === "month" ? "outline" : "ghost"}
              >
                Month
              </Button>
              <Button
                aria-pressed={mode === "week"}
                onClick={() => setMode("week")}
                size="sm"
                type="button"
                variant={mode === "week" ? "outline" : "ghost"}
              >
                Week
              </Button>
            </fieldset>
            <Button onClick={() => onDateChange(today)} size="sm" type="button" variant="outline">
              Today
            </Button>
            <fieldset aria-label="Calendar navigation" className="flex min-w-0 gap-0.5">
              <Button
                aria-label={`Previous ${mode}`}
                onClick={() => page(-1)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                aria-label={`Next ${mode}`}
                onClick={() => page(1)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </fieldset>
          </div>
        </div>
        {onMove && (
          <p className="text-xs text-muted-foreground pointer-coarse:hidden">
            {mode === "month"
              ? "Drag an item to another day to reschedule it."
              : "Drag an item to an hour or to the No time row."}
          </p>
        )}
        <section
          aria-label={mode === "month" ? "Month calendar" : "Week calendar"}
          className="max-h-[72vh] overflow-auto rounded-lg border border-border focus-visible:outline-2 focus-visible:outline-ring"
        >
          {mode === "month" ? (
            <div className="grid grid-cols-7 bg-border">
              {weekdays.map((weekday) => (
                <span
                  className="sticky top-0 z-10 border-b border-border bg-muted py-2 text-center text-xs font-medium text-muted-foreground"
                  key={weekday}
                >
                  {weekday}
                </span>
              ))}
              {days.map((day) => {
                const items = itemsByDay.get(day);
                const count = items?.length ?? 0;
                const description = count
                  ? `${count} ${count === 1 ? "item" : "items"}`
                  : undefined;
                return (
                  <div
                    className="relative min-h-14 min-w-0 border-r border-b border-border bg-card p-0.5 text-center nth-[7n]:border-r-0 data-[outside=true]:bg-muted/65 data-[selected=true]:bg-primary/5 data-[drop-active=true]:inset-ring-2 data-[drop-active=true]:inset-ring-primary @min-[44rem]/calendar:min-h-24 @min-[44rem]/calendar:p-1.5 @min-[44rem]/calendar:text-left"
                    data-outside={day.slice(0, 7) !== date.slice(0, 7) || undefined}
                    data-selected={day === date || undefined}
                    key={day}
                    {...dropZone(day)}
                  >
                    {renderMonthDay(day, description)}
                    {count > 0 && (
                      <Button
                        aria-label={`Show ${description} for ${dateLabel(day)}`}
                        aria-pressed={day === previewDay}
                        className="relative mx-auto flex max-w-full px-1 text-[10px] tabular-nums @min-[44rem]/calendar:hidden"
                        onClick={() => setPreview({ baseDate: date, day })}
                        size="xs"
                        type="button"
                        variant={day === previewDay ? "outline" : "ghost"}
                      >
                        {count}
                      </Button>
                    )}
                    <div className="pointer-events-none relative mt-1 hidden gap-1 [&>*]:pointer-events-auto @min-[44rem]/calendar:grid">
                      {items?.map(renderEntry)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="min-w-[53rem] bg-card">
              <div className={`${weekColumns} sticky top-0 z-10 border-b border-border bg-muted`}>
                <span className="sticky left-0 z-10 bg-muted px-2 py-3 text-xs font-medium text-muted-foreground">
                  Time
                </span>
                {days.map((day) => (
                  <div
                    className="flex min-w-0 items-center justify-center border-l border-border py-1"
                    key={day}
                  >
                    {renderDay(day)}
                  </div>
                ))}
              </div>
              {[null, ...hours].map((hour) => (
                <div
                  className={`${weekColumns} border-b border-border last:border-b-0`}
                  key={hour ?? "untimed"}
                >
                  <span className="sticky left-0 z-[1] bg-card px-2 py-2.5 text-[11px] tabular-nums text-muted-foreground">
                    {hour ?? "No time"}
                  </span>
                  {days.map((day) => (
                    <div
                      className="grid min-h-10 min-w-0 content-start gap-1 border-l border-border p-1 data-[drop-active=true]:bg-primary/15"
                      key={day}
                      title={`${dateLabel(day)} ${hour ?? "No time"}`}
                      {...dropZone(day, hour)}
                    >
                      {itemsByDay
                        .get(day)
                        ?.filter((item) =>
                          hour === null ? !item.time : item.time?.startsWith(hour.slice(0, 3)),
                        )
                        .map(renderEntry)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
        {mode === "month" && !!previewItems?.length && (
          <section
            aria-label="Selected day items"
            className="grid min-w-0 gap-2 @min-[44rem]/calendar:hidden"
          >
            <h3 className="text-xs font-semibold text-muted-foreground">{dateLabel(previewDay)}</h3>
            <div className="grid gap-1.5">{previewItems.map(renderEntry)}</div>
          </section>
        )}
      </section>
    </Card>
  );
}
