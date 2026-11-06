"use client";

import "./google-import-editor.css";

import { useState } from "react";

import {
  type GoogleProfileCategory,
  googleProfileCategories,
  googleProfilePermissions,
} from "@shared/auth/google-provider";
import { applyGoogleProfile, type GoogleImportField } from "@shared/lib/profiles";

import { Button } from "../buttons";
import { Card } from "../cards";
import { Input as LibraryInput } from "../forms/input/Input";
import { Label as LibraryLabel } from "../forms/label/Label";
import { GoogleImportReview } from "./google-import-review";
import { googleImportEditorStyles } from "./styles";
import type { GoogleImportEditorOptions, GoogleImportWorkspaceOptions } from "./types";
import { useGoogleImport } from "./use-google-import";

export function GoogleImportEditor({
  profile,
  onChange,
  managed = false,
}: GoogleImportEditorOptions) {
  if (managed)
    return (
      <Card asChild layout="plain" surface="portfolio">
        <section className={googleImportEditorStyles.panel}>
          <div className="editor-section-heading">
            <div>
              <p className="eyebrow">Profile import</p>
              <h2>Import from Google</h2>
              <p>Google import is available in your own portfolio workspace.</p>
            </div>
          </div>
        </section>
      </Card>
    );
  return <GoogleImportWorkspace onChange={onChange} profile={profile} />;
}
function GoogleImportWorkspace({ profile, onChange }: GoogleImportWorkspaceOptions) {
  const state = useGoogleImport();
  const [categories, setCategories] = useState<GoogleProfileCategory[]>(["basic"]);
  const [consent, setConsent] = useState(false);
  const [selected, setSelected] = useState<GoogleImportField[]>([]);
  const [message, setMessage] = useState("");
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section aria-labelledby="google-import-title" className={googleImportEditorStyles.panel}>
        <header className="editor-section-heading">
          <div>
            <p className="eyebrow">Profile import</p>
            <h2 id="google-import-title">Import from Google</h2>
            <p>
              Choose the profile details you want to bring into your draft. You’ll review each
              detail before applying it.
            </p>
          </div>
        </header>
        <div className="google-import-privacy">
          <h3>What MyDevStudio can read</h3>
          <p>
            We read only the Google profile categories you choose. Your MyDevStudio sign-in stays
            the same, and Gmail messages and contacts stay private.
          </p>
          <p>
            Location uses only city, region and country, even if the permission includes an address.
            MyDevStudio receives a one-time access token to read your profile for this request.
          </p>
        </div>
        {state.checking && <p role="status">Checking Google import…</p>}
        {!state.checking && !state.clientId && (
          <p>Google import needs site configuration. You can still enter your details manually.</p>
        )}
        <fieldset className="google-import-fields" disabled={state.busy || !state.clientId}>
          <legend>Details to request from Google</legend>
          <div className="google-import-categories">
            {googleProfileCategories.map((category) => (
              <LibraryLabel className={googleImportEditorStyles.option} key={category} unstyled>
                <LibraryInput
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
                  unstyled
                />{" "}
                {googleProfilePermissions[category].label}
              </LibraryLabel>
            ))}
          </div>
          <LibraryLabel className={googleImportEditorStyles.consent} unstyled>
            <LibraryInput
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                if (event.target.checked && !state.oauth) state.prepare();
              }}
              type="checkbox"
              unstyled
            />{" "}
            Let MyDevStudio read my selected Google profile details for review.
          </LibraryLabel>
        </fieldset>
        {state.preparing && <p role="status">Preparing Google permission screen…</p>}
        <div className="google-import-actions">
          {consent && !state.oauth && !state.preparing && state.clientId && (
            <Button
              className={googleImportEditorStyles.secondary}
              onClick={state.prepare}
              type="button"
              variant="outline"
            >
              Retry Google setup
            </Button>
          )}
          <Button
            className={googleImportEditorStyles.primary}
            disabled={
              !consent || !state.oauth || !state.clientId || !categories.length || state.busy
            }
            onClick={() => {
              setMessage("");
              setSelected([]);
              state.connect(categories);
            }}
            type="button"
          >
            Read selected Google details
          </Button>
          {(state.busy || state.review) && (
            <Button
              className={googleImportEditorStyles.secondary}
              onClick={() => {
                state.cancel();
                setSelected([]);
              }}
              type="button"
              variant="outline"
            >
              Cancel Google import
            </Button>
          )}
        </div>
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
        <p className="google-import-note">
          Google may have only some of these details. You can skip import or revoke access in your
          Google account. Previously saved details stay in your portfolio until you remove them.
        </p>
      </section>
    </Card>
  );
}
