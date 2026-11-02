"use client";

import { useState } from "react";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { LinesField } from "../../forms/lines-field";
import { skillsEditorStyles } from "./styles";
import type { SkillGroupOptions, SkillsEditorOptions } from "./types";

function SkillGroup({ name, skills, rename, change, remove }: SkillGroupOptions) {
  const [label, setLabel] = useState(name);
  return (
    <Card asChild layout="plain" surface="portfolio">
      <article className={skillsEditorStyles.element1}>
        <Card asChild layout="plain" surface="portfolio">
          <div className={skillsEditorStyles.element2}>
            <label className={skillsEditorStyles.element3}>
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
              className={skillsEditorStyles.element4}
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
export function SkillsEditor({ profile, onChange }: SkillsEditorOptions) {
  const [error, showError] = useState("");
  return (
    <section>
      <div className={skillsEditorStyles.element5}>
        <div>
          <p className={skillsEditorStyles.element6}>THE TOOLBOX</p>
          <h2>Skills</h2>
        </div>
        <Button
          className={skillsEditorStyles.element7}
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
        <p className={skillsEditorStyles.element8} role="alert">
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
