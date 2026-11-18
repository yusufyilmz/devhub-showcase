"use client";
import "../../styles/portfolio/portfolio.css";

import { useId } from "react";

import {
  getPortfolioSections,
  getSectionItems,
  type PortfolioProfile,
  type PortfolioSection,
  type PortfolioSectionId,
  type PortfolioSectionSettings,
  type SectionRendererId,
  sectionRegistry,
  sectionRendererViews,
} from "@shared/config";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Input as LibraryInput } from "../../forms/input";
import { Label as LibraryLabel } from "../../forms/label";
import { SectionPreviewSurface } from "../live-section-preview/live-section-preview";
import { ConfiguredSection } from "./configured-section";
import { sectionSettingsEditorInlineStyle1, sectionSettingsEditorStyles } from "./styles";
import type { SectionSettingsEditorOptions } from "./types";

const names: Record<string, string> = {
  accordion: "Accordion",
  cards: "Cards",
  carousel: "Carousel",
  gallery: "Gallery",
  list: "List",
  paragraphs: "Paragraphs",
  tabs: "Tabs",
  timeline: "Timeline",
};

function SectionLayoutPicker({
  profile,
  section,
  selectedRenderer,
  onSelect,
}: {
  profile: PortfolioProfile;
  section: PortfolioSection;
  selectedRenderer?: SectionRendererId;
  onSelect: (renderer: SectionRendererId | undefined) => void;
}) {
  const previewId = useId();
  const definition = sectionRegistry[section.kind];
  const choices = [
    { label: "Layout default", renderer: undefined },
    ...definition.renderers.map((renderer) => ({
      label:
        renderer === "skill-groups"
          ? "Groups"
          : (names[sectionRendererViews[renderer]] ?? renderer),
      renderer,
    })),
  ];
  return (
    <div className="grid min-w-0 gap-3">
      <fieldset className="flex min-w-0 flex-wrap gap-2 border-0 p-0">
        <legend className="mb-2 text-sm font-semibold">Display style</legend>
        {choices.map(({ label, renderer }) => (
          <Button
            aria-controls={previewId}
            aria-pressed={selectedRenderer === renderer}
            key={renderer ?? "default"}
            onClick={() => onSelect(renderer)}
            size="sm"
            type="button"
            variant={selectedRenderer === renderer ? "default" : "outline"}
          >
            {label}
          </Button>
        ))}
      </fieldset>
      <div id={previewId}>
        <SectionPreviewSurface label={`${definition.name} live preview`}>
          {section.settings.visible ? (
            <ConfiguredSection
              emptyState={
                <p className="py-4 text-sm text-muted-foreground">
                  Add or include content to preview this section.
                </p>
              }
              previewId={`${previewId}-section`}
              profile={profile}
              section={section}
            />
          ) : (
            <p className="py-4 text-sm text-muted-foreground">This section is hidden.</p>
          )}
        </SectionPreviewSurface>
      </div>
    </div>
  );
}

export function SectionSettingsEditor({
  profile,
  onChange,
  onlySection,
}: SectionSettingsEditorOptions & { onlySection?: PortfolioSectionId }) {
  const Surface = onlySection ? "details" : "section";
  function update(kind: PortfolioSectionId, value: PortfolioSectionSettings[PortfolioSectionId]) {
    onChange({
      ...profile,
      sectionSettings: { ...profile.sectionSettings, [kind]: value },
    });
  }
  return (
    <Card asChild interaction="static" layout="plain" surface="portfolio">
      <Surface
        className={
          onlySection
            ? sectionSettingsEditorStyles.inlinePanel
            : sectionSettingsEditorStyles.element1
        }
        key={onlySection}
        open={onlySection ? true : undefined}
      >
        {onlySection && (
          <summary className={sectionSettingsEditorStyles.inlineSummary}>
            Section visibility and layout
          </summary>
        )}
        {!onlySection && <h2>Section display settings</h2>}
        {!onlySection && (
          <p>
            Choose a display and the content for each section. Hidden sections and private projects
            are never shown in this preview. Your PDF keeps its own layout and content.
          </p>
        )}
        {getPortfolioSections(profile)
          .filter(({ kind }) => !onlySection || kind === onlySection)
          .map((section) => {
            const kind = section.kind;
            const settings = profile.sectionSettings?.[kind] ?? {};
            const items = getSectionItems(profile, kind);
            return (
              <fieldset
                className={
                  onlySection
                    ? sectionSettingsEditorStyles.inlineFields
                    : sectionSettingsEditorStyles.element2
                }
                key={kind}
              >
                <legend className={onlySection ? "sr-only" : undefined}>
                  {sectionRegistry[kind].name}
                </legend>
                <LibraryLabel className="flex items-center gap-2 [&_input]:accent-primary" unstyled>
                  <LibraryInput
                    checked={settings.visible ?? true}
                    onChange={(event) =>
                      update(kind, { ...settings, visible: event.target.checked })
                    }
                    type="checkbox"
                    unstyled
                  />{" "}
                  Show section
                </LibraryLabel>
                <SectionLayoutPicker
                  onSelect={(renderer) =>
                    update(kind, {
                      ...settings,
                      renderer,
                    } as PortfolioSectionSettings[typeof kind])
                  }
                  profile={profile}
                  section={section}
                  selectedRenderer={settings.renderer}
                />
                {items.length > 0 && (
                  <fieldset className={sectionSettingsEditorStyles.includedContent}>
                    <legend className="mb-1 px-1 text-sm font-semibold">Included content</legend>
                    <LibraryLabel
                      className="flex items-center gap-2 [&_input]:accent-primary"
                      unstyled
                    >
                      <LibraryInput
                        checked={settings.itemIds === undefined}
                        onChange={(event) =>
                          update(kind, {
                            ...settings,
                            itemIds: event.target.checked ? undefined : [],
                          })
                        }
                        type="checkbox"
                        unstyled
                      />{" "}
                      All items, including future additions
                    </LibraryLabel>
                    {items.map((item) => (
                      <LibraryLabel
                        className="flex items-center gap-2 [&_input]:accent-primary"
                        key={item.id}
                        style={sectionSettingsEditorInlineStyle1}
                        unstyled
                      >
                        <LibraryInput
                          checked={settings.itemIds?.includes(item.id) ?? true}
                          onChange={(event) => {
                            const selected = settings.itemIds ?? items.map(({ id }) => id);
                            update(kind, {
                              ...settings,
                              itemIds: event.target.checked
                                ? [...selected, item.id]
                                : selected.filter((id) => id !== item.id),
                            });
                          }}
                          type="checkbox"
                          unstyled
                        />{" "}
                        {item.title.trim() || "Untitled item"}
                      </LibraryLabel>
                    ))}
                  </fieldset>
                )}
                <Button
                  className={
                    onlySection ? "justify-self-start" : sectionSettingsEditorStyles.element3
                  }
                  onClick={() => {
                    const next = { ...profile.sectionSettings };
                    delete next[kind];
                    onChange({ ...profile, sectionSettings: next });
                  }}
                  size={onlySection ? "sm" : undefined}
                  type="button"
                  variant="outline"
                >
                  Reset {sectionRegistry[kind].name} to default
                </Button>
              </fieldset>
            );
          })}
      </Surface>
    </Card>
  );
}
