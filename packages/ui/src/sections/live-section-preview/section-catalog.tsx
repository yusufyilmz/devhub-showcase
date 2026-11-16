"use client";

import { useId, useState } from "react";

import { Button } from "../../buttons";
import { Input, Label, SelectField } from "../../forms";
import { LiveSectionPreview, type LiveSectionPreviewProps } from "./live-section-preview";
import { type SectionExampleId, sectionExamples } from "./preview-examples";

const groups = ["All", "Story", "Work", "Media", "Connect"] as const;
type Group = (typeof groups)[number];

export function SectionCatalog({ assetUrl }: Pick<LiveSectionPreviewProps, "assetUrl"> = {}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("All");
  const [selection, setSelection] = useState<SectionExampleId>("services");
  const id = useId();
  const search = query.trim().toLocaleLowerCase();
  const matches = sectionExamples.filter(
    ({ category, description, name }) =>
      (group === "All" || category === group) &&
      `${name} ${description}`.toLocaleLowerCase().includes(search),
  );
  const selected = matches.find((entry) => entry.id === selection) ?? matches[0];

  return (
    <section aria-labelledby={`${id}-title`} className="@container grid min-w-0 gap-md">
      <h3 className="text-xl font-semibold tracking-tight" id={`${id}-title`}>
        Browse sections
      </h3>
      <div className="grid min-w-0 gap-md @3xl:grid-cols-[minmax(14rem,1fr)_minmax(0,2fr)]">
        <div className="grid min-w-0 content-start gap-sm">
          <div className="grid gap-xs">
            <Label htmlFor={`${id}-search`}>Find a section</Label>
            <Input
              id={`${id}-search`}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              value={query}
            />
          </div>
          <fieldset className="flex min-w-0 flex-wrap gap-xs">
            <legend className="sr-only">Section categories</legend>
            {groups.map((item) => (
              <Button
                aria-pressed={group === item}
                key={item}
                onClick={() => setGroup(item)}
                size="sm"
                type="button"
                variant={group === item ? "secondary" : "ghost"}
              >
                {item}
              </Button>
            ))}
          </fieldset>
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {matches.length} of {sectionExamples.length} examples
          </p>
          {selected ? (
            <>
              <SelectField
                label="Section example"
                onChange={(value) => {
                  const match = matches.find((entry) => entry.id === value);
                  if (match) setSelection(match.id);
                }}
                value={selected.id}
              >
                {matches.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </SelectField>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {selected.description}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">No sections match your search.</p>
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
            </>
          )}
        </div>
        {selected && (
          <LiveSectionPreview assetUrl={assetUrl} exampleId={selected.id} key={selected.id} />
        )}
      </div>
    </section>
  );
}
