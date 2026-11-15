"use client";

import "./section-views.css";

import { useId, useRef, useState } from "react";

import { Button } from "../../buttons/button";
import { Section } from "./Section";
import { SectionItemCard } from "./SectionItemCard";
import { sectionElementsStyles } from "./styles";
import type { SectionTabsOptions } from "./types";

export function SectionTabs({
  items,
  label,
  surface = "semantic",
  type,
  sectionId,
}: SectionTabsOptions) {
  const [selected, setSelected] = useState("");
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const index = Math.max(
    0,
    items.findIndex((item) => item.id === selected),
  );

  function select(next: number) {
    const item = items[next];
    if (!item) return;

    setSelected(item.id);
    buttons.current[next]?.focus();
  }

  if (!items.length) return null;

  return (
    <Section asChild>
      <section aria-label={label} className={sectionElementsStyles.element2} id={sectionId}>
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
                if (next === undefined) return;

                event.preventDefault();
                select(next);
              }}
              ref={(node) => {
                buttons.current[n] = node;
              }}
              role="tab"
              tabIndex={n === index ? 0 : -1}
              type="button"
              variant="ghost"
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
            tabIndex={n === index ? 0 : -1}
          >
            <SectionItemCard item={item} surface={surface} type={type} />
          </div>
        ))}
      </section>
    </Section>
  );
}
