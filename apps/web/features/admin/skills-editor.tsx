'use client'
import type { PortfolioProfile } from '@shared/content'
import { useState } from 'react'
import { LinesField } from './fields'

function SkillGroup({
  name,
  skills,
  rename,
  change,
  remove
}: {
  name: string
  skills: string[]
  rename: (name: string) => void
  change: (skills: string[]) => void
  remove: () => void
}) {
  const [label, setLabel] = useState(name)
  return (
    <article className="editor-card">
      <div className="editor-card-heading">
        <label className="editor-field">
          Group name
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            onBlur={() => {
              rename(label.trim())
              setLabel(name)
            }}
          />
        </label>
        <button
          type="button"
          className="danger-button"
          onClick={() => {
            if (window.confirm(`Remove ${name}?`)) remove()
          }}
        >
          Remove group
        </button>
      </div>
      <LinesField label={`${name} skills`} value={skills} onChange={change} />
    </article>
  )
}
export function SkillsEditor({
  profile,
  onChange
}: {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}) {
  const [error, setError] = useState('')
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">THE TOOLBOX</p>
          <h2>Skills</h2>
        </div>
        <button
          className="studio-secondary"
          type="button"
          onClick={() => {
            let n = 1
            while (profile.skills[`Skill group ${n}`]) n++
            onChange({
              ...profile,
              skills: { ...profile.skills, [`Skill group ${n}`]: [] }
            })
          }}
        >
          + Add group
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {Object.entries(profile.skills).map(([name, skills]) => (
        <SkillGroup
          key={name}
          name={name}
          skills={skills}
          rename={(next) => {
            if (
              !next ||
              ['__proto__', 'constructor', 'prototype'].includes(next) ||
              (next !== name && next in profile.skills)
            ) {
              setError('Choose a unique, non-empty group name.')
              return
            }
            setError('')
            onChange({
              ...profile,
              skills: Object.fromEntries(
                Object.entries(profile.skills).map(([key, value]) => [
                  key === name ? next : key,
                  value
                ])
              )
            })
          }}
          change={(value) =>
            onChange({
              ...profile,
              skills: { ...profile.skills, [name]: value }
            })
          }
          remove={() =>
            onChange({
              ...profile,
              skills: Object.fromEntries(
                Object.entries(profile.skills).filter(([key]) => key !== name)
              )
            })
          }
        />
      ))}
    </section>
  )
}
