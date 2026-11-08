"use client";

import "./sortable-list.css";

import { type PointerEvent, useEffect, useId, useRef, useState } from "react";

import { Button } from "@shared/ui/button";

import { sortableListStyles } from "../styles";
import type { Drag, Item, SortableListOptions } from "../types";

export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  if (from < 0 || to < 0 || from >= next.length || to >= next.length) return next;
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

function closestRow(rows: Element[], y: number) {
  const distance = (row: Element) => {
    const rect = row.getBoundingClientRect();
    return Math.abs(rect.top + rect.height / 2 - y);
  };
  return rows.reduce(
    (best, row, index) => (distance(row) < distance(rows[best] ?? row) ? index : best),
    0,
  );
}

function insertionIndex(rows: Element[], y: number) {
  const index = rows.findIndex((row) => {
    const rect = row.getBoundingClientRect();
    return y < rect.top + rect.height / 2;
  });
  return index === -1 ? rows.length : index;
}

export function SortableList({
  disabled,
  items,
  onChange,
  label,
  renderContent,
}: SortableListOptions) {
  const root = useRef<HTMLOListElement>(null);
  const active = useRef<Drag | null>(null);
  const [preview, setPreview] = useState<Item[] | null>(null);
  const [dropIndex, setDropIndex] = useState<number>();
  const view = useRef<Window | null>(null);
  const scrollFrame = useRef<number | undefined>(undefined);
  const [announcement, setAnnouncement] = useState("");
  const helpId = useId();
  const visible = preview ?? items;

  function stopScrolling() {
    if (scrollFrame.current === undefined) return;
    view.current?.cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = undefined;
  }
  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      const current = active.current;
      if (event.key !== "Escape" || !current) return;
      active.current = null;
      setPreview(null);
      setDropIndex(undefined);
      setAnnouncement("Reorder cancelled.");
      if (root.current?.hasPointerCapture(current.pointerId))
        root.current.releasePointerCapture(current.pointerId);
    };
    const owner = root.current?.ownerDocument;
    owner?.addEventListener("keydown", cancel);
    return () => {
      owner?.removeEventListener("keydown", cancel);
      if (scrollFrame.current !== undefined)
        owner?.defaultView?.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);
  function commit(next: Item[], id: string) {
    const owner = root.current?.ownerDocument;
    const focusLabel = owner?.activeElement?.getAttribute("aria-label");
    onChange(next.map((item) => item.id));
    requestAnimationFrame(() => {
      // Restore lost focus only; never steal focus from the next keyboard action.
      if (owner?.activeElement && owner.activeElement !== owner.body) return;
      const row = Array.from(root.current?.children ?? []).find(
        (element) => (element as HTMLElement).dataset.sortableId === id,
      );
      const button =
        Array.from(row?.querySelectorAll<HTMLButtonElement>("button") ?? []).find(
          (node) => node.getAttribute("aria-label") === focusLabel && !node.disabled,
        ) ?? row?.querySelector<HTMLButtonElement>(".sortable-handle");
      button?.focus({ preventScroll: !renderContent });
    });
    const index = next.findIndex((item) => item.id === id);
    setAnnouncement(`${next[index]?.label} moved to position ${index + 1} of ${next.length}.`);
  }
  function move(id: string, target: number) {
    const index = items.findIndex((item) => item.id === id);
    if (disabled || target === index || target < 0 || target >= items.length) return;
    commit(moveItem(items, index, target), id);
  }
  function start(event: PointerEvent<HTMLLIElement>, id: string) {
    if (disabled || !event.isPrimary || event.button !== 0 || items.length < 2) return;
    const target = event.target as Element;
    if (renderContent && !target.closest?.(".sortable-handle")) return;
    if (target.closest?.("button:not(.sortable-handle), a, input, select, textarea")) return;
    view.current = event.currentTarget.ownerDocument.defaultView;
    event.currentTarget.querySelector<HTMLButtonElement>(".sortable-handle")?.focus();
    active.current = { id, items: [...items], pointerId: event.pointerId };
    setPreview(items);
    root.current?.setPointerCapture(event.pointerId);
    setAnnouncement("Dragging section. Release to place, or press Escape to cancel.");
  }
  function updateContentDrop(current: Drag, rows: Element[], y: number) {
    const source = items.findIndex((item) => item.id === current.id);
    const index = insertionIndex(rows, y);
    current.items = moveItem(items, source, index > source ? index - 1 : index);
    setDropIndex(index === source || index === source + 1 ? undefined : index);
  }

  function scrollNearEdge(viewport: Window, y: number, rows: Element[], current: Drag) {
    stopScrolling();
    const step = y < 70 ? -15 : y > viewport.innerHeight - 70 ? 15 : 0;
    if (!step) return;
    if (!renderContent) {
      viewport.scrollBy(0, step);
      return;
    }
    const tick = () => {
      scrollFrame.current = undefined;
      if (active.current !== current) return;
      const previous = viewport.scrollY;
      viewport.scrollBy(0, step);
      if (viewport.scrollY === previous) return;
      updateContentDrop(current, rows, y);
      scrollFrame.current = viewport.requestAnimationFrame(tick);
    };
    scrollFrame.current = viewport.requestAnimationFrame(tick);
  }

  function drag(event: PointerEvent<HTMLOListElement>) {
    const current = active.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const rows = Array.from(event.currentTarget.children);
    if (renderContent) {
      updateContentDrop(current, rows, event.clientY);
    } else {
      const from = current.items.findIndex((item) => item.id === current.id);
      current.items = moveItem(current.items, from, closestRow(rows, event.clientY));
      setPreview(current.items);
    }
    const viewport = view.current;
    if (viewport) scrollNearEdge(viewport, event.clientY, rows, current);
  }

  function finish(cancel = false) {
    const current = active.current;
    if (!current) return;
    stopScrolling();
    active.current = null;
    setPreview(null);
    setDropIndex(undefined);
    if (cancel || disabled) setAnnouncement("Reorder cancelled.");
    else if (current.items.some((item, index) => item.id !== items[index]?.id))
      commit(current.items, current.id);
    if (root.current?.hasPointerCapture(current.pointerId))
      root.current.releasePointerCapture(current.pointerId);
  }
  return (
    <div className={sortableListStyles.element1}>
      <p id={helpId}>
        {items.length < 2
          ? items.length === 0
            ? "No items to reorder yet."
            : "Add another item to reorder the list."
          : renderContent
            ? "Drag a section by its handle, or use the move buttons and arrow keys. Press Escape to cancel a drag."
            : "Drag anywhere on a row to reorder. You can also use the move buttons or focus a handle and use the arrow keys. Press Escape to cancel a drag."}
      </p>
      <ol
        aria-label={label}
        className={sortableListStyles.element2}
        data-content={Boolean(renderContent) || undefined}
        onLostPointerCapture={() => finish(true)}
        onPointerCancel={() => finish(true)}
        onPointerMove={drag}
        onPointerUp={(event) => {
          if (active.current?.pointerId === event.pointerId) finish();
        }}
        ref={root}
      >
        {visible.map((item, index) => {
          const controls = (
            <>
              <Button
                aria-describedby={helpId}
                aria-label={`Reorder ${item.label}`}
                className={sortableListStyles.element3}
                disabled={disabled}
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
                disabled={disabled || index === 0}
                onClick={() => move(item.id, index - 1)}
                type="button"
              >
                ↑
              </Button>
              <Button
                aria-label={`Move ${item.label} down`}
                className={sortableListStyles.element7}
                disabled={disabled || index === items.length - 1}
                onClick={() => move(item.id, index + 1)}
                type="button"
              >
                ↓
              </Button>
            </>
          );
          return (
            <li
              data-draggable={(!disabled && items.length > 1) || undefined}
              data-dragging={active.current?.id === item.id || undefined}
              data-drop={
                dropIndex === index
                  ? "before"
                  : dropIndex === items.length && index === items.length - 1
                    ? "after"
                    : undefined
              }
              data-sortable-id={item.id}
              key={item.id}
              onPointerDown={(event) => start(event, item.id)}
            >
              {renderContent ? (
                <>
                  <div className="sortable-item-tools">{controls}</div>
                  {renderContent(item.id)}
                </>
              ) : (
                controls
              )}
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className={sortableListStyles.element8} role="status">
        {announcement}
      </p>
    </div>
  );
}
