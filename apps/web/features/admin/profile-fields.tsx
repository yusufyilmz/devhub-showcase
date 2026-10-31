"use client";
import { Field, LinesField } from "@shared/components/fields";
import type { PortfolioProfile } from "@shared/content";
export function ProfileFields({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const update = (key: keyof PortfolioProfile, value: string | string[]) =>
    onChange({ ...profile, [key]: value });
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">THE INTRODUCTION</p>
          <h2>Your profile</h2>
          <p>The details people see first.</p>
        </div>
      </div>
      <div className="editor-card editor-fields">
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
          hint="Stored as profile data if set and potentially public when published. Current page and CV layouts do not display it."
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
          hint="/cv.pdf generates your CV from published information. An HTTPS URL overrides it."
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
    </section>
  );
}
