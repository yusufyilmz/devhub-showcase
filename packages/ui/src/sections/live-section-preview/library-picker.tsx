"use client";

import { type ReactNode, useId, useRef, useState } from "react";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Input, Label } from "../../forms";
import { libraryPickerStyles } from "./library-picker-styles";

export type LibraryPickerOptions = {
  items: {
    id: string;
    title: string;
    description: string;
    content: ReactNode;
    thumbnail?: ReactNode;
  }[];
};

export function LibraryPicker({ items }: LibraryPickerOptions) {
  const [selected, setSelected] = useState(items[0]?.id);
  const [query, setQuery] = useState("");
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const active = items.find((item) => item.id === selected) ?? items[0];
  const search = query.trim().toLocaleLowerCase();
  const visibleItems = items.filter(({ title, description }) =>
    `${title} ${description}`.toLocaleLowerCase().includes(search),
  );
  const buttons = visibleItems.map((item) => (
    <Button
      aria-controls={panelId}
      aria-label={item.title}
      aria-pressed={active?.id === item.id}
      key={item.id}
      onClick={(event) => {
        setSelected(item.id);
        if (event.detail > 0 && window.matchMedia("(max-width: 700px)").matches) {
          panelRef.current?.scrollIntoView({ block: "nearest" });
        }
      }}
      type="button"
      variant="ghost"
    >
      {item.thumbnail && (
        <div aria-hidden="true" className="home-library-thumbnail">
          {item.thumbnail}
        </div>
      )}
      <span>
        <strong>{item.title}</strong>
        <small>{item.description}</small>
      </span>
    </Button>
  ));
  return (
    <Card
      className={libraryPickerStyles.element1}
      interaction="static"
      layout="plain"
      surface="portfolio"
    >
      <div className="min-w-0 self-start">
        <div className="grid min-w-0 gap-xs px-sm pt-sm">
          <Label htmlFor={`${panelId}-filter`}>Filter live section examples</Label>
          <Input
            id={`${panelId}-filter`}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            value={query}
          />
        </div>
        <fieldset className={libraryPickerStyles.element2}>
          <legend className={libraryPickerStyles.element3}>Section examples</legend>
          <div className="home-library-scroll">
            {buttons.length ? (
              buttons
            ) : (
              <p className="p-s text-sm text-muted-foreground">No examples match your search.</p>
            )}
          </div>
        </fieldset>
      </div>
      {active && (
        <section
          aria-label={`${active.title} section example`}
          className={libraryPickerStyles.element5}
          id={panelId}
          ref={panelRef}
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
