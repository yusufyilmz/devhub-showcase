'use client'
import { CollectionEditor } from '@shared/components/collection-editor'
import { Field, LinesField, SelectField } from '@shared/components/fields'
import type { PortfolioProfile } from '@shared/content'

const newId = () => crypto.randomUUID()
const today = () => new Date().toISOString().slice(0, 10)
type Props = {
  profile: PortfolioProfile
  onChange: (profile: PortfolioProfile) => void
}
export function ExperienceEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      title="Experience"
      items={profile.experiences}
      onChange={(experiences) => onChange({ ...profile, experiences })}
      create={() => ({
        id: newId(),
        company: '',
        companyUrl: 'https://',
        position: '',
        start: today(),
        end: null,
        achievements: []
      })}
      getTitle={(item) => item.company}
      onRemove={(item) =>
        onChange({
          ...profile,
          experiences: profile.experiences.filter((row) => row.id !== item.id),
          projects: profile.projects.map((project) =>
            project.experienceId === item.id
              ? { ...project, experienceId: null }
              : project
          )
        })
      }
      render={(item, change) => (
        <>
          <Field
            label="Company"
            value={item.company}
            onChange={(company) => change({ ...item, company })}
          />
          <Field
            label="Company URL"
            type="url"
            value={item.companyUrl}
            onChange={(companyUrl) => change({ ...item, companyUrl })}
          />
          <Field
            label="Role"
            value={item.position}
            onChange={(position) => change({ ...item, position })}
          />
          <Field
            label="Start date"
            type="date"
            value={item.start}
            onChange={(start) => change({ ...item, start })}
          />
          <Field
            label="End date"
            type="date"
            value={item.end ?? ''}
            onChange={(end) => change({ ...item, end: end || null })}
            hint="Leave blank for your current role."
          />
          <LinesField
            label="Achievements"
            value={item.achievements}
            onChange={(achievements) => change({ ...item, achievements })}
          />
        </>
      )}
    />
  )
}
export function ProjectsEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      title="Projects"
      items={profile.projects}
      onChange={(projects) => onChange({ ...profile, projects })}
      create={() => ({
        id: newId(),
        name: '',
        company: 'Personal',
        experienceId: null,
        url: null,
        sourceUrl: null,
        description: '',
        skills: [],
        public: true
      })}
      getTitle={(item) => item.name}
      render={(item, change) => (
        <>
          <Field
            label="Project name"
            value={item.name}
            onChange={(name) => change({ ...item, name })}
          />
          <Field
            label="Company or client"
            value={item.company}
            onChange={(company) => change({ ...item, company })}
          />
          <SelectField
            label="Related experience"
            value={item.experienceId ?? ''}
            onChange={(experienceId) =>
              change({ ...item, experienceId: experienceId || null })
            }
          >
            <option value="">Personal / independent</option>
            {profile.experiences.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.company}
              </option>
            ))}
          </SelectField>
          <Field
            label="Live URL"
            type="url"
            value={item.url ?? ''}
            onChange={(url) => change({ ...item, url: url || null })}
          />
          <Field
            label="Project cover image URL"
            type="url"
            value={item.coverImage ?? ''}
            onChange={(coverImage) =>
              change({ ...item, coverImage: coverImage || null })
            }
            hint="Optional public image URL for the Designer layout. Use an image you have permission to share."
          />
          <Field
            label="Source code URL"
            type="url"
            value={item.sourceUrl ?? ''}
            onChange={(sourceUrl) =>
              change({ ...item, sourceUrl: sourceUrl || null })
            }
          />
          <Field
            label="Description"
            multiline
            value={item.description}
            onChange={(description) => change({ ...item, description })}
          />
          <LinesField
            label="Technologies"
            value={item.skills}
            onChange={(skills) => change({ ...item, skills })}
          />
          <label className="editor-checkbox full-width">
            <input
              type="checkbox"
              checked={item.public}
              onChange={(event) =>
                change({ ...item, public: event.target.checked })
              }
            />
            Show in the public projects section
          </label>
        </>
      )}
    />
  )
}
export function EducationEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      title="Education"
      items={profile.education}
      onChange={(education) => onChange({ ...profile, education })}
      create={() => ({
        id: newId(),
        degree: '',
        field: '',
        institution: '',
        url: 'https://',
        start: today(),
        end: today()
      })}
      getTitle={(item) => item.institution}
      render={(item, change) => (
        <>
          <Field
            label="Institution"
            value={item.institution}
            onChange={(institution) => change({ ...item, institution })}
          />
          <Field
            label="Institution URL"
            type="url"
            value={item.url}
            onChange={(url) => change({ ...item, url })}
          />
          <Field
            label="Degree"
            value={item.degree}
            onChange={(degree) => change({ ...item, degree })}
          />
          <Field
            label="Field of study"
            value={item.field}
            onChange={(field) => change({ ...item, field })}
          />
          <Field
            label="Start date"
            type="date"
            value={item.start}
            onChange={(start) => change({ ...item, start })}
          />
          <Field
            label="End date"
            type="date"
            value={item.end}
            onChange={(end) => change({ ...item, end })}
          />
        </>
      )}
    />
  )
}
export function LanguagesEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      title="Languages"
      items={profile.languages}
      onChange={(languages) => onChange({ ...profile, languages })}
      create={() => ({ id: newId(), language: '', proficiency: '' })}
      getTitle={(item) => item.language}
      render={(item, change) => (
        <>
          <Field
            label="Language"
            value={item.language}
            onChange={(language) => change({ ...item, language })}
          />
          <Field
            label="Proficiency"
            value={item.proficiency}
            onChange={(proficiency) => change({ ...item, proficiency })}
          />
        </>
      )}
    />
  )
}
