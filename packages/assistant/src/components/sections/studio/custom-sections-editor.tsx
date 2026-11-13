"use client";

import { useState } from "react";

import {
  type AuthorableSectionType,
  authorableSections,
  authorableSectionTypes,
  type CustomSection,
  getPortfolioEntries,
  getSectionItems,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
  resolveSectionSource,
  type SectionComposition,
} from "@shared/config";
import { Button } from "@shared/ui/button";
import { Field, SelectField } from "@shared/ui/forms";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

import { EditSection } from "../editors/editors";
import { CustomPortfolioSection } from "./custom-portfolio-section";
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
}: CustomSectionsEditorOptions) {
  const [starter, setStarter] = useState<AuthorableSectionType>("custom");
  const sections = profile.customSections ?? [];
  const [selection, setSelection] = useState<string>();
  const selected = sections.find(({ id }) => id === selection) ?? sections[0];
  const displayed = focused ? sections.filter(({ id }) => id === selected?.id) : sections;
  function add() {
    const section = createSection(starter);
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
    <div className={focused ? "setup-section-library" : undefined}>
      <h2>Section library</h2>
      <SelectField
        label="Section starter"
        onChange={(value) => setStarter(value as AuthorableSectionType)}
        value={starter}
      >
        {authorableSectionTypes.map((type) => (
          <option key={type} value={type}>
            {authorableSections[type].name}
          </option>
        ))}
      </SelectField>
      <Button
        className={customSectionsEditorStyles.element1}
        disabled={sections.length >= MAX_CUSTOM_SECTIONS}
        onClick={add}
        type="button"
      >
        Add custom section
      </Button>
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
    <section className={focused ? "setup-section-builder" : undefined}>
      {library}
      <div className={focused ? "setup-section-editable" : undefined}>
        {focused && !selected && <p>Choose a section starter to add and configure it here.</p>}
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
      <LibraryLabel unstyled>
        <LibraryInput
          checked={section.visible}
          onChange={(event) => onChange({ ...section, visible: event.target.checked })}
          type="checkbox"
          unstyled
        />{" "}
        Show custom section
      </LibraryLabel>
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
        <CustomPortfolioSection
          anchors={getPortfolioEntries(profile).map((entry) => ({
            id: entry.id,
            title: entry.title,
          }))}
          language={profile.portfolioLanguage}
          preview
          section={resolveSectionSource({ ...section, sectionType: type }, profile)}
        />
      </details>
    </fieldset>
  );
}
