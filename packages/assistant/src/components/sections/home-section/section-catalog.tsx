"use client";

import { useId, useState } from "react";

import { authorableSectionTypes } from "@shared/config";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import registry from "@shared/ui/registry.json";

import { SectionCatalogPreview } from "./section-catalog-preview";
import { sectionCatalogStyles } from "./styles";
import type { Group } from "./types";

const groups = ["All", "Story", "Work", "Media", "Connect"] as const;

const sections = authorableSectionTypes.map((id) => ({ id, ...registry.sections[id] }));

export function SectionCatalog() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("All");
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const search = query.trim().toLocaleLowerCase();
  const matches = sections.filter(
    ({ category, description, name }) =>
      (group === "All" || category === group) &&
      `${name} ${description}`.toLocaleLowerCase().includes(search),
  );
  return (
    <Card asChild interaction="static" layout="plain" surface="portfolio">
      <section aria-labelledby={`${id}-title`} className={sectionCatalogStyles.element1}>
        <div className={sectionCatalogStyles.element2}>
          <div>
            <p className={sectionCatalogStyles.element3}>FIND YOUR NEXT SECTION</p>
            <h3 id={`${id}-title`}>Browse all {sections.length} section types</h3>
            <p>
              From a first introduction to your latest work. Find a place for every part of your
              story.
            </p>
          </div>
          <Badge variant="secondary">{sections.length} ways to tell your story</Badge>
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
          {matches.length} of {sections.length} section types
        </p>
        <ul
          aria-label="Available section types"
          className={sectionCatalogStyles.element8}
          data-expanded={expanded || Boolean(search) || group !== "All"}
          id={`${id}-results`}
        >
          {matches.map(({ category, description, id, name }) => (
            <Card asChild interaction="static" key={id} layout="plain" surface="portfolio">
              <li>
                <SectionCatalogPreview type={id} />
                <div className="section-catalog-card-copy [width:100%] [padding:12px_14px_16px] [&_h4]:[margin-top:4px] [font-size:15px] [font-weight:650] [overflow-wrap:anywhere] [&_p]:[margin-top:5px] [font-size:12px] [line-height:1.45] [color:var(--muted-foreground)]">
                  <span className="section-catalog-card-category [font-size:10px] [font-weight:700] [color:var(--primary)] [text-transform:uppercase] [letter-spacing:0.09em]">
                    {category}
                  </span>
                  <h4>{name}</h4>
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
