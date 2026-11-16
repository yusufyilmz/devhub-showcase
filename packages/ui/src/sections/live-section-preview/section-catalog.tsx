"use client";

import "./section-catalog.css";

import { useEffect, useId, useRef, useState } from "react";

import {
  type AuthorableSectionType,
  authorableSections,
  getSectionLayouts,
  type SectionOptions,
} from "@shared/config";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Badge } from "../../feedback/badge";
import { Input, Label } from "../../forms";
import { LiveSectionPreview, type LiveSectionPreviewProps } from "./live-section-preview";
import { type SectionExampleId, sectionExamples } from "./preview-examples";
import { SectionCatalogPreview } from "./section-catalog-preview";

const groups = ["All", "Story", "Work", "Media", "Connect"] as const;
type Group = (typeof groups)[number];

type CatalogAddAction = {
  disabled?: boolean;
  onAdd: (type: AuthorableSectionType, layout?: SectionOptions["layout"]) => void;
};

export function SectionCatalog({
  addAction,
  assetUrl,
}: Pick<LiveSectionPreviewProps, "assetUrl"> & { addAction?: CatalogAddAction } = {}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("All");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<SectionExampleId>();
  const preview = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const search = query.trim().toLocaleLowerCase();
  const matches = sectionExamples.filter(
    ({ category, description, name }) =>
      (group === "All" || category === group) &&
      `${name} ${description}`.toLocaleLowerCase().includes(search),
  );

  useEffect(() => {
    if (selected) preview.current?.focus();
  }, [selected]);

  return (
    <Card asChild interaction="static" layout="plain" surface="portfolio">
      <section
        aria-labelledby={`${id}-title`}
        className="home-library-catalog section-catalog min-w-0"
      >
        <div className="section-catalog-heading">
          <div>
            <h3 id={`${id}-title`}>Browse all {sectionExamples.length} section examples</h3>
            <p>Pick a card to see how the section looks in a portfolio.</p>
          </div>
          <Badge variant="secondary">{sectionExamples.length} examples</Badge>
        </div>
        <div className="section-catalog-search">
          <Label htmlFor={`${id}-search`}>Find a section</Label>
          <Input
            id={`${id}-search`}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(undefined);
            }}
            placeholder="Try gallery, skills or contact"
            type="search"
            value={query}
          />
        </div>
        <fieldset className="section-catalog-filters">
          <legend className="sr-only">Section categories</legend>
          {groups.map((item) => (
            <Button
              aria-pressed={group === item}
              key={item}
              onClick={() => {
                setGroup(item);
                setSelected(undefined);
              }}
              type="button"
              variant={group === item ? "secondary" : "ghost"}
            >
              {item}
            </Button>
          ))}
        </fieldset>
        <p aria-live="polite" className="section-catalog-count">
          {matches.length} of {sectionExamples.length} examples
        </p>
        {selected && (
          <div
            className="my-md grid min-w-0 scroll-mt-24 gap-s rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
            id={`${id}-preview`}
            ref={preview}
            tabIndex={-1}
          >
            <Button
              className="justify-self-end"
              onClick={() => {
                setSelected(undefined);
                trigger.current?.focus();
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              Close preview
            </Button>
            <CatalogExamplePreview
              addAction={addAction}
              assetUrl={assetUrl}
              exampleId={selected}
              key={selected}
            />
          </div>
        )}
        <ul
          aria-label="Available section types"
          className="section-catalog-grid"
          data-expanded={expanded || Boolean(search) || group !== "All"}
          id={`${id}-results`}
        >
          {matches.map(({ category, description, id: exampleId, name }) => (
            <Card asChild interaction="static" key={exampleId} layout="plain" surface="portfolio">
              <li>
                <SectionCatalogPreview type={exampleId} />
                <div className="section-catalog-card-copy">
                  <span className="section-catalog-card-category">{category}</span>
                  <h4>
                    <button
                      aria-controls={selected === exampleId ? `${id}-preview` : undefined}
                      aria-pressed={selected === exampleId}
                      className="section-catalog-card-button"
                      onClick={(event) => {
                        trigger.current = event.currentTarget;
                        setSelected(exampleId);
                        if (selected === exampleId) preview.current?.focus();
                      }}
                      type="button"
                    >
                      {name}
                    </button>
                  </h4>
                  <p>{description}</p>
                </div>
              </li>
            </Card>
          ))}
        </ul>
        {!search && group === "All" && (
          <Button
            aria-controls={`${id}-results`}
            aria-expanded={expanded}
            className="section-catalog-reveal"
            onClick={() => {
              setExpanded(!expanded);
              setSelected(undefined);
            }}
            type="button"
            variant="ghost"
          >
            {expanded ? "Show fewer sections" : "Show all section types"}{" "}
            <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
          </Button>
        )}
        {matches.length === 0 && (
          <div className="section-catalog-empty">
            <p>No sections match your search.</p>
            <Button
              onClick={() => {
                setQuery("");
                setGroup("All");
              }}
              type="button"
              variant="outline"
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>
    </Card>
  );
}

function CatalogExamplePreview({
  addAction,
  assetUrl,
  exampleId,
}: Pick<LiveSectionPreviewProps, "assetUrl" | "exampleId"> & { addAction?: CatalogAddAction }) {
  const [layout, setLayout] = useState<SectionOptions["layout"]>();
  const type = Object.hasOwn(authorableSections, exampleId)
    ? (exampleId as AuthorableSectionType)
    : undefined;
  const layouts = type ? getSectionLayouts(type) : [];
  return (
    <>
      {layouts.length > 0 && (
        <fieldset className="flex min-w-0 flex-wrap gap-xs">
          <legend className="mb-xs text-sm font-medium">Block layout</legend>
          <Button
            aria-pressed={!layout}
            onClick={() => setLayout(undefined)}
            size="sm"
            type="button"
            variant={!layout ? "secondary" : "ghost"}
          >
            Default
          </Button>
          {layouts.map(({ id, label }) => (
            <Button
              aria-pressed={layout === id}
              key={id}
              onClick={() => setLayout(id)}
              size="sm"
              type="button"
              variant={layout === id ? "secondary" : "ghost"}
            >
              {label}
            </Button>
          ))}
        </fieldset>
      )}
      {addAction &&
        (type ? (
          <div className="flex flex-wrap items-center gap-s">
            <Button
              disabled={addAction.disabled}
              onClick={() => addAction.onAdd(type, layout)}
              type="button"
            >
              Add to portfolio
            </Button>
            {addAction.disabled && (
              <p className="text-sm text-muted-foreground">
                Your draft has reached its custom section limit.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Preview only. Manage this section from its own editor.
          </p>
        ))}
      <LiveSectionPreview assetUrl={assetUrl} exampleId={exampleId} exampleLayout={layout} />
    </>
  );
}
