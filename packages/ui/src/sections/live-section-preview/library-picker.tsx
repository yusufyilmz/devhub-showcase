"use client";

import { type ReactNode, useId, useRef, useState } from "react";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Input, Label } from "../../forms";
import { libraryPickerStyles } from "./library-picker-styles";

export type LibraryPickerOptions = {
  items: { id: string; title: string; description: string; content: ReactNode }[];
  featuredCount?: number;
};

export function LibraryPicker({ items, featuredCount = items.length }: LibraryPickerOptions) {
  const [selected, setSelected] = useState(items[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const active = items.find((item) => item.id === selected) ?? items[0];
  const featured = items.slice(0, featuredCount);
  const search = query.trim().toLocaleLowerCase();
  const visibleItems = expanded
    ? items.filter(({ title, description }) =>
        `${title} ${description}`.toLocaleLowerCase().includes(search),
      )
    : featured;
  const canExpand = featuredCount < items.length;
  const buttons = visibleItems.map((item) => (
    <Button
      aria-controls={panelId}
      aria-label={item.title}
      aria-pressed={active?.id === item.id}
      key={item.id}
      onClick={(event) => {
        setSelected(item.id);
        if (expanded && event.detail > 0 && window.matchMedia("(max-width: 767px)").matches) {
          panelRef.current?.scrollIntoView({ block: "nearest" });
        }
      }}
      type="button"
      variant="ghost"
    >
      <span className={libraryPickerStyles.element4}>
        {String(items.indexOf(item) + 1).padStart(2, "0")}
      </span>
      <span>
        <strong>{item.title}</strong>
        <small>{item.description}</small>
      </span>
      <span aria-hidden="true">↗</span>
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
        {expanded && (
          <div className="grid min-w-0 gap-xs px-sm pt-sm">
            <Label htmlFor={`${panelId}-filter`}>Filter live section examples</Label>
            <Input
              id={`${panelId}-filter`}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              value={query}
            />
          </div>
        )}
        <fieldset className={libraryPickerStyles.element2} id={`${panelId}-examples`}>
          <legend className={libraryPickerStyles.element3}>Section examples</legend>
          {expanded ? (
            <div className="col-span-full grid max-h-96 min-w-0 gap-xs overflow-y-auto p-xs min-[480px]:grid-cols-2 min-[768px]:grid-cols-1">
              {buttons.length ? (
                buttons
              ) : (
                <p className="p-s text-sm text-muted-foreground">No examples match your search.</p>
              )}
            </div>
          ) : (
            buttons
          )}
        </fieldset>
        {canExpand && (
          <div className="px-sm pb-sm">
            <Button
              aria-controls={`${panelId}-examples`}
              aria-expanded={expanded}
              className="h-auto min-h-10 w-full whitespace-normal"
              onClick={() => {
                setExpanded(!expanded);
                setQuery("");
              }}
              type="button"
              variant="outline"
            >
              {expanded ? "Show featured examples" : `Show all ${items.length} examples`}
            </Button>
          </div>
        )}
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
