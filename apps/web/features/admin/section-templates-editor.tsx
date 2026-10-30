'use client'
import { Field, SelectField } from '@shared/components/fields'
import {
  type PortfolioProfile,
  resolveSectionSource,
  type SavedSectionTemplate,
  type SectionTemplateFile
} from '@shared/content'
import { importPageForge, parseSectionFile } from '@shared/lib/pageforge-import'
import {
  applySectionTemplate,
  createSectionTemplate,
  sectionTemplateFileSchema
} from '@shared/lib/section-templates'
import { useEffect, useState } from 'react'
import { CustomPortfolioSection } from '../portfolio/custom-portfolio-section'

function download(document: SectionTemplateFile) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' })
  )
  const link = window.document.createElement('a')
  link.href = url
  link.download = 'mydevstudio-sections.json'
  link.click()
  URL.revokeObjectURL(url)
}
export function SectionTemplatesEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  const [name, setName] = useState('My section template')
  const [includeContent, setIncludeContent] = useState(false)
  const [review, setReview] = useState<SectionTemplateFile | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'append' | 'replace'>('append')
  const [json, setJson] = useState('')
  const [assetBase, setAssetBase] = useState('')
  const [templates, setTemplates] = useState<SavedSectionTemplate[]>([])
  const [revision, setRevision] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/section-templates')
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)
        if (!cancelled) {
          setTemplates(result.templates)
          setRevision(result.revision)
        }
      })
      .catch((reason) => {
        if (!cancelled) setError(reason.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])
  async function persist(next: SavedSectionTemplate[]) {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/section-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision, templates: next })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setTemplates(result.templates)
      setRevision(result.revision)
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Could not save templates'
      )
    } finally {
      setBusy(false)
    }
  }
  function attempt(action: () => void) {
    try {
      setError('')
      action()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Could not process sections'
      )
    }
  }
  function inspect(raw: string) {
    setReview(null)
    setWarnings([])
    attempt(() => {
      const value = parseSectionFile(raw)
      if (value && typeof value === 'object' && 'format' in value) {
        setReview(sectionTemplateFileSchema.parse(value))
        setWarnings([])
      } else {
        const imported = importPageForge(
          value,
          () => crypto.randomUUID(),
          assetBase || undefined
        )
        setReview(imported.document)
        setWarnings(imported.warnings)
      }
    })
  }
  function snapshot() {
    return createSectionTemplate(profile, name, includeContent)
  }
  return (
    <section className="editor-card template-library">
      <h2>Section templates and import/export</h2>
      <p>
        Templates contain authorable sections. Identity, publication, CV content
        and account ownership are never imported. Configuration exports omit
        content, media, contact details and profile bindings by default.
      </p>
      <Field label="Template name" value={name} onChange={setName} />
      <label>
        <input
          type="checkbox"
          checked={includeContent}
          onChange={(event) => setIncludeContent(event.target.checked)}
        />{' '}
        Include authored content, media and bindings
      </label>
      <div className="editor-actions">
        <button
          type="button"
          className="studio-secondary"
          disabled={loading || busy || !name.trim() || templates.length >= 5}
          onClick={() =>
            attempt(() =>
              persist([
                ...templates,
                { ...snapshot(), id: crypto.randomUUID() }
              ])
            )
          }
        >
          Save section template
        </button>
        <button
          type="button"
          className="studio-secondary"
          disabled={!name.trim()}
          onClick={() => attempt(() => download(snapshot()))}
        >
          Export sections JSON
        </button>
      </div>
      <p>
        Saved templates belong to your signed-in account and are stored
        privately, separately from your published portfolio. Applying a template
        changes only the portfolio draft. Exports with content can contain
        personal information; share those files only intentionally.
      </p>
      <ul className="template-library-list">
        {templates.map((template) => (
          <li key={template.id}>
            {template.name} · {template.sections.length} sections
            <button
              type="button"
              onClick={() => {
                setReview(template)
                setWarnings([])
              }}
            >
              Review {template.name}
            </button>
            <button type="button" onClick={() => download(template)}>
              Export {template.name}
            </button>
            <button
              type="button"
              onClick={() =>
                persist(templates.filter(({ id }) => id !== template.id))
              }
            >
              Delete {template.name}
            </button>
          </li>
        ))}
      </ul>
      <Field
        label="PageForge source asset base URL"
        value={assetBase}
        type="url"
        onChange={setAssetBase}
        hint="Optional original website URL to resolve relative image and link paths. Native templates do not need it."
      />
      <label>
        Import sections JSON
        <input
          type="file"
          accept=".json,application/json"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (!file) return
            if (file.size > 500_000) {
              setError('Import files must be smaller than 500 KB')
              return
            }
            try {
              inspect(await file.text())
            } catch {
              setError('Could not read this file')
            }
          }}
        />
      </label>
      <Field
        label="Paste sections JSON"
        multiline
        value={json}
        onChange={setJson}
      />
      <button
        type="button"
        onClick={() => inspect(json)}
        disabled={!json.trim()}
      >
        Review import
      </button>
      {error && <p role="alert">{error}</p>}
      {review && (
        <section className="editor-card" aria-label="Import review">
          <h3>Review: {review.name}</h3>
          <p>
            {review.sections.length} sections ·{' '}
            {review.includesContent
              ? 'includes authored content'
              : 'configuration only'}
            . Applying creates fresh IDs. Profile sources bind to this account
            and include current/future items; private projects remain excluded.
            Nothing is published by importing.
          </p>
          {warnings.length > 0 && (
            <details open>
              <summary>Conversion notes ({warnings.length})</summary>
              <ul>
                {warnings.map((warning, index) => (
                  <li key={`${index}-${warning}`}>{warning}</li>
                ))}
              </ul>
            </details>
          )}
          <ol>
            {review.sections.map((section) => (
              <li key={section.id}>
                {section.title} ·{' '}
                {section.sectionType ?? section.composition ?? 'custom'} ·{' '}
                {section.renderer} · {section.items.length} items
                <details>
                  <summary>Preview {section.title}</summary>
                  <CustomPortfolioSection
                    preview
                    section={resolveSectionSource(section, profile)}
                    language={profile.portfolioLanguage}
                  />
                </details>
              </li>
            ))}
          </ol>
          <SelectField
            label="Apply mode"
            value={mode}
            onChange={(value) => setMode(value as typeof mode)}
          >
            <option value="append">Append sections</option>
            <option value="replace">Replace custom sections</option>
          </SelectField>
          <button
            type="button"
            className="studio-primary"
            onClick={() =>
              attempt(() => {
                if (
                  mode === 'replace' &&
                  !window.confirm(
                    'Replace the custom sections in this draft? Save changes later to keep the result.'
                  )
                )
                  return
                onChange(
                  applySectionTemplate(profile, review, mode, () =>
                    crypto.randomUUID()
                  )
                )
                setReview(null)
              })
            }
          >
            Apply to draft
          </button>
          <button type="button" onClick={() => setReview(null)}>
            Cancel import
          </button>
        </section>
      )}
    </section>
  )
}
