"use client";

import { useId, useState } from "react";

import { authorableSections, authorableSectionTypes } from "@shared/config";

import { Button } from "../../buttons/button";
import { Card } from "../../cards";
import { Badge } from "../../feedback/badge";
import { Input } from "../../forms/input";
import { Label } from "../../forms/label";
import { sectionCatalogDescriptions } from "./section-catalog-data";
import { SectionCatalogPreview } from "./section-catalog-preview";
import { sectionCatalogStyles } from "./styles";
import type { Group } from "./types";

const groups = ["All", "Story", "Work", "Media", "Connect"] as const;

function category(type: (typeof authorableSectionTypes)[number]): Exclude<Group, "All"> {
  const view = authorableSections[type].view;
  if (["gallery", "video", "clients"].includes(view)) return "Media";
  if (["contact", "links", "map", "newsletter", "toc"].includes(view)) return "Connect";
  if (
    [
      "cards",
      "dashboard",
      "projects",
      "pricing",
      "shop",
      "careers",
      "statistics",
      "property",
    ].includes(view)
  )
    return "Work";
  return "Story";
}

export function SectionCatalog() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("All");
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const search = query.trim().toLocaleLowerCase();
  const matches = authorableSectionTypes.filter(
    (type) =>
      (group === "All" || category(type) === group) &&
      `${authorableSections[type].name} ${sectionCatalogDescriptions[type]}`
        .toLocaleLowerCase()
        .includes(search),
  );
  return (
    <Card asChild interaction="static" layout="plain" surface="portfolio">
      <section aria-labelledby={`${id}-title`} className={sectionCatalogStyles.element1}>
        <div className={sectionCatalogStyles.element2}>
          <div>
            <p className={sectionCatalogStyles.element3}>FIND YOUR NEXT SECTION</p>
            <h3 id={`${id}-title`}>Browse all {authorableSectionTypes.length} section types</h3>
            <p>
              From a first introduction to your latest work. Find a place for every part of your
              story.
            </p>
          </div>
          <Badge variant="secondary">{authorableSectionTypes.length} ways to tell your story</Badge>
        </div>
        <div className={sectionCatalogStyles.element4}>
          <Label htmlFor={`${id}-search`}>Find a section</Label>
          <Input
            id={`${id}-search`}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try gallery, skills or contact"
            type="search"
            value={query}
          />
        </div>
        <fieldset className={sectionCatalogStyles.element5}>
          <legend className={sectionCatalogStyles.element6}>Section categories</legend>
          {groups.map((item) => (
            <Button
              aria-pressed={group === item}
              key={item}
              onClick={() => setGroup(item)}
              type="button"
              variant={group === item ? "secondary" : "ghost"}
            >
              {item}
            </Button>
          ))}
        </fieldset>
        <p aria-live="polite" className={sectionCatalogStyles.element7}>
          {matches.length} of {authorableSectionTypes.length} section types
        </p>
        <ul
          aria-label="Available section types"
          className={sectionCatalogStyles.element8}
          data-expanded={expanded || Boolean(search) || group !== "All"}
          id={`${id}-results`}
        >
          {matches.map((type) => (
            <Card asChild interaction="static" key={type} layout="plain" surface="portfolio">
              <li>
                <SectionCatalogPreview type={type} />
                <div className="section-catalog-card-copy">
                  <span className="section-catalog-card-category">{category(type)}</span>
                  <h4>{authorableSections[type].name}</h4>
                  <p>{sectionCatalogDescriptions[type]}</p>
                </div>
              </li>
            </Card>
          ))}
        </ul>
        {!search && group === "All" && (
          <Button
            aria-controls={`${id}-results`}
            aria-expanded={expanded}
            className={sectionCatalogStyles.element10}
            onClick={() => setExpanded(!expanded)}
            type="button"
            variant="ghost"
          >
            {expanded ? "Show fewer sections" : "Show all section types"}{" "}
            <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
          </Button>
        )}
        {matches.length === 0 && (
          <div className={sectionCatalogStyles.element11}>
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
