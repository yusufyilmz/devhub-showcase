"use client";
import { useState } from "react";

import {
  type GoogleProfileCategory,
  googleProfileCategories,
  googleProfilePermissions,
} from "@shared/auth/google-profile-scopes";
import type { PortfolioProfile } from "@shared/content";
import { applyGoogleProfile, type GoogleImportField } from "@shared/lib/google-profile";

import { GoogleImportReview } from "./google-import-review";
import { useGoogleImport } from "./use-google-import";

export function GoogleImportEditor({
  profile,
  onChange,
  managed = false,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  managed?: boolean;
}) {
  if (managed)
    return (
      <section className="editor-card">
        <h2>Import from Google</h2>
        <p>Google import is available in your own portfolio workspace.</p>
      </section>
    );
  return <GoogleImportWorkspace onChange={onChange} profile={profile} />;
}
function GoogleImportWorkspace({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const state = useGoogleImport();
  const [categories, setCategories] = useState<GoogleProfileCategory[]>(["basic"]);
  const [consent, setConsent] = useState(false);
  const [selected, setSelected] = useState<GoogleImportField[]>([]);
  const [message, setMessage] = useState("");
  return (
    <section aria-labelledby="google-import-title" className="editor-card">
      <h2 id="google-import-title">Import from Google</h2>
      <p>
        Choose details from a Google account to help fill your portfolio. Google may not have every
        detail. Your MyDevStudio login stays the same.
      </p>
      <p>
        We read only the profile categories you choose, not Gmail messages or contacts. Address
        permission may include an address, but only city, region and country are used. The one-time
        access token is sent to this site to read your profile; it is not saved to your portfolio.
      </p>
      {state.checking && <p role="status">Checking Google import…</p>}
      {!state.checking && !state.clientId && (
        <p>Google import needs site configuration. You can still enter your details manually.</p>
      )}
      <fieldset disabled={state.busy || !state.clientId}>
        <legend>Details to request from Google</legend>
        {googleProfileCategories.map((category) => (
          <label className="editor-checkbox" key={category}>
            <input
              checked={categories.includes(category)}
              onChange={(event) => {
                state.setReview(null);
                setSelected([]);
                setCategories(
                  event.target.checked
                    ? [...categories, category]
                    : categories.filter((item) => item !== category),
                );
              }}
              type="checkbox"
            />{" "}
            {googleProfilePermissions[category].label}
          </label>
        ))}
        <label className="editor-checkbox">
          <input
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (event.target.checked && !state.oauth) state.prepare();
            }}
            type="checkbox"
          />{" "}
          Let MyDevStudio read my selected Google profile details for review.
        </label>
      </fieldset>
      {state.preparing && <p role="status">Preparing Google permission screen…</p>}
      {consent && !state.oauth && !state.preparing && state.clientId && (
        <button className="studio-secondary" onClick={state.prepare} type="button">
          Retry Google setup
        </button>
      )}
      <button
        className="studio-primary"
        disabled={!consent || !state.oauth || !state.clientId || !categories.length || state.busy}
        onClick={() => {
          setMessage("");
          setSelected([]);
          state.connect(categories);
        }}
        type="button"
      >
        Read selected Google details
      </button>
      {(state.busy || state.review) && (
        <button
          className="studio-secondary"
          onClick={() => {
            state.cancel();
            setSelected([]);
          }}
          type="button"
        >
          Cancel Google import
        </button>
      )}
      {state.busy && (
        <p role="status">
          Complete Google's permission screen, then review the shared details here.
        </p>
      )}
      {state.error && <p role="alert">{state.error}</p>}
      {message && <p role="status">{message}</p>}
      {state.review && (
        <GoogleImportReview
          onApply={() => {
            if (!state.review) return;
            onChange(applyGoogleProfile(profile, state.review, selected));
            state.setReview(null);
            setSelected([]);
            setMessage(
              "Applied selected details to your draft. Review them, then Save changes when ready.",
            );
          }}
          onChange={state.setReview}
          onSelect={setSelected}
          profile={profile}
          review={state.review}
          selected={selected}
        />
      )}
      <p>
        You can skip this step or revoke access in your Google account. Removing permission does not
        delete details you already chose to save.
      </p>
    </section>
  );
}
