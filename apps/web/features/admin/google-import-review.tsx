"use client";
import { Field } from "@shared/components/fields";
import type { PortfolioProfile } from "@shared/content";
import {
  applyGoogleProfile,
  type GoogleImportField,
  type GoogleProfileReview,
} from "@shared/lib/google-profile";

const labels: Record<GoogleImportField, string> = {
  birthDate: "Birthdate",
  email: "Public email",
  location: "City / region / country",
  name: "Full name",
  phone: "Phone number",
  title: "Professional title",
};
export function GoogleImportReview({
  profile,
  review,
  selected,
  onSelect,
  onChange,
  onApply,
}: {
  profile: PortfolioProfile;
  review: GoogleProfileReview;
  selected: GoogleImportField[];
  onSelect: (fields: GoogleImportField[]) => void;
  onChange: (review: GoogleProfileReview) => void;
  onApply: () => void;
}) {
  let valid = true;
  try {
    applyGoogleProfile(profile, review, selected);
  } catch {
    valid = false;
  }
  return (
    <section aria-labelledby="google-review-title">
      <h3 id="google-review-title">Review Google profile details</h3>
      <p>
        Choose which fields to replace. Nothing is selected automatically. Applying changes affects
        this draft; use Save changes to keep them. Saving a published portfolio updates its public
        information.
      </p>
      <p>
        Birthdate is optional and may be exposed as saved profile data if you publish. Current page
        and CV layouts do not display it. Leave it unselected if you do not want to share it.
      </p>
      {review.workplace && (
        <p>
          Current organization: {review.workplace}. Add an experience entry yourself when you have
          its dates and details.
        </p>
      )}
      <ul>
        {review.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      {!review.suggestions.length && (
        <p>
          Google did not provide any supported details for these choices. You can still enter them
          manually.
        </p>
      )}
      {review.suggestions.map((suggestion, index) => (
        <div key={suggestion.field}>
          <label>
            <input
              checked={selected.includes(suggestion.field)}
              onChange={(event) =>
                onSelect(
                  event.target.checked
                    ? [...selected, suggestion.field]
                    : selected.filter((field) => field !== suggestion.field),
                )
              }
              type="checkbox"
            />{" "}
            Replace {labels[suggestion.field]}
          </label>
          <p>Current: {profile[suggestion.field] || "Not set"}</p>
          <Field
            label={`Google ${labels[suggestion.field]}`}
            onChange={(value) =>
              onChange({
                ...review,
                suggestions: review.suggestions.map((item, i) =>
                  i === index ? { ...item, value } : item,
                ),
              })
            }
            type={suggestion.field === "birthDate" ? "date" : "text"}
            value={suggestion.value}
          />
        </div>
      ))}
      {!valid && (
        <p role="alert">Check the selected values before applying. Your draft has not changed.</p>
      )}
      <button
        className="studio-primary"
        disabled={!valid || selected.length === 0}
        onClick={onApply}
        type="button"
      >
        Apply selected Google details to draft
      </button>
    </section>
  );
}
