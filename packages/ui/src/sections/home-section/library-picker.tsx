"use client";

import { useState } from "react";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { libraryPickerStyles } from "./styles";
import type { LibraryPickerOptions } from "./types";

export function LibraryPicker({ items }: LibraryPickerOptions) {
  const [selected, setSelected] = useState(items[0]?.id);
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
            aria-controls={`home-section-${item.id}`}
            aria-label={item.title}
            aria-pressed={selected === item.id}
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
      {items.map((item) => (
        <section
          aria-label={`${item.title} section example`}
          className={libraryPickerStyles.element5}
          hidden={selected !== item.id}
          id={`home-section-${item.id}`}
          key={item.id}
        >
          <div className={libraryPickerStyles.element6}>
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>LIVE SECTION PREVIEW</span>
          </div>
          <div className={libraryPickerStyles.element7}>{item.content}</div>
        </section>
      ))}
      <p className={libraryPickerStyles.element8}>
        Fictional content. These are the same section renderers used in portfolios.
      </p>
    </Card>
  );
}
