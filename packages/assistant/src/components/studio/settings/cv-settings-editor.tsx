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
    onChange({
      ...profile,
      cvFields: {
        ...profile.cvFields,
        ...(change.showEmail === undefined ? {} : { email: change.showEmail }),
        ...(change.showPhone === undefined ? {} : { phone: change.showPhone }),
      },
      cvSettings: { ...settings, ...change },
    });
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section className="editor-card min-w-0 rounded-xl border border-border/75 bg-card p-md cv-preferences editor-fields grid gap-md sm:grid-cols-2 [&>h2]:text-lg [&>h2]:font-semibold [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-muted-foreground">
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
          <LibraryLabel
            className="editor-checkbox flex min-w-0 items-start gap-xs rounded-lg border border-border/60 p-sm text-sm [&_input]:mt-0.5 [&_input]:size-4 [&_input]:shrink-0 [&_input]:accent-primary"
            key={key}
            unstyled
          >
            <LibraryInput
              checked={
                key === "showEmail"
                  ? settings[key] && profile.cvFields?.email !== false
                  : key === "showPhone"
                    ? settings[key] && profile.cvFields?.phone !== false
                    : settings[key]
              }
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
