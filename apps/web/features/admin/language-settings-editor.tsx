'use client'
import { SelectField } from '@shared/components/fields'
import {
  type Language,
  languages,
  type PortfolioProfile
} from '@shared/content'

export function LanguageSettingsEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  return (
    <section className="editor-card editor-fields">
      <h2>Portfolio and CV languages</h2>
      <SelectField
        label="Portfolio language"
        value={profile.portfolioLanguage ?? 'en'}
        onChange={(value) =>
          onChange({ ...profile, portfolioLanguage: value as Language })
        }
      >
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="CV language"
        value={profile.cvLanguage ?? 'en'}
        onChange={(value) =>
          onChange({ ...profile, cvLanguage: value as Language })
        }
      >
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </SelectField>
      <p className="full-width">
        These settings translate headings, controls and dates. Write your
        biography, job descriptions and project details in the language you want
        to share. Your saved text is not automatically translated.
      </p>
      <p className="full-width">
        The Languages section lists languages you speak. Your studio and the
        platform homepage currently use English.
      </p>
    </section>
  )
}
