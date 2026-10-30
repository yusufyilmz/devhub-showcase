'use client'
import { CollectionEditor } from '@shared/components/collection-editor'
import { Field, SelectField } from '@shared/components/fields'
import {
  type CustomSection,
  customSectionViews,
  type PortfolioProfile
} from '@shared/content'
import { CustomPortfolioSection } from '../portfolio/custom-portfolio-section'

function createSection(): CustomSection {
  return {
    id: `custom-${crypto.randomUUID()}`,
    title: 'New section',
    renderer: 'list',
    visible: true,
    items: []
  }
}
export function CustomSectionsEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  const sections = profile.customSections ?? []
  function change(customSections: CustomSection[]) {
    const ids = new Set(customSections.map(({ id }) => id))
    const sequence = profile.sectionSequence?.filter(
      (id) => !id.startsWith('custom-') || ids.has(id as CustomSection['id'])
    )
    onChange({
      ...profile,
      customSections,
      ...(sequence
        ? {
            sectionSequence: [
              ...sequence,
              ...customSections
                .filter(({ id }) => !sequence.includes(id))
                .map(({ id }) => id)
            ]
          }
        : {})
    })
  }
  return (
    <section>
      <h2>Custom sections</h2>
      <p>
        Add awards, volunteering, publications or anything else that tells your
        story. Custom sections appear in your portfolio. Your PDF keeps its
        existing content and settings.
      </p>
      <button
        type="button"
        className="studio-primary"
        disabled={sections.length >= 20}
        onClick={() => change([...sections, createSection()])}
      >
        Add custom section
      </button>
      <p>
        Use Section order to drag these sections between your built-in sections.
        Save changes to publish your edits.
      </p>
      {sections.map((section) => (
        <CustomSectionEditor
          key={section.id}
          section={section}
          onChange={(updated) =>
            change(
              sections.map((item) => (item.id === updated.id ? updated : item))
            )
          }
          onDuplicate={
            sections.length >= 20
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
                        id: crypto.randomUUID()
                      }))
                    }
                  ])
          }
          onRemove={() => {
            if (
              window.confirm(
                `Remove ${section.title}? Changes take effect when you save.`
              )
            )
              change(sections.filter(({ id }) => id !== section.id))
          }}
        />
      ))}
    </section>
  )
}
function CustomSectionEditor({
  section,
  onChange,
  onDuplicate,
  onRemove
}: {
  section: CustomSection
  onChange: (section: CustomSection) => void
  onDuplicate?: () => void
  onRemove: () => void
}) {
  return (
    <fieldset className="editor-card">
      <legend>{section.title || 'New section'}</legend>
      <Field
        label="Section name"
        value={section.title}
        required
        onChange={(title) => onChange({ ...section, title })}
      />
      <SelectField
        label="Section display"
        value={section.renderer}
        onChange={(renderer) =>
          onChange({
            ...section,
            renderer: renderer as CustomSection['renderer']
          })
        }
      >
        {customSectionViews.map((view) => (
          <option value={view} key={view}>
            {view[0]?.toUpperCase()}
            {view.slice(1)}
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
        />{' '}
        Show custom section
      </label>
      <CollectionEditor
        title="Section items"
        maxItems={30}
        items={section.items}
        getTitle={(item) => item.title}
        create={() => ({
          id: crypto.randomUUID(),
          title: 'New item',
          body: '',
          url: ''
        })}
        onChange={(items) => onChange({ ...section, items })}
        render={(item, change) => (
          <>
            <Field
              label="Item title"
              value={item.title}
              required
              onChange={(title) => change({ ...item, title })}
            />
            <Field
              label="Item details"
              value={item.body}
              multiline
              onChange={(body) => change({ ...item, body })}
              hint="Plain text. Separate paragraphs with a blank line."
            />
            <Field
              label="Item link"
              value={item.url}
              type="url"
              onChange={(url) => change({ ...item, url })}
              hint="Optional http or https link."
            />
          </>
        )}
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
        <CustomPortfolioSection section={section} />
      </details>
    </fieldset>
  )
}
