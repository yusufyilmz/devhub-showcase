"use client";

import { useId, useRef, useState } from "react";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { sectionElementsStyles, sectionGridClassName } from "./styles";
import type {
  SectionAccordionOptions,
  SectionCarouselOptions,
  SectionGridOptions,
  SectionTabsOptions,
} from "./types";

export function SectionGrid({
  items,
  label,
  variant = "cards",
  surface = "semantic",
}: SectionGridOptions) {
  return (
    <ul aria-label={label} className={sectionGridClassName(variant)}>
      {items.map((item) => (
        <Card asChild key={item.id} layout="plain" surface={surface}>
          <li>
            <h3>{item.title}</h3>
            {item.content}
          </li>
        </Card>
      ))}
    </ul>
  );
}
export function SectionAccordion({ items, label, surface = "semantic" }: SectionAccordionOptions) {
  return (
    <section aria-label={label} className={sectionElementsStyles.element1}>
      {items.map((item) => (
        <Card asChild interaction="static" key={item.id} layout="plain" surface={surface}>
          <details>
            <summary>{item.title}</summary>
            <div>{item.content}</div>
          </details>
        </Card>
      ))}
    </section>
  );
}
export function SectionTabs({ items, label }: SectionTabsOptions) {
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
    <section aria-label={label} className={sectionElementsStyles.element2}>
      <div aria-label={label} role="tablist">
        {items.map((item, n) => (
          <Button
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
          </Button>
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
  surface = "semantic",
}: SectionCarouselOptions) {
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
    <section aria-label={label} className={sectionElementsStyles.element3}>
      <div className={sectionElementsStyles.element4}>
        <Button
          aria-controls={id}
          aria-label={previousLabel}
          onClick={() => move(-1)}
          type="button"
        >
          ←
        </Button>
        <Button aria-controls={id} aria-label={nextLabel} onClick={() => move(1)} type="button">
          →
        </Button>
      </div>
      <ul id={id} ref={list}>
        {items.map((item) => (
          <Card asChild key={item.id} layout="plain" surface={surface}>
            <li>
              <h3>{item.title}</h3>
              {item.content}
            </li>
          </Card>
        ))}
      </ul>
    </section>
  );
}

export type { SectionItem } from "./types";
