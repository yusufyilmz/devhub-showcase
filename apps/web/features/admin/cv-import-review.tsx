"use client";
import { Field, LinesField } from "@shared/components/fields";
import type { PortfolioProfile } from "@shared/content";
import { applyCvDraft, type CvImportGroup, cvImportGroups } from "@shared/lib/cv-import";
import { profileSchema } from "@shared/lib/profile";

import {
  EducationEditor,
  ExperienceEditor,
  LanguagesEditor,
  ProjectsEditor,
} from "./career-editors";
import { SkillsEditor } from "./skills-editor";

const labels: Record<CvImportGroup, string> = {
  about: "About",
  education: "Education",
  experiences: "Experience",
  languages: "Languages",
  personal: "Personal details",
  projects: "Projects",
  skills: "Skills",
};
const personalFields = [
  ["name", "Full name"],
  ["title", "Professional title"],
  ["summary", "Short introduction"],
  ["location", "Location"],
  ["email", "Public email"],
  ["phone", "Phone"],
  ["website", "Portfolio URL"],
  ["github", "GitHub URL"],
  ["linkedin", "LinkedIn URL"],
] as const;

function PersonalReview({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  return (
    <div className="editor-fields">
      {personalFields.map(([key, label]) => (
        <Field
          key={key}
          label={label}
          multiline={key === "summary"}
          onChange={(value) => onChange({ ...profile, [key]: value })}
          value={profile[key]}
        />
      ))}
    </div>
  );
}
export function CvImportReview({
  base,
  candidate,
  onChange,
  selected,
  onSelect,
  onApply,
  notes,
}: {
  base: PortfolioProfile;
  candidate: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  selected: CvImportGroup[];
  onSelect: (groups: CvImportGroup[]) => void;
  onApply: () => void;
  notes: string[];
}) {
  const validation = profileSchema.safeParse(applyCvDraft(base, candidate, selected));
  return (
    <section aria-labelledby="cv-review-title" className="cv-import-review">
      <h3 id="cv-review-title">Review your CV details</h3>
      <p>
        Select the groups to replace in your draft. Unselected groups, your layout, sections,
        username and sharing settings stay as they are.
      </p>
      <ul>
        {[...new Set(notes)].map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div className="cv-import-groups">
        {cvImportGroups.map((group) => (
          <label key={group}>
            <input
              checked={selected.includes(group)}
              onChange={(event) =>
                onSelect(
                  event.target.checked
                    ? [...selected, group]
                    : selected.filter((item) => item !== group),
                )
              }
              type="checkbox"
            />{" "}
            Replace {labels[group]}
          </label>
        ))}
      </div>
      {cvImportGroups
        .filter((group) => selected.includes(group))
        .map((group) => {
          const Editor = reviewEditors[group];
          return (
            <details key={group} open={group === "personal"}>
              <summary>Edit {labels[group]}</summary>
              <Editor onChange={onChange} profile={candidate} />
            </details>
          );
        })}
      {!validation.success && (
        <div className="editor-alert">
          <p>
            These fields need attention before you can save. You can correct them here or after
            applying to the draft.
          </p>
          <ul>
            {validation.error.issues.slice(0, 12).map((issue) => (
              <li key={issue.path.join(".")}>
                {issue.path.join(".")}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="studio-primary"
        disabled={!selected.length}
        onClick={onApply}
        type="button"
      >
        Apply reviewed details to draft
      </button>
      <p>Applying does not save or publish. Use Save changes when your draft is ready.</p>
    </section>
  );
}
const reviewEditors = {
  about: ({
    profile,
    onChange,
  }: {
    profile: PortfolioProfile;
    onChange: (profile: PortfolioProfile) => void;
  }) => (
    <LinesField
      label="About paragraphs"
      onChange={(about) => onChange({ ...profile, about })}
      value={profile.about}
    />
  ),
  education: EducationEditor,
  experiences: ExperienceEditor,
  languages: LanguagesEditor,
  personal: PersonalReview,
  projects: ProjectsEditor,
  skills: SkillsEditor,
};
