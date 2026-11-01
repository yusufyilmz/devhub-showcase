"use client";

import { useState } from "react";

import type { PortfolioProfile } from "@shared/config";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { LinesField } from "../../forms/lines-field";

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
    <Card asChild layout="plain" surface="portfolio">
      <article className="editor-card">
        <Card asChild layout="plain" surface="portfolio">
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
            <Button
              className="danger-button"
              onClick={() => {
                if (window.confirm(`Remove ${name}?`)) remove();
              }}
              type="button"
            >
              Remove group
            </Button>
          </div>
        </Card>
        <LinesField label={`${name} skills`} onChange={change} value={skills} />
      </article>
    </Card>
  );
}
export function SkillsEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const [error, showError] = useState("");
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">THE TOOLBOX</p>
          <h2>Skills</h2>
        </div>
        <Button
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
          variant="outline"
        >
          + Add group
        </Button>
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
              showError("Choose a unique, non-empty group name.");
              return;
            }
            showError("");
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
