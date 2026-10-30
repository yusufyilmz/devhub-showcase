"use client";
import { useEffect, useRef, useState } from "react";

import type { PortfolioProfile } from "@shared/content";
import { MAX_CV_BYTES } from "@shared/lib/cv-file";
import {
  applyCvDraft,
  type CvImportGroup,
  createCvDraft,
  cvExtractionSchema,
  cvImportGroups,
  cvReviewNotes,
} from "@shared/lib/cv-import";

import { CvImportReview } from "./cv-import-review";

export function CvImportEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [candidate, setCandidate] = useState<PortfolioProfile | null>(null);
  const [selected, setSelected] = useState<CvImportGroup[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const pending = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/cv-import", { signal: controller.signal })
      .then((response) => response.json())
      .then((result) => {
        if (!controller.signal.aborted) setEnabled(result.enabled === true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setEnabled(false);
      });
    return () => {
      controller.abort();
      pending.current?.abort();
    };
  }, []);
  async function extract() {
    if (!file || !consent) return;
    setError("");
    setMessage("");
    setCandidate(null);
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    try {
      const extracted = await requestCvExtraction(file, controller.signal);
      setCandidate(createCvDraft(profile, extracted));
      setNotes(cvReviewNotes(extracted));
      setSelected(
        cvImportGroups.filter(
          (group) => group === "personal" || Object.keys(extracted[group]).length > 0,
        ),
      );
    } catch (reason) {
      if (!controller.signal.aborted)
        setError(reason instanceof Error ? reason.message : "Could not process the CV.");
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <section aria-labelledby="cv-import-title" className="editor-card cv-import-panel">
      <p className="eyebrow">START WITH YOUR EXPERIENCE</p>
      <h2 id="cv-import-title">Turn your CV into a portfolio</h2>
      <p>
        Upload your CV, review the extracted details and choose what to use. Your portfolio and
        downloadable CV will use the details you save.
      </p>
      {enabled === null && <p role="status">Checking CV import availability…</p>}
      {enabled === false && (
        <p role="status">
          CV import is not available right now. You can still add your details in the editor.
        </p>
      )}
      <label className="cv-upload-label" htmlFor="cv-upload">
        Your CV file
      </label>
      <input
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        disabled={busy || !enabled}
        id="cv-upload"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
          setCandidate(null);
          setError("");
          setMessage("");
        }}
        type="file"
      />
      <p>
        PDF, DOCX or UTF-8 text, up to 3 MB. Scanned PDFs may need a clearer copy. Original files
        are not saved to your account.
      </p>
      <label className="editor-checkbox">
        <input
          checked={consent}
          disabled={busy}
          onChange={(event) => setConsent(event.target.checked)}
          type="checkbox"
        />{" "}
        Send this CV to OpenAI to extract my portfolio details.
      </label>
      <p>
        The file is sent for this request. OpenAI’s API data retention policies apply. Review the
        result for mistakes before saving.
      </p>
      <div className="cv-import-actions">
        <button
          className="studio-primary"
          disabled={!enabled || !file || !consent || busy}
          onClick={extract}
          type="button"
        >
          {busy ? "Reading your CV…" : "Process CV"}
        </button>
        {(busy || candidate) && (
          <button
            className="studio-secondary"
            onClick={() => {
              pending.current?.abort();
              setBusy(false);
              setCandidate(null);
              setMessage("Import cancelled. Your draft is unchanged.");
            }}
            type="button"
          >
            Cancel import
          </button>
        )}
      </div>
      {busy && (
        <p aria-live="polite" role="status">
          Extracting your experience, projects and skills. This can take about a minute.
        </p>
      )}
      {error && (
        <p className="editor-alert" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="editor-success" role="status">
          {message}
        </p>
      )}
      {candidate && (
        <CvImportReview
          base={profile}
          candidate={candidate}
          notes={notes}
          onApply={() => {
            onChange(applyCvDraft(profile, candidate, selected));
            setCandidate(null);
            setMessage(
              "Applied to your draft. Review required fields, then Save changes when ready.",
            );
          }}
          onChange={setCandidate}
          onSelect={setSelected}
          selected={selected}
        />
      )}
    </section>
  );
}

async function requestCvExtraction(file: File, signal: AbortSignal) {
  if (!file.size || file.size > MAX_CV_BYTES) throw new Error("Choose a nonempty CV up to 3 MB.");
  const form = new FormData();
  form.set("cv", file);
  const response = await fetch("/api/admin/cv-import", { body: form, method: "POST", signal });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not process this CV.");
  const extracted = cvExtractionSchema.parse(result);
  if (!extracted.isCv) throw new Error("Choose a readable professional CV.");
  return extracted;
}
