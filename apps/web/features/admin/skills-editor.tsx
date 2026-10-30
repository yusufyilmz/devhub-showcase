"use client";
import { useState } from "react";

import { LinesField } from "@shared/components/fields";
import type { PortfolioProfile } from "@shared/content";

function SkillGroup({
  name,
  skills,
  rename,
  change,
  remove,
}: {
  name: string;
  skills: string[];
  rename: (name: string) => void;
  change: (skills: string[]) => void;
  remove: () => void;
}) {
  const [label, setLabel] = useState(name);
  return (
    <article className="editor-card">
      <div className="editor-card-heading">
        <label className="editor-field">
          Group name
          <input
            onBlur={() => {
              rename(label.trim());
              setLabel(name);
            }}
            onChange={(event) => setLabel(event.target.value)}
            value={label}
          />
        </label>
        <button
          className="danger-button"
          onClick={() => {
            if (window.confirm(`Remove ${name}?`)) remove();
          }}
          type="button"
        >
          Remove group
        </button>
      </div>
      <LinesField label={`${name} skills`} onChange={change} value={skills} />
    </article>
  );
}
export function SkillsEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const [error, setError] = useState("");
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">THE TOOLBOX</p>
          <h2>Skills</h2>
        </div>
        <button
          className="studio-secondary"
          onClick={() => {
            let n = 1;
            while (profile.skills[`Skill group ${n}`]) n++;
            onChange({
              ...profile,
              skills: { ...profile.skills, [`Skill group ${n}`]: [] },
            });
          }}
          type="button"
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
          change={(value) =>
            onChange({
              ...profile,
              skills: { ...profile.skills, [name]: value },
            })
          }
          key={name}
          name={name}
          remove={() =>
            onChange({
              ...profile,
              skills: Object.fromEntries(
                Object.entries(profile.skills).filter(([key]) => key !== name),
              ),
            })
          }
          rename={(next) => {
            if (
              !next ||
              ["__proto__", "constructor", "prototype"].includes(next) ||
              (next !== name && next in profile.skills)
            ) {
              setError("Choose a unique, non-empty group name.");
              return;
            }
            setError("");
            onChange({
              ...profile,
              skills: Object.fromEntries(
                Object.entries(profile.skills).map(([key, value]) => [
                  key === name ? next : key,
                  value,
                ]),
              ),
            });
          }}
          skills={skills}
        />
      ))}
    </section>
  );
}
