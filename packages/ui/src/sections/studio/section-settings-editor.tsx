"use client";

import {
  getPortfolioSections,
  getSectionItems,
  type PortfolioSectionId,
  type PortfolioSectionSettings,
  sectionRegistry,
  sectionRendererViews,
} from "@shared/config";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { Input as LibraryInput } from "../../forms/input/Input";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { NativeSelect as LibraryNativeSelect } from "../../forms/native-select";
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
export function SectionSettingsEditor({ profile, onChange }: SectionSettingsEditorOptions) {
  function update(kind: PortfolioSectionId, value: PortfolioSectionSettings[PortfolioSectionId]) {
    onChange({
      ...profile,
      sectionSettings: { ...profile.sectionSettings, [kind]: value },
    });
  }
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className={sectionSettingsEditorStyles.element1}>
        <h2>Section display settings</h2>
        <p>
          Choose a display and the content for each section. Hidden sections and private projects
          are never shown in this preview. Your PDF keeps its own layout and content.
        </p>
        {getPortfolioSections(profile).map((section) => {
          const kind = section.kind;
          const settings = profile.sectionSettings?.[kind] ?? {};
          const items = getSectionItems(profile, kind);
          return (
            <fieldset className={sectionSettingsEditorStyles.element2} key={kind}>
              <legend>{sectionRegistry[kind].name}</legend>
              <LibraryLabel unstyled>
                <LibraryInput
                  checked={settings.visible ?? true}
                  onChange={(event) => update(kind, { ...settings, visible: event.target.checked })}
                  type="checkbox"
                  unstyled
                />{" "}
                Show section
              </LibraryLabel>
              <LibraryLabel htmlFor={`section-display-${kind}`} unstyled>
                Display style
              </LibraryLabel>
              <LibraryNativeSelect
                id={`section-display-${kind}`}
                onChange={(event) =>
                  update(kind, {
                    ...settings,
                    renderer: event.target.value || undefined,
                  } as PortfolioSectionSettings[typeof kind])
                }
                unstyled
                value={settings.renderer ?? ""}
              >
                <option value="">Layout default</option>
                {sectionRegistry[kind].renderers.map((renderer) => (
                  <option key={renderer} value={renderer}>
                    {names[sectionRendererViews[renderer]] ?? renderer}
                  </option>
                ))}
              </LibraryNativeSelect>
              {items.length > 0 && (
                <fieldset>
                  <legend>Included content</legend>
                  <LibraryLabel unstyled>
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
                    <LibraryLabel key={item.id} style={sectionSettingsEditorInlineStyle1} unstyled>
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
                      {item.title}
                    </LibraryLabel>
                  ))}
                </fieldset>
              )}
              {settings.renderer && (
                <details>
                  <summary>Preview {sectionRegistry[kind].name}</summary>
                  <p>
                    This preview uses your current edits. Save changes to update the public
                    portfolio.
                  </p>
                  <ConfiguredSection profile={profile} section={section} />
                </details>
              )}
              <Button
                className={sectionSettingsEditorStyles.element3}
                onClick={() => {
                  const next = { ...profile.sectionSettings };
                  delete next[kind];
                  onChange({ ...profile, sectionSettings: next });
                }}
                type="button"
                variant="outline"
              >
                Reset {sectionRegistry[kind].name} to default
              </Button>
            </fieldset>
          );
        })}
      </section>
    </Card>
  );
}
