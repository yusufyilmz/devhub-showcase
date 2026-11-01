"use client";

import { type ReactNode, useState } from "react";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";

export function LibraryPicker({
  items,
}: {
  items: { id: string; title: string; description: string; content: ReactNode }[];
}) {
  const [selected, setSelected] = useState(items[0]?.id);
  return (
    <Card className="home-library-demo" interaction="static" layout="plain" surface="portfolio">
      <fieldset className="home-library-buttons">
        <legend className="sr-only">Section examples</legend>
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
            <span className="home-library-number">0{index + 1}</span>
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
          className="home-library-preview"
          hidden={selected !== item.id}
          id={`home-section-${item.id}`}
          key={item.id}
        >
          <div className="home-library-preview-bar">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>LIVE SECTION PREVIEW</span>
          </div>
          <div className="home-library-preview-content">{item.content}</div>
        </section>
      ))}
      <p className="home-sample-note">
        Fictional content. These are the same section renderers used in portfolios.
      </p>
    </Card>
  );
}
