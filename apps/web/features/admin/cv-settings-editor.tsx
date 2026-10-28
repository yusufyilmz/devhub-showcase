'use client'
import { SelectField } from '@shared/components/fields'
import type { PortfolioProfile } from '@shared/content'

const defaults: NonNullable<PortfolioProfile['cvSettings']> = {
  pageSize: 'A4',
  fontSize: 9,
  showEmail: true,
  showPhone: true,
  includeProjects: true,
  includeLanguages: true
}
export function CvSettingsEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  const settings = profile.cvSettings ?? defaults
  const update = (change: Partial<typeof defaults>) =>
    onChange({ ...profile, cvSettings: { ...settings, ...change } })
  return (
    <section className="editor-card editor-fields">
      <h2>Your PDF preferences</h2>
      <SelectField
        label="Page size"
        value={settings.pageSize}
        onChange={(v) => update({ pageSize: v as 'A4' | 'LETTER' })}
      >
        <option value="A4">A4</option>
        <option value="LETTER">US Letter</option>
      </SelectField>
      <SelectField
        label="Body text size"
        value={String(settings.fontSize)}
        onChange={(v) => update({ fontSize: Number(v) as 9 | 10 | 11 })}
      >
        <option value="9">Compact (9 pt)</option>
        <option value="10">Standard (10 pt)</option>
        <option value="11">Large (11 pt)</option>
      </SelectField>
      {(
        [
          ['showEmail', 'Include email'],
          ['showPhone', 'Include phone'],
          ['includeProjects', 'Include public projects'],
          ['includeLanguages', 'Include languages']
        ] as const
      ).map(([key, label]) => (
        <label key={key}>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={(event) => update({ [key]: event.target.checked })}
          />{' '}
          {label}
        </label>
      ))}
      <p>
        Your Appearance accent also applies to the PDF. These settings are saved
        only to your CV.
      </p>
    </section>
  )
}
