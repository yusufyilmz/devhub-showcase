"use client";
import { Field, SelectField } from "@shared/components/fields";
import {
  type AuthorableSectionType,
  authorableSections,
  authorableSectionTypes,
  type CustomSection,
  getPortfolioEntries,
  getSectionItems,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
  type PortfolioProfile,
  resolveSectionSource,
  type SectionComposition,
} from "@shared/content";
import { EditSection } from "@shared/sections/editors";
import { useState } from "react";
import { CustomPortfolioSection } from "../portfolio/custom-portfolio-section";

const legacyType = (section: CustomSection): AuthorableSectionType =>
  section.sectionType ??
  (section.composition === "statistics"
    ? "stats"
    : (section.composition ?? "custom"));
function createSection(type: AuthorableSectionType): CustomSection {
  const aliases: Partial<Record<AuthorableSectionType, SectionComposition>> = {
    custom: "custom",
    services: "services",
    testimonials: "testimonials",
    faq: "faq",
    stats: "statistics",
    cta: "cta",
    youtube: "youtube",
    instagram: "instagram",
    pinterest: "pinterest",
  };
  return {
    id: `custom-${crypto.randomUUID()}`,
    title:
      type === "custom"
        ? "New section"
        : type === "youtube"
          ? "Films and videos"
          : authorableSections[type].name,
    sectionType: type,
    composition: aliases[type],
    renderer: getSectionRenderers(type)[0],
    visible: true,
    items: [],
  };
}
export function CustomSectionsEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const [starter, setStarter] = useState<AuthorableSectionType>("custom");
  const sections = profile.customSections ?? [];
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
              ...customSections
                .filter(({ id }) => !sequence.includes(id))
                .map(({ id }) => id),
            ],
          }
        : {}),
    });
  }
  return (
    <section>
      <h2>Section library</h2>
      <p>
        Choose any section type, add your content or use compatible profile
        elements, then arrange it in Section order. Changes stay in your draft
        until saved.
      </p>
      <SelectField
        label="Section starter"
        value={starter}
        onChange={(value) => setStarter(value as AuthorableSectionType)}
      >
        {authorableSectionTypes.map((type) => (
          <option key={type} value={type}>
            {authorableSections[type].name}
          </option>
        ))}
      </SelectField>
      <button
        type="button"
        className="studio-primary"
        disabled={sections.length >= MAX_CUSTOM_SECTIONS}
        onClick={() => change([...sections, createSection(starter)])}
      >
        Add custom section
      </button>
      {sections.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          profile={profile}
          onChange={(updated) =>
            change(
              sections.map((item) => (item.id === updated.id ? updated : item)),
            )
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
                      title: `${section.title.slice(0, 155)} copy`,
                      items: section.items.map((item) => ({
                        ...item,
                        id: crypto.randomUUID(),
                        details: item.details ? [...item.details] : undefined,
                      })),
                      options: section.options
                        ? { ...section.options }
                        : undefined,
                      source: section.source
                        ? {
                            ...section.source,
                            itemIds: section.source.itemIds
                              ? [...section.source.itemIds]
                              : undefined,
                          }
                        : undefined,
                    },
                  ])
          }
          onRemove={() => {
            if (
              window.confirm(
                `Remove ${section.title}? Changes take effect when you save.`,
              )
            )
              change(sections.filter(({ id }) => id !== section.id));
          }}
        />
      ))}
    </section>
  );
}
function SectionEditor({
  section,
  profile,
  onChange,
  onDuplicate,
  onRemove,
}: {
  section: CustomSection;
  profile: PortfolioProfile;
  onChange: (section: CustomSection) => void;
  onDuplicate?: () => void;
  onRemove: () => void;
}) {
  const type = legacyType(section);
  const sourceItems = {
    projects: getSectionItems(profile, "projects"),
    experiences: getSectionItems(profile, "experience"),
    education: getSectionItems(profile, "education"),
    skills: getSectionItems(profile, "skills"),
    languages: getSectionItems(profile, "languages"),
    about: [{ id: "about", title: "About" }],
  };
  return (
    <fieldset className="editor-card">
      <legend>{section.title || "New section"}</legend>
      <Field
        label="Section name"
        value={section.title}
        required
        onChange={(title) => onChange({ ...section, title })}
      />
      <SelectField
        label="Section type"
        value={type}
        onChange={(value) => {
          const next = value as AuthorableSectionType;
          onChange({
            ...section,
            sectionType: next,
            composition: undefined,
            source: undefined,
            renderer: getSectionRenderers(next)[0],
          });
        }}
      >
        {authorableSectionTypes.map((value) => (
          <option key={value} value={value}>
            {authorableSections[value].name}
          </option>
        ))}
      </SelectField>
      <label>
        <input
          type="checkbox"
          checked={section.visible}
          onChange={(event) =>
            onChange({ ...section, visible: event.target.checked })
          }
        />{" "}
        Show custom section
      </label>
      <EditSection
        section={{ ...section, sectionType: type }}
        onChange={onChange}
        sourceItems={sourceItems}
      />
      <div className="editor-actions">
        <button
          type="button"
          className="studio-secondary"
          disabled={!onDuplicate}
          onClick={onDuplicate}
        >
          Duplicate section
        </button>
        <button type="button" className="danger-button" onClick={onRemove}>
          Remove section
        </button>
      </div>
      <details>
        <summary>Preview {section.title}</summary>
        <CustomPortfolioSection
          preview
          section={resolveSectionSource(
            { ...section, sectionType: type },
            profile,
          )}
          language={profile.portfolioLanguage}
          anchors={getPortfolioEntries(profile).map((entry) => ({
            id: entry.id,
            title: entry.title,
          }))}
        />
      </details>
    </fieldset>
  );
}
