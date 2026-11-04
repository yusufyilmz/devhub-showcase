"use client";

import { type PointerEvent, useEffect, useId, useRef, useState } from "react";

import { Button } from "../buttons";
import { sortableListStyles } from "./styles";
import type { Drag, Item, SortableListOptions } from "./types";

export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  if (from < 0 || to < 0 || from >= next.length || to >= next.length) return next;
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

export function SortableList({ items, onChange, label }: SortableListOptions) {
  const root = useRef<HTMLOListElement>(null);
  const active = useRef<Drag | null>(null);
  const [preview, setPreview] = useState<Item[] | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const helpId = useId();
  const visible = preview ?? items;
  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      const current = active.current;
      if (event.key !== "Escape" || !current) return;
      active.current = null;
      setPreview(null);
      setAnnouncement("Reorder cancelled.");
      if (root.current?.hasPointerCapture(current.pointerId))
        root.current.releasePointerCapture(current.pointerId);
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, []);
  function commit(next: Item[], id: string) {
    const focusLabel = document.activeElement?.getAttribute("aria-label");
    onChange(next.map((item) => item.id));
    requestAnimationFrame(() => {
      // Restore lost focus only; never steal focus from the next keyboard action.
      if (document.activeElement && document.activeElement !== document.body) return;
      const row = Array.from(root.current?.children ?? []).find(
        (element) => (element as HTMLElement).dataset.sortableId === id,
      );
      const button =
        Array.from(row?.querySelectorAll<HTMLButtonElement>("button") ?? []).find(
          (node) => node.getAttribute("aria-label") === focusLabel && !node.disabled,
        ) ?? row?.querySelector<HTMLButtonElement>(".sortable-handle");
      button?.focus({ preventScroll: true });
    });
    const index = next.findIndex((item) => item.id === id);
    setAnnouncement(`${next[index]?.label} moved to position ${index + 1} of ${next.length}.`);
  }
  function move(id: string, target: number) {
    const index = items.findIndex((item) => item.id === id);
    if (target === index || target < 0 || target >= items.length) return;
    commit(moveItem(items, index, target), id);
  }
  function start(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (!event.isPrimary || event.button !== 0) return;
    event.currentTarget.focus();
    active.current = { id, items: [...items], pointerId: event.pointerId };
    setPreview(items);
    root.current?.setPointerCapture(event.pointerId);
    setAnnouncement("Dragging section. Release to place, or press Escape to cancel.");
  }
  function drag(event: PointerEvent<HTMLOListElement>) {
    const current = active.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const rows = Array.from(event.currentTarget.children);
    const target = rows.reduce((best, row, index) => {
      const center = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return rect.top + rect.height / 2;
      };
      return Math.abs(center(row) - event.clientY) <
        Math.abs(center(rows[best] ?? row) - event.clientY)
        ? index
        : best;
    }, 0);
    const from = current.items.findIndex((item) => item.id === current.id);
    current.items = moveItem(current.items, from, target);
    setPreview(current.items);
    if (event.clientY < 80) window.scrollBy(0, -15);
    if (event.clientY > window.innerHeight - 80) window.scrollBy(0, 15);
  }
  function finish(cancel = false) {
    const current = active.current;
    if (!current) return;
    active.current = null;
    setPreview(null);
    if (cancel) setAnnouncement("Reorder cancelled.");
    else if (current.items.some((item, index) => item.id !== items[index]?.id))
      commit(current.items, current.id);
    if (root.current?.hasPointerCapture(current.pointerId))
      root.current.releasePointerCapture(current.pointerId);
  }
  return (
    <div className={sortableListStyles.element1}>
      <p id={helpId}>
        Drag a handle to reorder. You can also use the move buttons, or focus a handle and use the
        arrow keys. Press Escape to cancel a drag.
      </p>
      <ol
        aria-label={label}
        className={sortableListStyles.element2}
        onLostPointerCapture={() => finish(true)}
        onPointerCancel={() => finish(true)}
        onPointerMove={drag}
        onPointerUp={() => finish()}
        ref={root}
      >
        {visible.map((item, index) => (
          <li
            data-dragging={active.current?.id === item.id || undefined}
            data-sortable-id={item.id}
            key={item.id}
          >
            <Button
              aria-describedby={helpId}
              aria-label={`Reorder ${item.label}`}
              className={sortableListStyles.element3}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  finish(true);
                  return;
                }
                if (active.current) return;
                const targets: Record<string, number> = {
                  ArrowDown: index + 1,
                  ArrowUp: index - 1,
                  End: items.length - 1,
                  Home: 0,
                };
                const target = targets[event.key];
                if (target === undefined) return;
                event.preventDefault();
                move(item.id, target);
              }}
              onPointerDown={(event) => start(event, item.id)}
              type="button"
            >
              <span aria-hidden="true">⠿</span>
            </Button>
            <span aria-hidden="true" className={sortableListStyles.element4}>
              {index + 1}
            </span>
            <span className={sortableListStyles.element5}>{item.label}</span>
            <Button
              aria-label={`Move ${item.label} up`}
              className={sortableListStyles.element6}
              disabled={index === 0}
              onClick={() => move(item.id, index - 1)}
              type="button"
            >
              ↑
            </Button>
            <Button
              aria-label={`Move ${item.label} down`}
              className={sortableListStyles.element7}
              disabled={index === items.length - 1}
              onClick={() => move(item.id, index + 1)}
              type="button"
            >
              ↓
            </Button>
          </li>
        ))}
      </ol>
      <p aria-live="polite" className={sortableListStyles.element8} role="status">
        {announcement}
      </p>
    </div>
  );
}
