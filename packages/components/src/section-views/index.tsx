"use client";
import { type ReactNode, useId, useRef, useState } from "react";
export type SectionItem = { id: string; title: string; content: ReactNode };
export function SectionGrid({
  items,
  label,
  variant = "cards",
}: {
  items: SectionItem[];
  label: string;
  variant?: "cards" | "gallery";
}) {
  return (
    <ul aria-label={label} className={`section-view-grid section-view-${variant}`}>
      {items.map((item) => (
        <li key={item.id}>
          <h3>{item.title}</h3>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
export function SectionAccordion({ items, label }: { items: SectionItem[]; label: string }) {
  return (
    <section aria-label={label} className="section-view-accordion">
      {items.map((item) => (
        <details key={item.id}>
          <summary>{item.title}</summary>
          <div>{item.content}</div>
        </details>
      ))}
    </section>
  );
}
export function SectionTabs({ items, label }: { items: SectionItem[]; label: string }) {
  const [selected, setSelected] = useState("");
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(
    0,
    items.findIndex((item) => item.id === selected),
  );
  if (!items.length) return null;
  function select(next: number) {
    const item = items[next];
    if (item) {
      setSelected(item.id);
      buttons.current[next]?.focus();
    }
  }
  return (
    <section aria-label={label} className="section-view-tabs">
      <div aria-label={label} role="tablist">
        {items.map((item, n) => (
          <button
            aria-controls={`${id}-panel-${n}`}
            aria-selected={n === index}
            id={`${id}-tab-${n}`}
            key={item.id}
            onClick={() => setSelected(item.id)}
            onKeyDown={(event) => {
              const keys: Record<string, number> = {
                ArrowLeft: (index + items.length - 1) % items.length,
                ArrowRight: (index + 1) % items.length,
                End: items.length - 1,
                Home: 0,
              };
              const next = keys[event.key];
              if (next !== undefined) {
                event.preventDefault();
                select(next);
              }
            }}
            ref={(node) => {
              buttons.current[n] = node;
            }}
            role="tab"
            tabIndex={n === index ? 0 : -1}
            type="button"
          >
            {item.title}
          </button>
        ))}
      </div>
      {items.map((item, n) => (
        <div
          aria-labelledby={`${id}-tab-${n}`}
          hidden={n !== index}
          id={`${id}-panel-${n}`}
          key={item.id}
          role="tabpanel"
        >
          {item.content}
        </div>
      ))}
    </section>
  );
}
export function SectionCarousel({
  items,
  label,
  previousLabel = "Previous items",
  nextLabel = "Next items",
}: {
  items: SectionItem[];
  label: string;
  previousLabel?: string;
  nextLabel?: string;
}) {
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  function move(direction: number) {
    const node = list.current;
    if (node)
      node.scrollBy({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        left: direction * node.clientWidth * 0.85,
      });
  }
  if (!items.length) return null;
  return (
    <section aria-label={label} className="section-view-carousel">
      <div className="section-view-controls">
        <button
          aria-controls={id}
          aria-label={previousLabel}
          onClick={() => move(-1)}
          type="button"
        >
          ←
        </button>
        <button aria-controls={id} aria-label={nextLabel} onClick={() => move(1)} type="button">
          →
        </button>
      </div>
      <ul id={id} ref={list}>
        {items.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.content}
          </li>
        ))}
      </ul>
    </section>
  );
}
