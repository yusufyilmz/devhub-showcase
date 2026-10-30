"use client";
import { SortableList } from "@shared/components/sortable-list";
import {
  getPortfolioEntries,
  type PortfolioEntryId,
  type PortfolioProfile,
  portfolioSectionLabels,
} from "@shared/content";

export function SectionOrderEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  return (
    <section className="editor-card">
      <h2>Portfolio section order</h2>
      <p>
        Choose how visitors read your story. The introduction and contact area
        stay in place. Sections without content are skipped on your public
        portfolio.
      </p>
      <SortableList
        label="Portfolio section order"
        items={getPortfolioEntries(profile).map((section) => ({
          id: section.id,
          label:
            section.kind === "custom"
              ? section.title
              : portfolioSectionLabels[section.kind],
        }))}
        onChange={(ids) =>
          onChange({ ...profile, sectionSequence: ids as PortfolioEntryId[] })
        }
      />
      <button
        type="button"
        className="studio-secondary"
        disabled={!profile.sectionOrder && !profile.sectionSequence}
        onClick={() => {
          const {
            sectionOrder: _order,
            sectionSequence: _sequence,
            ...rest
          } = profile;
          onChange(rest);
        }}
      >
        Reset to layout default
      </button>
      <p>
        Save changes to apply this order to your portfolio. Your PDF keeps its
        own document layout.
      </p>
    </section>
  );
}
