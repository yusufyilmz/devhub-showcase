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
    description?: string;
    content: ReactNode;
    thumbnail?: ReactNode;
  }[];
  initialSelection?: string;
  mode?: "examples" | "editor";
};

export function LibraryPicker({
  items,
  initialSelection,
  mode = "examples",
}: LibraryPickerOptions) {
  const editor = mode === "editor";
  const [selected, setSelected] = useState(initialSelection ?? items[0]?.id);
  const [query, setQuery] = useState("");
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const active = items.find((item) => item.id === selected) ?? items[0];
  const search = query.trim().toLocaleLowerCase();
  const visibleItems = items.filter(({ title, description }) =>
    `${title} ${description ?? ""}`.toLocaleLowerCase().includes(search),
  );
  const buttons = visibleItems.map((item) => (
    <Button
      aria-controls={panelId}
      aria-label={item.title}
      aria-pressed={active?.id === item.id}
      className={
        editor
          ? "h-auto min-w-0 justify-start gap-2 rounded-lg px-2 py-1.5 text-start whitespace-normal aria-pressed:border-primary/25 aria-pressed:bg-primary/10"
          : undefined
      }
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
        <div
          aria-hidden="true"
          className={
            editor
              ? "h-10 w-16 shrink-0 overflow-hidden rounded-sm bg-muted [&_.section-catalog-preview]:h-[100px] [&_.section-catalog-preview]:w-[160px] [&_.section-catalog-preview]:origin-top-left [&_.section-catalog-preview]:scale-[0.4]"
              : "home-library-thumbnail"
          }
        >
          {item.thumbnail}
        </div>
      )}
      <span>
        <strong>{item.title}</strong>
        {item.description && <small>{item.description}</small>}
      </span>
    </Button>
  ));
  return (
    <Card
      className={
        editor
          ? "grid min-w-0 items-start gap-4 p-3 md:grid-cols-[minmax(10rem,13rem)_minmax(0,1fr)] md:gap-5 md:p-4"
          : libraryPickerStyles.element1
      }
      interaction="static"
      layout="plain"
      surface="portfolio"
    >
      <div className="min-w-0 self-start">
        {!editor && (
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
        <fieldset className={editor ? "grid min-w-0 border-0 p-0" : libraryPickerStyles.element2}>
          <legend
            className={editor ? "mb-2 px-2 text-sm font-semibold" : libraryPickerStyles.element3}
          >
            {editor ? "Preview sections" : "Section examples"}
          </legend>
          <div className={editor ? "grid min-w-0 gap-1 p-1" : "home-library-scroll"}>
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
          aria-label={`${active.title} section ${editor ? "settings" : "example"}`}
          className={editor ? "min-w-0" : libraryPickerStyles.element5}
          id={panelId}
          ref={panelRef}
        >
          {!editor && (
            <div className={libraryPickerStyles.element6}>
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>LIVE SECTION PREVIEW</span>
            </div>
          )}
          <div className={editor ? "min-w-0" : libraryPickerStyles.element7}>{active.content}</div>
        </section>
      )}
      {!editor && (
        <p className={libraryPickerStyles.element8}>
          Fictional content. These are the same section renderers used in portfolios.
        </p>
      )}
    </Card>
  );
}
