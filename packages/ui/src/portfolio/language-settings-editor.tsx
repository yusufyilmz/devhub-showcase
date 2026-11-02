"use client";

import { type Language, languages } from "@shared/config";

import { Card } from "../cards";
import { SelectField } from "../forms";
import { languageSettingsEditorStyles } from "./styles";
import type { LanguageSettingsEditorOptions } from "./types";

export function LanguageSettingsEditor({ profile, onChange }: LanguageSettingsEditorOptions) {
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className={languageSettingsEditorStyles.element1}>
        <h2>Portfolio and CV languages</h2>
        <SelectField
          label="Portfolio language"
          onChange={(value) => onChange({ ...profile, portfolioLanguage: value as Language })}
          value={profile.portfolioLanguage ?? "en"}
        >
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="CV language"
          onChange={(value) => onChange({ ...profile, cvLanguage: value as Language })}
          value={profile.cvLanguage ?? "en"}
        >
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </SelectField>
        <p className={languageSettingsEditorStyles.element2}>
          These settings translate headings, controls and dates. Write your biography, job
          descriptions and project details in the language you want to share. Your saved text is not
          automatically translated.
        </p>
        <p className={languageSettingsEditorStyles.element3}>
          The Languages section lists languages you speak. Your studio and the platform homepage
          currently use English.
        </p>
      </section>
    </Card>
  );
}
