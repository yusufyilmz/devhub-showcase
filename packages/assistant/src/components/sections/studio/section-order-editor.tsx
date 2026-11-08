"use client";

import { getPortfolioEntries, type PortfolioEntryId, portfolioSectionLabels } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";

import { SortableList } from "../../editors/sortable-list";
import { sectionOrderEditorStyles } from "./styles";
import type { SectionOrderEditorOptions } from "./types";

export function SectionOrderEditor({ profile, onChange }: SectionOrderEditorOptions) {
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className={sectionOrderEditorStyles.element1}>
        <h2>Portfolio section order</h2>
        <p>
          Choose how visitors read your story. The introduction and contact area stay in place.
          Sections without content are skipped on your public portfolio.
        </p>
        <SortableList
          items={getPortfolioEntries(profile).map((section) => ({
            id: section.id,
            label: section.kind === "custom" ? section.title : portfolioSectionLabels[section.kind],
          }))}
          label="Portfolio section order"
          onChange={(ids) => onChange({ ...profile, sectionSequence: ids as PortfolioEntryId[] })}
        />
        <Button
          className={sectionOrderEditorStyles.element2}
          disabled={!profile.sectionOrder && !profile.sectionSequence}
          onClick={() => {
            const { sectionOrder: _order, sectionSequence: _sequence, ...rest } = profile;
            onChange(rest);
          }}
          type="button"
          variant="outline"
        >
          Reset to layout default
        </Button>
        <p>
          Save changes to apply this order to your portfolio. Your PDF keeps its own document
          layout.
        </p>
      </section>
    </Card>
  );
}
