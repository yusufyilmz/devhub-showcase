"use client";

import { useId, useRef, useState } from "react";

import {
  type AuthorableSectionType,
  authorableSections,
  authorableSectionTypes,
  type CustomSection,
  getPortfolioEntries,
  getSectionItems,
  getSectionLayouts,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
  resolveSectionSource,
  type SectionComposition,
  type SectionOptions,
} from "@shared/config";

import { Button } from "../../buttons";
import { Field, Input, Label, SelectField } from "../../forms";
import { EditSection } from "../editors/editors";
import { LiveSectionPreview } from "../live-section-preview/live-section-preview";
import { SectionCatalog } from "../live-section-preview/section-catalog";
import { customSectionsEditorStyles } from "./styles";
import type { CustomSectionsEditorOptions, SectionEditorOptions } from "./types";

const resolveSectionType = (section: CustomSection): AuthorableSectionType =>
  section.sectionType ??
  (section.composition === "statistics" ? "stats" : (section.composition ?? "custom"));
function createSection(type: AuthorableSectionType): CustomSection {
  const aliases: Partial<Record<AuthorableSectionType, SectionComposition>> = {
    cta: "cta",
    custom: "custom",
    faq: "faq",
    instagram: "instagram",
    pinterest: "pinterest",
    services: "services",
    stats: "statistics",
    testimonials: "testimonials",
    youtube: "youtube",
  };
  return {
    composition: aliases[type],
    id: `custom-${crypto.randomUUID()}`,
    items: [],
    renderer: getSectionRenderers(type)[0],
    sectionType: type,
    title:
      type === "custom"
        ? "New section"
        : type === "youtube"
          ? "Films and videos"
          : authorableSections[type].name,
    visible: true,
  };
}
export function CustomSectionsEditor({
  profile,
  onChange,
  focused = false,
  libraryDefaultOpen = false,
}: CustomSectionsEditorOptions) {
  const [starter, setStarter] = useState<AuthorableSectionType>("custom");
  const [starterLayout, setStarterLayout] = useState<SectionOptions["layout"]>();
  const starterLayouts = getSectionLayouts(starter);
  const [starterPreviewOpen, setStarterPreviewOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(libraryDefaultOpen);
  const libraryToggle = useRef<HTMLButtonElement>(null);
  const libraryId = useId();
  const sections = profile.customSections ?? [];
  const [selection, setSelection] = useState<string>();
  const selected = sections.find(({ id }) => id === selection) ?? sections[0];
  const displayed = focused ? sections.filter(({ id }) => id === selected?.id) : sections;
  const atLimit = sections.length >= MAX_CUSTOM_SECTIONS;
  function add(type: AuthorableSectionType, layout?: SectionOptions["layout"]) {
    if (atLimit) return;
    const section = createSection(type);
    if (layout) section.options = { layout };
    change([...sections, section]);
    setSelection(section.id);
  }
  function change(customSections: CustomSection[]) {
    const ids = new Set(customSections.map(({ id }) => id));
    const sequence = profile.sectionSequence?.filter(
      (id) => !id.startsWith("custom-") || ids.has(id as CustomSection["id"]),
    );
    onChange({
      ...profile,
      customSections,
      ...(sequence
        ? {
            sectionSequence: [
              ...sequence,
              ...customSections.filter(({ id }) => !sequence.includes(id)).map(({ id }) => id),
            ],
          }
        : {}),
    });
  }
  const library = (
    <div
      className={
        focused
          ? "col-start-2 row-start-1 min-w-0 rounded-md border border-border bg-background p-4 max-[767px]:col-auto max-[767px]:row-auto [&_nav]:mt-4 [&_nav]:grid [&_nav]:gap-2"
          : "grid min-w-0 gap-3"
      }
    >
      <h2 className="mb-3 text-base font-semibold leading-snug">Section library</h2>
      <div className="grid gap-3">
        <SelectField
          label="Section starter"
          onChange={(value) => {
            setStarter(value as AuthorableSectionType);
            setStarterLayout(undefined);
          }}
          value={starter}
        >
          {authorableSectionTypes.map((type) => (
            <option key={type} value={type}>
              {authorableSections[type].name}
            </option>
          ))}
        </SelectField>
        {starterLayouts.length > 0 && (
          <SelectField
            label="Section layout"
            onChange={(value) =>
              setStarterLayout(starterLayouts.find(({ id }) => id === value)?.id)
            }
            value={starterLayout ?? ""}
          >
            <option value="">Default layout</option>
            {starterLayouts.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </SelectField>
        )}
        <Button
          className="justify-self-start"
          disabled={atLimit}
          onClick={() => add(starter, starterLayout)}
          type="button"
        >
          Add custom section
        </Button>
      </div>
      <details
        className="mt-3 min-w-0 space-y-s text-muted-foreground"
        onToggle={(event) => setStarterPreviewOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer text-sm font-medium">Preview section starter</summary>
        {starterPreviewOpen && (
          <LiveSectionPreview exampleId={starter} exampleLayout={starterLayout} key={starter} />
        )}
      </details>
      {focused && sections.length > 0 && (
        <nav aria-label="Custom sections in your draft">
          {sections.map(({ id, title }) => (
            <Button
              aria-current={selected?.id === id ? "true" : undefined}
              key={id}
              onClick={() => setSelection(id)}
              type="button"
              variant={selected?.id === id ? "secondary" : "outline"}
            >
              {title || "New section"}
            </Button>
          ))}
        </nav>
      )}
    </div>
  );
  return (
    <section className="grid min-w-0 gap-4">
      <Button
        aria-controls={libraryOpen ? libraryId : undefined}
        aria-expanded={libraryOpen}
        className="justify-self-start"
        onClick={() => setLibraryOpen(!libraryOpen)}
        ref={libraryToggle}
        type="button"
        variant="outline"
      >
        {libraryOpen ? "Hide section previews" : "Browse section previews"}
      </Button>
      {libraryOpen && (
        <div id={libraryId}>
          <SectionCatalog
            addAction={{
              disabled: atLimit,
              onAdd: (type, layout) => {
                add(type, layout);
                setLibraryOpen(false);
                libraryToggle.current?.focus();
              },
            }}
          />
        </div>
      )}
      <div
        className={
          focused
            ? "grid grid-cols-[minmax(0,1fr)_minmax(13rem,0.5fr)] items-start gap-4 max-[767px]:grid-cols-1"
            : undefined
        }
      >
        {library}
        <div
          className={
            focused
              ? "col-start-1 row-start-1 min-w-0 rounded-md border border-border bg-background p-4 max-[767px]:col-auto max-[767px]:row-auto"
              : undefined
          }
        >
          {focused && !selected && (
            <p className="text-sm text-muted-foreground">
              Choose a section starter to add and configure it here.
            </p>
          )}
          {displayed.map((section) => (
            <SectionEditor
              key={section.id}
              onChange={(updated) =>
                change(sections.map((item) => (item.id === updated.id ? updated : item)))
              }
              onDuplicate={
                sections.length >= MAX_CUSTOM_SECTIONS
                  ? undefined
                  : () =>
                      change([
                        ...sections,
                        {
                          ...section,
                          id: `custom-${crypto.randomUUID()}`,
                          items: section.items.map((item) => ({
                            ...item,
                            details: item.details ? [...item.details] : undefined,
                            id: crypto.randomUUID(),
                          })),
                          options: section.options ? { ...section.options } : undefined,
                          source: section.source
                            ? {
                                ...section.source,
                                itemIds: section.source.itemIds
                                  ? [...section.source.itemIds]
                                  : undefined,
                              }
                            : undefined,
                          title: `${section.title.slice(0, 155)} copy`,
                        },
                      ])
              }
              onRemove={() => {
                if (window.confirm(`Remove ${section.title}? Changes take effect when you save.`))
                  change(sections.filter(({ id }) => id !== section.id));
              }}
              profile={profile}
              section={section}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionEditor({
  section,
  profile,
  onChange,
  onDuplicate,
  onRemove,
}: SectionEditorOptions) {
  const type = resolveSectionType(section);
  const sourceItems = {
    about: [{ id: "about", title: "About" }],
    education: getSectionItems(profile, "education"),
    experiences: getSectionItems(profile, "experience"),
    languages: getSectionItems(profile, "languages"),
    projects: getSectionItems(profile, "projects"),
    skills: getSectionItems(profile, "skills"),
  };
  return (
    <fieldset className={customSectionsEditorStyles.element2}>
      <legend>{section.title || "New section"}</legend>
      <Field
        label="Section name"
        onChange={(title) => onChange({ ...section, title })}
        required
        value={section.title}
      />
      <SelectField
        label="Section type"
        onChange={(value) => {
          const next = value as AuthorableSectionType;
          onChange({
            ...section,
            composition: undefined,
            options: section.options ? { ...section.options, layout: undefined } : undefined,
            renderer: getSectionRenderers(next)[0],
            sectionType: next,
            source: undefined,
          });
        }}
        value={type}
      >
        {authorableSectionTypes.map((value) => (
          <option key={value} value={value}>
            {authorableSections[value].name}
          </option>
        ))}
      </SelectField>
      <Label unstyled>
        <Input
          checked={section.visible}
          onChange={(event) => onChange({ ...section, visible: event.target.checked })}
          type="checkbox"
          unstyled
        />{" "}
        Show custom section
      </Label>
      <EditSection
        onChange={onChange}
        section={{ ...section, sectionType: type }}
        sourceItems={sourceItems}
      />
      <div className={customSectionsEditorStyles.element3}>
        <Button
          className={customSectionsEditorStyles.element4}
          disabled={!onDuplicate}
          onClick={onDuplicate}
          type="button"
          variant="outline"
        >
          Duplicate section
        </Button>
        <Button className={customSectionsEditorStyles.element5} onClick={onRemove} type="button">
          Remove section
        </Button>
      </div>
      <details>
        <summary>Preview {section.title}</summary>
        <LiveSectionPreview
          anchors={getPortfolioEntries(profile).map((entry) => ({
            id: entry.id,
            title: entry.title,
          }))}
          exampleId={type}
          language={profile.portfolioLanguage}
          section={resolveSectionSource({ ...section, sectionType: type }, profile)}
        />
      </details>
    </fieldset>
  );
}
