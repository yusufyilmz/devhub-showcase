'use client'
import { Field, LinesField } from '@shared/components/fields'
import type { PortfolioProfile } from '@shared/content'
export function ProfileFields({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  const update = (key: keyof PortfolioProfile, value: string | string[]) =>
    onChange({ ...profile, [key]: value })
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">THE INTRODUCTION</p>
          <h2>Your profile</h2>
          <p>The details people see first.</p>
        </div>
      </div>
      <div className="editor-card editor-fields">
        <Field
          label="Full name"
          value={profile.name}
          onChange={(v) => update('name', v)}
          required
        />
        <Field
          label="Professional title"
          value={profile.title}
          onChange={(v) => update('title', v)}
          required
        />
        <Field
          label="Location"
          value={profile.location}
          onChange={(v) => update('location', v)}
          required
        />
        <Field
          label="Public email"
          type="email"
          value={profile.email}
          onChange={(v) => update('email', v)}
          required
        />
        <Field
          label="Phone"
          type="tel"
          value={profile.phone}
          onChange={(v) => update('phone', v)}
        />
        <Field
          label="Portfolio URL"
          type="url"
          value={profile.website}
          onChange={(v) => update('website', v)}
        />
        <Field
          label="GitHub URL"
          type="url"
          value={profile.github}
          onChange={(v) => update('github', v)}
        />
        <Field
          label="LinkedIn URL"
          type="url"
          value={profile.linkedin}
          onChange={(v) => update('linkedin', v)}
        />
        <Field
          label="CV link"
          value={profile.cvUrl ?? '/cv.pdf'}
          onChange={(v) => update('cvUrl', v)}
          hint="/cv.pdf generates your CV from published information. An HTTPS URL overrides it."
        />
        <Field
          label="Short introduction"
          multiline
          value={profile.summary}
          onChange={(v) => update('summary', v)}
          required
        />
        <LinesField
          label="About paragraphs"
          value={profile.about}
          onChange={(v) => update('about', v)}
          hint="One paragraph per line. These also inform your AI assistant."
        />
      </div>
    </section>
  )
}
