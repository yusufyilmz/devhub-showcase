'use client'
import {
  getPortfolioSections,
  getSectionItems,
  type PortfolioProfile,
  type PortfolioSectionId,
  type PortfolioSectionSettings,
  sectionRegistry,
  sectionRendererViews
} from '@shared/content'
import { ConfiguredSection } from '../portfolio/configured-section'

const names: Record<string, string> = {
  paragraphs: 'Paragraphs',
  timeline: 'Timeline',
  list: 'List',
  cards: 'Cards',
  gallery: 'Gallery',
  carousel: 'Carousel',
  accordion: 'Accordion',
  tabs: 'Tabs'
}
export function SectionSettingsEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  function update(
    kind: PortfolioSectionId,
    value: PortfolioSectionSettings[PortfolioSectionId]
  ) {
    onChange({
      ...profile,
      sectionSettings: { ...profile.sectionSettings, [kind]: value }
    })
  }
  return (
    <section className="editor-card">
      <h2>Section display settings</h2>
      <p>
        Choose a display and the content for each section. Hidden sections and
        private projects are never shown in this preview. Your PDF keeps its own
        layout and content.
      </p>
      {getPortfolioSections(profile).map((section) => {
        const kind = section.kind
        const settings = profile.sectionSettings?.[kind] ?? {}
        const items = getSectionItems(profile, kind)
        return (
          <fieldset key={kind} className="editor-card">
            <legend>{sectionRegistry[kind].name}</legend>
            <label>
              <input
                type="checkbox"
                checked={settings.visible ?? true}
                onChange={(event) =>
                  update(kind, { ...settings, visible: event.target.checked })
                }
              />{' '}
              Show section
            </label>
            <label htmlFor={`section-display-${kind}`}>Display style</label>
            <select
              id={`section-display-${kind}`}
              value={settings.renderer ?? ''}
              onChange={(event) =>
                update(kind, {
                  ...settings,
                  renderer: event.target.value || undefined
                } as PortfolioSectionSettings[typeof kind])
              }
            >
              <option value="">Layout default</option>
              {sectionRegistry[kind].renderers.map((renderer) => (
                <option key={renderer} value={renderer}>
                  {names[sectionRendererViews[renderer]] ?? renderer}
                </option>
              ))}
            </select>
            {items.length > 0 && (
              <fieldset>
                <legend>Included content</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.itemIds === undefined}
                    onChange={(event) =>
                      update(kind, {
                        ...settings,
                        itemIds: event.target.checked ? undefined : []
                      })
                    }
                  />{' '}
                  All items, including future additions
                </label>
                {items.map((item) => (
                  <label key={item.id} style={{ display: 'block' }}>
                    <input
                      type="checkbox"
                      checked={settings.itemIds?.includes(item.id) ?? true}
                      onChange={(event) => {
                        const selected =
                          settings.itemIds ?? items.map(({ id }) => id)
                        update(kind, {
                          ...settings,
                          itemIds: event.target.checked
                            ? [...selected, item.id]
                            : selected.filter((id) => id !== item.id)
                        })
                      }}
                    />{' '}
                    {item.title}
                  </label>
                ))}
              </fieldset>
            )}
            {settings.renderer && (
              <details>
                <summary>Preview {sectionRegistry[kind].name}</summary>
                <p>
                  This preview uses your current edits. Save changes to update
                  the public portfolio.
                </p>
                <ConfiguredSection profile={profile} section={section} />
              </details>
            )}
            <button
              type="button"
              className="studio-secondary"
              onClick={() => {
                const next = { ...profile.sectionSettings }
                delete next[kind]
                onChange({ ...profile, sectionSettings: next })
              }}
            >
              Reset {sectionRegistry[kind].name} to default
            </button>
          </fieldset>
        )
      })}
    </section>
  )
}
