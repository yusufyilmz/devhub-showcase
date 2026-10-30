'use client'
import { CollectionEditor } from '@shared/components/collection-editor'
import { Field, LinesField, SelectField } from '@shared/components/fields'
import {
  type AuthorableSectionType,
  authorableSections,
  type CustomSection,
  getSectionRenderers,
  type SectionOptions,
  type SectionSourceField
} from '@shared/content'
import type { SectionEditorProps } from '../types'

function OptionsEditor({
  section,
  type,
  onChange
}: SectionEditorProps & { type: AuthorableSectionType }) {
  const view = authorableSections[type].view
  const options = section.options ?? {}
  const change = (patch: Partial<SectionOptions>) =>
    onChange({ ...section, options: { ...options, ...patch } })
  return (
    <div className="editor-fields">
      <Field
        label="Section description"
        value={options.description ?? ''}
        multiline
        onChange={(description) => change({ description })}
      />
      <SelectField
        label="Text alignment"
        value={options.alignment ?? 'left'}
        onChange={(alignment) =>
          change({ alignment: alignment as SectionOptions['alignment'] })
        }
      >
        {['left', 'center', 'right'].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </SelectField>
      <SelectField
        label="Columns"
        value={String(options.columns ?? 3)}
        onChange={(value) =>
          change({ columns: Number(value) as 1 | 2 | 3 | 4 })
        }
      >
        {[1, 2, 3, 4].map((value) => (
          <option key={value}>{value}</option>
        ))}
      </SelectField>
      {view === 'hero' && (
        <Field
          label="Hero image URL"
          type="url"
          value={options.mediaUrl ?? ''}
          onChange={(mediaUrl) => change({ mediaUrl })}
        />
      )}
      {view === 'contact' && (
        <Field
          label="Recipient email"
          type="email"
          value={options.email ?? ''}
          required
          onChange={(email) => change({ email })}
          hint="The contact form opens the visitor’s email app. No message is sent by this website."
        />
      )}
      {view === 'newsletter' && (
        <Field
          label="Subscription page URL"
          type="url"
          value={options.actionUrl ?? ''}
          required
          onChange={(actionUrl) => change({ actionUrl })}
          hint="Your existing newsletter subscription page. No mailing list is created here."
        />
      )}
      {view === 'map' && (
        <>
          <Field
            label="Latitude"
            type="number"
            value={options.latitude?.toString() ?? ''}
            onChange={(value) =>
              change({ latitude: value === '' ? undefined : Number(value) })
            }
          />
          <Field
            label="Longitude"
            type="number"
            value={options.longitude?.toString() ?? ''}
            onChange={(value) =>
              change({ longitude: value === '' ? undefined : Number(value) })
            }
          />
        </>
      )}
    </div>
  )
}
function SourceEditor({
  section,
  type,
  onChange,
  sourceItems
}: SectionEditorProps & { type: AuthorableSectionType }) {
  const fields: readonly string[] = authorableSections[type].sources
  if (!fields.length) return null
  const source = section.source
  const choices = source ? (sourceItems?.[source.field] ?? []) : []
  return (
    <fieldset>
      <legend>Content source</legend>
      <SelectField
        label="Use content from"
        value={source?.field ?? ''}
        onChange={(field) =>
          onChange({
            ...section,
            source: field
              ? { type: 'profile', field: field as SectionSourceField }
              : undefined
          })
        }
      >
        <option value="">Own content</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </SelectField>
      {source && (
        <>
          <label>
            <input
              type="checkbox"
              checked={!source.itemIds}
              onChange={(event) =>
                onChange({
                  ...section,
                  source: {
                    ...source,
                    itemIds: event.target.checked ? undefined : []
                  }
                })
              }
            />{' '}
            All current and future items
          </label>
          {choices.map((item) => (
            <label className="section-source-choice" key={item.id}>
              <input
                type="checkbox"
                checked={source.itemIds?.includes(item.id) ?? true}
                onChange={(event) => {
                  const selected = source.itemIds ?? choices.map(({ id }) => id)
                  onChange({
                    ...section,
                    source: {
                      ...source,
                      itemIds: event.target.checked
                        ? [...selected, item.id]
                        : selected.filter((id) => id !== item.id)
                    }
                  })
                }}
              />{' '}
              {item.title}
            </label>
          ))}
          <p>
            Sources use this profile’s saved fields. Private projects stay
            excluded publicly.
          </p>
        </>
      )}
    </fieldset>
  )
}
function ItemFields({
  item,
  onChange,
  view
}: {
  item: CustomSection['items'][number]
  onChange: (item: CustomSection['items'][number]) => void
  view: string
}) {
  return (
    <>
      <Field
        label="Item title"
        value={item.title}
        required
        onChange={(title) => onChange({ ...item, title })}
      />
      <Field
        label="Item details"
        value={item.body}
        multiline
        onChange={(body) => onChange({ ...item, body })}
        hint="Plain text. Separate paragraphs with a blank line."
      />
      <Field
        label="Item link"
        type="url"
        value={item.url}
        onChange={(url) => onChange({ ...item, url })}
        hint="Public HTTP or HTTPS URL. Shop and plan links open your external checkout or product page."
      />
      <Field
        label="Cover image URL"
        type="url"
        value={item.imageUrl ?? ''}
        onChange={(imageUrl) => onChange({ ...item, imageUrl })}
      />
      {['pricing', 'shop', 'menu', 'property', 'statistics'].includes(view) && (
        <Field
          label="Price or value"
          value={item.value ?? ''}
          onChange={(value) => onChange({ ...item, value })}
        />
      )}
      {['timeline', 'posts', 'awards', 'careers'].includes(view) && (
        <Field
          label="Date or period"
          value={item.period ?? ''}
          onChange={(period) => onChange({ ...item, period })}
        />
      )}
      {view === 'video' && (
        <Field
          label="Video captions URL"
          type="url"
          value={item.captionsUrl ?? ''}
          onChange={(captionsUrl) => onChange({ ...item, captionsUrl })}
          hint="Optional WebVTT captions for direct MP4, WebM or Ogg video files."
        />
      )}
      <LinesField
        label="Features or bullet points"
        value={item.details ?? []}
        onChange={(details) =>
          onChange({ ...item, details: details.filter(Boolean) })
        }
      />
      {view === 'steps' && (
        <Field
          label="Code example"
          value={item.code ?? ''}
          multiline
          onChange={(code) => onChange({ ...item, code })}
        />
      )}
    </>
  )
}
export function SectionContentEditor({
  section,
  type,
  onChange,
  sourceItems
}: SectionEditorProps & { type: AuthorableSectionType }) {
  const definition = authorableSections[type]
  return (
    <div className="section-library-editor">
      <OptionsEditor section={section} type={type} onChange={onChange} />
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
        {getSectionRenderers(type).map((view) => (
          <option value={view} key={view}>
            {view}
          </option>
        ))}
      </SelectField>
      <SourceEditor
        section={section}
        type={type}
        onChange={onChange}
        sourceItems={sourceItems}
      />
      {!section.source &&
        !['heading', 'contact', 'map', 'toc', 'newsletter'].includes(
          definition.view
        ) && (
          <CollectionEditor<CustomSection['items'][number]>
            title="Section items"
            items={section.items}
            maxItems={30}
            getTitle={(item) => item.title}
            create={() => ({
              id: crypto.randomUUID(),
              title: 'New item',
              body: '',
              url: ''
            })}
            onChange={(items) => onChange({ ...section, items })}
            render={(item, change) => (
              <ItemFields
                item={item}
                onChange={change}
                view={definition.view}
              />
            )}
          />
        )}
      {['youtube', 'instagram', 'pinterest', 'video'].includes(type) && (
        <p>
          Use public work URLs and optional cover images. YouTube players load
          on visitor request; Instagram and Pinterest remain curated visual
          links.
        </p>
      )}
    </div>
  )
}
