"use client";
import { useEffect, useState } from "react";

import { createCvVariant } from "@shared/lib/profiles";

import { Button } from "../../buttons/button";
import { SelectField } from "../../forms";
import { CvVersionFields } from "./fields";
import { CvJobReview } from "./job-review";
import type { CvLibrary, CvVersionsProps } from "./types";

export function CvVersionsEditor({
  profile,
  sourceRevision,
  load,
  save,
  downloadHref,
}: CvVersionsProps) {
  const [library, setLibrary] = useState<CvLibrary>({ revision: 0, variants: [] });
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    let cancelled = false;
    load()
      .then((value) => {
        if (!cancelled) setLibrary(value);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "CV storage unavailable. Your portfolio is unchanged. Check that private CV storage is configured.",
          );
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);
  const variant = library.variants.find((item) => item.id === selected);
  const add = (item: CvLibrary["variants"][number]) => {
    setLibrary({ ...library, variants: [...library.variants, item] });
    setSelected(item.id);
    setDirty(true);
  };
  async function persist() {
    setBusy(true);
    setError("");
    try {
      setLibrary(await save(library));
      setDirty(false);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Save failed; your local versions are retained.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Private CV versions" className="editor-card editor-fields">
      <h2>Private CV versions</h2>
      <p>
        Versions are private snapshots, separate from your portfolio and its public CV. Profile
        updates never replace version content. Create a fresh snapshot when you want to use newer
        profile content. Save versions explicitly before downloading.
      </p>
      {error && <p role="alert">{error}</p>}
      <Button
        disabled={busy || library.variants.length >= 8}
        onClick={() => add(createCvVariant(profile, sourceRevision, "New CV version"))}
        type="button"
        variant="outline"
      >
        Create fresh version from profile
      </Button>
      <fieldset disabled={busy}>
        <legend>Version selection</legend>
        <SelectField label="Selected CV version" onChange={setSelected} value={selected}>
          <option value="">Choose a version</option>
          {library.variants.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </SelectField>
      </fieldset>
      {variant && (
        <>
          <p>
            Source profile revision {variant.sourceRevision}. Current editor revision{" "}
            {sourceRevision}. Changes here never update the source.
          </p>
          <Button
            disabled={busy || library.variants.length >= 8}
            onClick={() =>
              add({
                ...structuredClone(variant),
                id: crypto.randomUUID(),
                name: `${variant.name.slice(0, 80)} · copy`,
              })
            }
            type="button"
            variant="outline"
          >
            Duplicate version
          </Button>
          <Button
            disabled={busy}
            onClick={() => {
              setLibrary({
                ...library,
                variants: library.variants.filter((item) => item.id !== variant.id),
              });
              setSelected("");
              setDirty(true);
            }}
            type="button"
            variant="outline"
          >
            Remove version
          </Button>
          <fieldset disabled={busy}>
            <legend>Version draft</legend>
            <CvVersionFields
              onChange={(next) => {
                setLibrary({
                  ...library,
                  variants: library.variants.map((item) => (item.id === next.id ? next : item)),
                });
                setDirty(true);
              }}
              variant={variant}
            />
            <CvJobReview
              disabled={busy || library.variants.length >= 8}
              key={variant.id}
              onCreate={add}
              variant={variant}
            />
          </fieldset>
          {!dirty && (
            <Button href={downloadHref(variant.id)} variant="outline">
              Download saved version
            </Button>
          )}
        </>
      )}
      <Button disabled={busy || !dirty} onClick={persist} type="button">
        {busy ? "Loading or saving…" : "Save CV versions"}
      </Button>
      <p role="status">
        {dirty
          ? "Unsaved CV version changes. Keep this screen open if saving fails."
          : "No unsaved CV version changes."}
      </p>
    </section>
  );
}
