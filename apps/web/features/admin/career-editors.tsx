"use client";
import { CollectionEditor } from "@shared/components/collection-editor";
import { Field, LinesField, SelectField } from "@shared/components/fields";
import type { PortfolioProfile } from "@shared/content";

const newId = () => crypto.randomUUID();
const today = () => new Date().toISOString().slice(0, 10);
type Props = {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
};
export function ExperienceEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      create={() => ({
        achievements: [],
        company: "",
        companyUrl: "https://",
        end: null,
        id: newId(),
        position: "",
        start: today(),
      })}
      getTitle={(item) => item.company}
      items={profile.experiences}
      onChange={(experiences) => onChange({ ...profile, experiences })}
      onRemove={(item) =>
        onChange({
          ...profile,
          experiences: profile.experiences.filter((row) => row.id !== item.id),
          projects: profile.projects.map((project) =>
            project.experienceId === item.id ? { ...project, experienceId: null } : project,
          ),
        })
      }
      render={(item, change) => (
        <>
          <Field
            label="Company"
            onChange={(company) => change({ ...item, company })}
            value={item.company}
          />
          <Field
            label="Company URL"
            onChange={(companyUrl) => change({ ...item, companyUrl })}
            type="url"
            value={item.companyUrl}
          />
          <Field
            label="Role"
            onChange={(position) => change({ ...item, position })}
            value={item.position}
          />
          <Field
            label="Start date"
            onChange={(start) => change({ ...item, start })}
            type="date"
            value={item.start}
          />
          <Field
            hint="Leave blank for your current role."
            label="End date"
            onChange={(end) => change({ ...item, end: end || null })}
            type="date"
            value={item.end ?? ""}
          />
          <LinesField
            label="Achievements"
            onChange={(achievements) => change({ ...item, achievements })}
            value={item.achievements}
          />
        </>
      )}
      title="Experience"
    />
  );
}
export function ProjectsEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      create={() => ({
        company: "Personal",
        description: "",
        experienceId: null,
        id: newId(),
        name: "",
        public: true,
        skills: [],
        sourceUrl: null,
        url: null,
      })}
      getTitle={(item) => item.name}
      items={profile.projects}
      onChange={(projects) => onChange({ ...profile, projects })}
      render={(item, change) => (
        <>
          <Field
            label="Project name"
            onChange={(name) => change({ ...item, name })}
            value={item.name}
          />
          <Field
            label="Company or client"
            onChange={(company) => change({ ...item, company })}
            value={item.company}
          />
          <SelectField
            label="Related experience"
            onChange={(experienceId) => change({ ...item, experienceId: experienceId || null })}
            value={item.experienceId ?? ""}
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
            onChange={(url) => change({ ...item, url: url || null })}
            type="url"
            value={item.url ?? ""}
          />
          <Field
            hint="Optional public image URL for the Designer layout. Use an image you have permission to share."
            label="Project cover image URL"
            onChange={(coverImage) => change({ ...item, coverImage: coverImage || null })}
            type="url"
            value={item.coverImage ?? ""}
          />
          <Field
            label="Source code URL"
            onChange={(sourceUrl) => change({ ...item, sourceUrl: sourceUrl || null })}
            type="url"
            value={item.sourceUrl ?? ""}
          />
          <Field
            label="Description"
            multiline
            onChange={(description) => change({ ...item, description })}
            value={item.description}
          />
          <LinesField
            label="Technologies"
            onChange={(skills) => change({ ...item, skills })}
            value={item.skills}
          />
          <label className="editor-checkbox full-width">
            <input
              checked={item.public}
              onChange={(event) => change({ ...item, public: event.target.checked })}
              type="checkbox"
            />
            Show in the public projects section
          </label>
        </>
      )}
      title="Projects"
    />
  );
}
export function EducationEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      create={() => ({
        degree: "",
        end: today(),
        field: "",
        id: newId(),
        institution: "",
        start: today(),
        url: "https://",
      })}
      getTitle={(item) => item.institution}
      items={profile.education}
      onChange={(education) => onChange({ ...profile, education })}
      render={(item, change) => (
        <>
          <Field
            label="Institution"
            onChange={(institution) => change({ ...item, institution })}
            value={item.institution}
          />
          <Field
            label="Institution URL"
            onChange={(url) => change({ ...item, url })}
            type="url"
            value={item.url}
          />
          <Field
            label="Degree"
            onChange={(degree) => change({ ...item, degree })}
            value={item.degree}
          />
          <Field
            label="Field of study"
            onChange={(field) => change({ ...item, field })}
            value={item.field}
          />
          <Field
            label="Start date"
            onChange={(start) => change({ ...item, start })}
            type="date"
            value={item.start}
          />
          <Field
            label="End date"
            onChange={(end) => change({ ...item, end })}
            type="date"
            value={item.end}
          />
        </>
      )}
      title="Education"
    />
  );
}
export function LanguagesEditor({ profile, onChange }: Props) {
  return (
    <CollectionEditor
      create={() => ({ id: newId(), language: "", proficiency: "" })}
      getTitle={(item) => item.language}
      items={profile.languages}
      onChange={(languages) => onChange({ ...profile, languages })}
      render={(item, change) => (
        <>
          <Field
            label="Language"
            onChange={(language) => change({ ...item, language })}
            value={item.language}
          />
          <Field
            label="Proficiency"
            onChange={(proficiency) => change({ ...item, proficiency })}
            value={item.proficiency}
          />
        </>
      )}
      title="Languages"
    />
  );
}
