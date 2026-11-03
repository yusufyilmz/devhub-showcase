"use client";

import type { PortfolioProfile } from "@shared/config";

import { Card } from "../cards";
import { Field, LinesField } from "../forms";
import { profileFieldsStyles } from "./styles";
import type { ProfileFieldsOptions, ProfileFieldsOptions2 } from "./types";

export function ProfileFields({ profile, onChange }: ProfileFieldsOptions) {
  const update = (key: keyof PortfolioProfile, value: ProfileFieldsOptions2) =>
    onChange({ ...profile, [key]: value });
  return (
    <section>
      <div className={profileFieldsStyles.element1}>
        <div>
          <p className={profileFieldsStyles.element2}>THE INTRODUCTION</p>
          <h2>Your profile</h2>
          <p>The details people see first.</p>
        </div>
      </div>
      <Card asChild layout="plain" surface="portfolio">
        <div className={profileFieldsStyles.element3}>
          <Field
            label="Full name"
            onChange={(v) => update("name", v)}
            required
            value={profile.name}
          />
          <Field
            label="Professional title"
            onChange={(v) => update("title", v)}
            required
            value={profile.title}
          />
          <Field
            label="Location"
            onChange={(v) => update("location", v)}
            required
            value={profile.location}
          />
          <Field
            label="Public email"
            onChange={(v) => update("email", v)}
            required
            type="email"
            value={profile.email}
          />
          <Field
            label="Phone"
            onChange={(v) => update("phone", v)}
            type="tel"
            value={profile.phone}
          />
          <Field
            hint="Stored privately if set. Birthdate is excluded from public website and CV snapshots."
            label="Birthdate (optional)"
            onChange={(value) => {
              onChange({ ...profile, birthDate: value || undefined });
            }}
            type="date"
            value={profile.birthDate ?? ""}
          />
          <Field
            label="Portfolio URL"
            onChange={(v) => update("website", v)}
            type="url"
            value={profile.website}
          />
          <Field
            label="GitHub URL"
            onChange={(v) => update("github", v)}
            type="url"
            value={profile.github}
          />
          <Field
            label="LinkedIn URL"
            onChange={(v) => update("linkedin", v)}
            type="url"
            value={profile.linkedin}
          />
          <Field
            hint="Private source CV link. Public CV downloads use the last explicitly published CV snapshot."
            label="CV link"
            onChange={(v) => update("cvUrl", v)}
            value={profile.cvUrl ?? "/cv.pdf"}
          />
          <Field
            label="Short introduction"
            multiline
            onChange={(v) => update("summary", v)}
            required
            value={profile.summary}
          />
          <LinesField
            hint="One paragraph per line. These also inform your AI assistant."
            label="About paragraphs"
            onChange={(v) => update("about", v)}
            value={profile.about}
          />
        </div>
      </Card>
    </section>
  );
}
