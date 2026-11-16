"use client";

import { type ReactNode, useId, useState } from "react";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { libraryPickerStyles } from "./library-picker-styles";

export type LibraryPickerOptions = {
  items: { id: string; title: string; description: string; content: ReactNode }[];
};

export function LibraryPicker({ items }: LibraryPickerOptions) {
  const [selected, setSelected] = useState(items[0]?.id);
  const panelId = useId();
  const active = items.find((item) => item.id === selected) ?? items[0];
  return (
    <Card
      className={libraryPickerStyles.element1}
      interaction="static"
      layout="plain"
      surface="portfolio"
    >
      <fieldset className={libraryPickerStyles.element2}>
        <legend className={libraryPickerStyles.element3}>Section examples</legend>
        {items.map((item, index) => (
          <Button
            aria-controls={panelId}
            aria-label={item.title}
            aria-pressed={active?.id === item.id}
            key={item.id}
            onClick={() => setSelected(item.id)}
            type="button"
            variant="ghost"
          >
            <span className={libraryPickerStyles.element4}>0{index + 1}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Button>
        ))}
      </fieldset>
      {active && (
        <section
          aria-label={`${active.title} section example`}
          className={libraryPickerStyles.element5}
          id={panelId}
        >
          <div className={libraryPickerStyles.element6}>
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>LIVE SECTION PREVIEW</span>
          </div>
          <div className={libraryPickerStyles.element7}>{active.content}</div>
        </section>
      )}
      <p className={libraryPickerStyles.element8}>
        Fictional content. These are the same section renderers used in portfolios.
      </p>
    </Card>
  );
}
