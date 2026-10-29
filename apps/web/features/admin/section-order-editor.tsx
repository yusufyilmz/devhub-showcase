'use client'
import { SortableList } from '@shared/components/sortable-list'
import {
  getPortfolioSectionOrder,
  type PortfolioProfile,
  type PortfolioSectionId,
  portfolioSectionLabels
} from '@shared/content'

export function SectionOrderEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
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
        items={getPortfolioSectionOrder(profile).map((id) => ({
          id,
          label: portfolioSectionLabels[id]
        }))}
        onChange={(ids) =>
          onChange({ ...profile, sectionOrder: ids as PortfolioSectionId[] })
        }
      />
      <button
        type="button"
        className="studio-secondary"
        disabled={!profile.sectionOrder}
        onClick={() => {
          const { sectionOrder: _order, ...rest } = profile
          onChange(rest)
        }}
      >
        Reset to layout default
      </button>
      <p>
        Save changes to apply this order to your portfolio. Your PDF keeps its
        own document layout.
      </p>
    </section>
  )
}
