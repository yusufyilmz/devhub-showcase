"use client";

import type { PortfolioProfile } from "@shared/config";
import { Button } from "@shared/ui/button";
import { Field, LinesField } from "@shared/ui/forms";

import { profileFieldsStyles } from "./styles";
import type { ProfileFieldsOptions, ProfileFieldsOptions2 } from "./types";

export function ProfileFields({ profile, onChange, onImprove }: ProfileFieldsOptions) {
  const update = (key: keyof PortfolioProfile, value: ProfileFieldsOptions2) =>
    onChange({ ...profile, [key]: value });
  return (
    <section>
      <div className={profileFieldsStyles.element1}>
        <div>
          <p className={profileFieldsStyles.element2}>THE INTRODUCTION</p>
          <h2>Your profile</h2>
          <p>Add your professional details and write the introduction readers will see first.</p>
        </div>
      </div>
      <nav aria-label="Profile details" className="editor-profile-navigation">
        {[
          ["profile-basics", "Basic details"],
          ["profile-introduction", "Introduction"],
          ["profile-contact", "Contact & links"],
        ].map(([id, label]) => (
          <Button
            key={id}
            onClick={() =>
              document
                .getElementById(id ?? "")
                ?.scrollIntoView({ behavior: "auto", block: "start" })
            }
            type="button"
            variant="outline"
          >
            {label}
          </Button>
        ))}
      </nav>
      <section className="editor-profile-section" id="profile-basics">
        <h3>Basic details</h3>
        <div className="editor-fields">
          <Field
            label="Full name"
            onChange={(v) => update("name", v)}
            required
            value={profile.name}
          />
          <Field
            label="Location"
            onChange={(v) => update("location", v)}
            required
            value={profile.location}
          />
          <div className="full-width">
            <Field
              label="Professional title"
              onChange={(v) => update("title", v)}
              required
              value={profile.title}
            />
          </div>
        </div>
      </section>
      <section className="editor-profile-section" id="profile-introduction">
        <h3>Introduction</h3>
        <div className="editor-fields">
          <Field
            label="Short introduction"
            multiline
            onChange={(v) => update("summary", v)}
            required
            value={profile.summary}
          />
          <LinesField
            hint="One paragraph per line. These also inform your AI assistant."
            label="About you"
            onChange={(v) => update("about", v)}
            value={profile.about}
          />
        </div>
        {onImprove && (
          <Button onClick={onImprove} type="button" variant="outline">
            Improve with AI
          </Button>
        )}
      </section>
      <section className="editor-profile-section" id="profile-contact">
        <h3>Contact & links</h3>
        <div className="editor-fields">
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
        </div>
      </section>
    </section>
  );
}
