"use client";
import "../../styles/portfolio/portfolio.css";

import { type ReactNode, useId } from "react";

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
import { sectionSettingsEditorStyles } from "./styles";
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
  settings,
  onDirection,
  inclusionToolbar,
  renderItemControl,
}: {
  profile: PortfolioProfile;
  section: PortfolioSection;
  selectedRenderer?: SectionRendererId;
  onSelect: (renderer: SectionRendererId | undefined) => void;
  settings: NonNullable<PortfolioSectionSettings[PortfolioSectionId]>;
  onDirection: (direction: "row" | "column") => void;
  inclusionToolbar: ReactNode;
  renderItemControl: (id: string) => ReactNode;
}) {
  const previewId = useId();
  const definition = sectionRegistry[section.kind];
  const view = selectedRenderer ? sectionRendererViews[selectedRenderer] : undefined;
  const selectedDirection = settings.direction ?? (view === "list" ? "column" : "row");
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
      {view && ["cards", "gallery", "list"].includes(view) && (
        <fieldset className="flex flex-wrap gap-2 border-0 p-0">
          <legend className="mb-2 text-sm font-semibold">Arrangement</legend>
          {(["row", "column"] as const).map((direction) => (
            <Button
              aria-controls={previewId}
              aria-pressed={selectedDirection === direction}
              key={direction}
              onClick={() => onDirection(direction)}
              size="sm"
              type="button"
              variant={selectedDirection === direction ? "default" : "outline"}
            >
              {direction === "row" ? "Row" : "Column"}
            </Button>
          ))}
        </fieldset>
      )}
      <div id={previewId}>
        <SectionPreviewSurface label={`${definition.name} live preview`}>
          {inclusionToolbar}
          {section.settings.visible ? (
            <ConfiguredSection
              emptyState={
                <p className="py-4 text-sm text-muted-foreground">No items to preview.</p>
              }
              previewId={`${previewId}-section`}
              profile={profile}
              renderItemControl={renderItemControl}
              section={section}
              showEducationExample
            />
          ) : (
            <p className="py-4 text-sm text-muted-foreground">Section hidden.</p>
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
            const allItems = getSectionItems(profile, kind);
            const items =
              kind === "projects"
                ? getSectionItems(
                    { ...profile, projects: profile.projects.filter((project) => project.public) },
                    kind,
                  )
                : allItems;
            const included = (id: string) => settings.itemIds?.includes(id) ?? true;
            const itemControl = (id: string) => {
              const item = items.find((entry) => entry.id === id);
              if (!item) return null;
              const title = item.title.trim() || "Untitled item";
              return (
                <LibraryLabel className="flex min-w-0 items-start gap-2 text-sm" unstyled>
                  <LibraryInput
                    aria-label={`Include ${title}`}
                    checked={included(id)}
                    className="mt-1 shrink-0 accent-primary"
                    onChange={(event) => {
                      const selected = settings.itemIds ?? allItems.map((entry) => entry.id);
                      update(kind, {
                        ...settings,
                        itemIds: event.target.checked
                          ? [...selected, id]
                          : selected.filter((entry) => entry !== id),
                      });
                    }}
                    type="checkbox"
                    unstyled
                  />
                  {included(id) ? "Include" : title}
                </LibraryLabel>
              );
            };
            const excluded = items.filter(({ id }) => !included(id));
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
                  inclusionToolbar={
                    items.length > 0 && (
                      <fieldset className="my-3 grid min-w-0 gap-2 border-0 p-0 text-sm">
                        <legend className="sr-only">Included content</legend>
                        <LibraryLabel className="flex items-center gap-2" unstyled>
                          <LibraryInput
                            checked={settings.itemIds === undefined}
                            className="accent-primary"
                            onChange={(event) =>
                              update(kind, {
                                ...settings,
                                itemIds: event.target.checked ? undefined : [],
                              })
                            }
                            type="checkbox"
                            unstyled
                          />
                          Auto-include all items
                        </LibraryLabel>
                        {excluded.length > 0 && <p className="font-medium">Excluded items</p>}
                        {excluded.map(({ id }) => (
                          <div key={id}>{itemControl(id)}</div>
                        ))}
                      </fieldset>
                    )
                  }
                  onDirection={(direction) => update(kind, { ...settings, direction })}
                  onSelect={(renderer) =>
                    update(kind, {
                      ...settings,
                      direction:
                        renderer &&
                        ["cards", "gallery", "list"].includes(sectionRendererViews[renderer])
                          ? settings.direction
                          : undefined,
                      renderer,
                    } as PortfolioSectionSettings[typeof kind])
                  }
                  profile={profile}
                  renderItemControl={itemControl}
                  section={section}
                  selectedRenderer={settings.renderer}
                  settings={settings}
                />
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
