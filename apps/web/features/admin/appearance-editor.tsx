'use client'
import { SelectField } from '@shared/components/fields'
import type { PortfolioProfile } from '@shared/content'
export function AppearanceEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  const appearance = profile.appearance ?? {
    accent: 'cyan',
    defaultTheme: 'dark'
  }
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">SET THE MOOD</p>
          <h2>Appearance</h2>
          <p>
            Your default look. Visitors can choose their own light or dark mode.
          </p>
        </div>
      </div>
      <div className="editor-card editor-fields">
        <SelectField
          label="Default theme"
          value={appearance.defaultTheme}
          onChange={(defaultTheme) =>
            onChange({
              ...profile,
              appearance: {
                ...appearance,
                defaultTheme: defaultTheme as typeof appearance.defaultTheme
              }
            })
          }
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">Match device</option>
        </SelectField>
        <SelectField
          label="Accent color"
          value={appearance.accent}
          onChange={(accent) =>
            onChange({
              ...profile,
              appearance: {
                ...appearance,
                accent: accent as typeof appearance.accent
              }
            })
          }
        >
          <option value="cyan">Ocean cyan</option>
          <option value="violet">Soft violet</option>
          <option value="emerald">Fresh emerald</option>
        </SelectField>
        <fieldset className="palette-samples full-width">
          <legend className="sr-only">Available accent colors</legend>
          <span className="sample-cyan">Ocean</span>
          <span className="sample-violet">Violet</span>
          <span className="sample-emerald">Emerald</span>
        </fieldset>
      </div>
    </section>
  )
}
