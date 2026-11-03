"use client";
import { type CvLayout, cvLayouts, type Language } from "@shared/config";

import { Button } from "../../buttons/button";
import { Field, SelectField } from "../../forms";
import type { CvVersionFieldsProps } from "./types";
export function CvVersionFields({ variant, onChange }: CvVersionFieldsProps) {
  const profile = variant.profile;
  const update = (change: Partial<typeof profile>) =>
    onChange({ ...variant, profile: { ...profile, ...change } });
  return (
    <section aria-label="CV version content" className="editor-fields">
      <Field
        label="Version name"
        onChange={(name) => onChange({ ...variant, name })}
        value={variant.name}
      />
      <Field label="Version title" onChange={(title) => update({ title })} value={profile.title} />
      <Field
        label="Version summary"
        onChange={(summary) => update({ summary })}
        value={profile.summary}
      />
      <SelectField
        label="Version language"
        onChange={(cvLanguage) => update({ cvLanguage: cvLanguage as Language })}
        value={profile.cvLanguage ?? "en"}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="tr">Türkçe</option>
      </SelectField>
      <SelectField
        label="Version layout"
        onChange={(cvLayout) => update({ cvLayout: cvLayout as CvLayout })}
        value={profile.cvLayout ?? "classic"}
      >
        {cvLayouts.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </SelectField>
      <h3>Export order</h3>
      <ol>
        {variant.order.map((key, index) => (
          <li key={key}>
            {key}{" "}
            <Button
              disabled={index === 0}
              onClick={() => {
                const order = [...variant.order];
                [order[index - 1], order[index]] = [order[index]!, order[index - 1]!];
                onChange({ ...variant, order });
              }}
              type="button"
              variant="outline"
            >
              Move {key} up
            </Button>
          </li>
        ))}
      </ol>
      <p>
        This is an independent snapshot. Deleting an item below affects only this version; duplicate
        a version before making a selection you may want to reuse.
      </p>
      {profile.experiences.map((item) => (
        <div key={item.id}>
          {item.position} · {item.company}{" "}
          <Button
            onClick={() =>
              update({ experiences: profile.experiences.filter((entry) => entry.id !== item.id) })
            }
            type="button"
            variant="outline"
          >
            Exclude experience: {item.company}
          </Button>
        </div>
      ))}
      {profile.projects.map((item) => (
        <div key={item.id}>
          {item.name}{" "}
          <Button
            onClick={() =>
              update({ projects: profile.projects.filter((entry) => entry.id !== item.id) })
            }
            type="button"
            variant="outline"
          >
            Exclude project: {item.name}
          </Button>
        </div>
      ))}
      {profile.education.map((item) => (
        <div key={item.id}>
          {item.degree} · {item.institution}
          <Button
            onClick={() =>
              update({ education: profile.education.filter((entry) => entry.id !== item.id) })
            }
            type="button"
            variant="outline"
          >
            Exclude education: {item.institution}
          </Button>
        </div>
      ))}
      {profile.languages.map((item) => (
        <div key={item.id}>
          {item.language}
          <Button
            onClick={() =>
              update({ languages: profile.languages.filter((entry) => entry.id !== item.id) })
            }
            type="button"
            variant="outline"
          >
            Exclude language: {item.language}
          </Button>
        </div>
      ))}
      {Object.keys(profile.skills).map((group) => (
        <div key={group}>
          {group}
          <Button
            onClick={() =>
              update({
                skills: Object.fromEntries(
                  Object.entries(profile.skills).filter(([key]) => key !== group),
                ),
              })
            }
            type="button"
            variant="outline"
          >
            Exclude skills: {group}
          </Button>
        </div>
      ))}
    </section>
  );
}
