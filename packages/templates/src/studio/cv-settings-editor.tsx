"use client";

import { type CvLayout, cvLayouts, type PortfolioProfile } from "@shared/config";
import { Card } from "@shared/ui/cards";
import { SelectField } from "@shared/ui/forms";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";

const defaults: NonNullable<PortfolioProfile["cvSettings"]> = {
  fontSize: 9,
  includeLanguages: true,
  includeProjects: true,
  pageSize: "A4",
  showEmail: true,
  showPhone: true,
};
export function CvSettingsEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const settings = profile.cvSettings ?? defaults;
  const update = (change: Partial<typeof defaults>) =>
    onChange({ ...profile, cvSettings: { ...settings, ...change } });
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className="editor-card editor-fields">
        <h2>Your PDF preferences</h2>
        <SelectField
          label="CV layout"
          onChange={(value) => onChange({ ...profile, cvLayout: value as CvLayout })}
          value={profile.cvLayout ?? "classic"}
        >
          {cvLayouts.map((layout) => (
            <option key={layout.id} value={layout.id}>
              {layout.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Page size"
          onChange={(v) => update({ pageSize: v as "A4" | "LETTER" })}
          value={settings.pageSize}
        >
          <option value="A4">A4</option>
          <option value="LETTER">US Letter</option>
        </SelectField>
        <SelectField
          label="Body text size"
          onChange={(v) => update({ fontSize: Number(v) as 9 | 10 | 11 })}
          value={String(settings.fontSize)}
        >
          <option value="9">Compact (9 pt)</option>
          <option value="10">Standard (10 pt)</option>
          <option value="11">Large (11 pt)</option>
        </SelectField>
        {(
          [
            ["showEmail", "Include email"],
            ["showPhone", "Include phone"],
            ["includeProjects", "Include public projects"],
            ["includeLanguages", "Include languages"],
          ] as const
        ).map(([key, label]) => (
          <LibraryLabel key={key} unstyled>
            <LibraryInput
              checked={settings[key]}
              onChange={(event) => update({ [key]: event.target.checked })}
              type="checkbox"
              unstyled
            />{" "}
            {label}
          </LibraryLabel>
        ))}
        <p>
          ATS-friendly layouts use a single text column and visible URLs. Compatibility varies by
          applicant tracking system; no layout guarantees acceptance. Your Appearance accent applies
          to the other PDF layouts. These settings are saved only to your CV.
        </p>
      </section>
    </Card>
  );
}
