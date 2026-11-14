"use client";
import { type ContactField, contactFields, type PortfolioProfile } from "@shared/config";
import { SelectField } from "@shared/ui/forms";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

import { fieldVisibilityStyles } from "./styles";
import type { FieldVisibilityOptions } from "./types";

function visible(profile: PortfolioProfile, surface: "website" | "cv", key: ContactField) {
  const fields = surface === "website" ? profile.websiteFields : profile.cvFields;
  if (fields?.[key] === false) return false;
  if (surface === "cv" && key === "email") return profile.cvSettings?.showEmail !== false;
  if (surface === "cv" && key === "phone") return profile.cvSettings?.showPhone !== false;
  return true;
}
export function FieldVisibilityEditor({
  profile,
  onChange,
  surfaces = ["website", "cv"],
}: FieldVisibilityOptions) {
  function update(surface: "website" | "cv", key: ContactField, checked: boolean) {
    const field = surface === "website" ? "websiteFields" : "cvFields";
    const next = { ...profile, [field]: { ...profile[field], [key]: checked } };
    if (surface === "cv" && (key === "email" || key === "phone"))
      next.cvSettings = {
        fontSize: 9,
        includeLanguages: true,
        includeProjects: true,
        pageSize: "A4",
        showEmail: true,
        showPhone: true,
        ...profile.cvSettings,
        [key === "email" ? "showEmail" : "showPhone"]: checked,
      };
    onChange(next);
  }
  return (
    <section
      aria-label="Output field visibility"
      className="editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] editor-fields grid grid-cols-2 gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-[18px]"
    >
      <h2>Choose what each output includes</h2>
      <p>
        Website and CV choices are independent. These controls hide structured contact fields;
        review any contact details you wrote in descriptions, images or other authored text
        separately.
      </p>
      {surfaces.includes("website") && (
        <>
          <SelectField
            label="Portfolio discovery"
            onChange={(value) => {
              if (value === "public" || value === "unlisted" || value === "password")
                onChange({ ...profile, publicationVisibility: value });
            }}
            value={profile.publicationVisibility ?? "public"}
          >
            <option value="public">Public · discoverable</option>
            <option value="unlisted">Unlisted · accessible by link</option>
            <option value="password">Password · verified visitors only</option>
          </SelectField>
          <p>
            Unlisted portfolios remain available to anyone with the link. They are excluded from our
            sitemap and request no search indexing. Save and explicitly publish to change the live
            setting.
          </p>
        </>
      )}
      {surfaces.includes("website") && profile.publicationVisibility === "password" && (
        <p>
          Set the password when reviewing publication. Visitors must unlock the page and CV. Visitor
          chat is unavailable in password mode. Images already hosted at public or external URLs
          remain accessible at their source.
        </p>
      )}
      {surfaces.map((surface) => (
        <fieldset key={surface}>
          <legend>
            {surface === "website" ? "Website contact details" : "CV contact details"}
          </legend>
          {contactFields.map((key) => (
            <Label className={fieldVisibilityStyles.checkbox} key={key} unstyled>
              <Input
                checked={visible(profile, surface, key)}
                onChange={(event) => update(surface, key, event.target.checked)}
                type="checkbox"
                unstyled
              />
              Include {key} on {surface}
            </Label>
          ))}
        </fieldset>
      ))}
    </section>
  );
}
