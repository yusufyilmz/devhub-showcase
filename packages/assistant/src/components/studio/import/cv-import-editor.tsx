"use client";

import { useEffect, useRef, useState } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { MAX_CV_BYTES } from "@shared/lib/cv-file";
import {
  applyCvDraft,
  type CvImportGroup,
  createCvDraft,
  cvExtractionSchema,
  cvImportGroups,
  cvReviewNotes,
} from "@shared/lib/cv-import";
import { type StudioRequest, useStudioRequest } from "@shared/runtime/studio";
import { StudioButton } from "@shared/ui/button";
import { Card } from "@shared/ui/cards";
import { Input as LibraryInput } from "@shared/ui/input";
import { Label as LibraryLabel } from "@shared/ui/label";
import { Eyebrow } from "@shared/ui/typography";

import { CvImportReview } from "./cv-import-review";

export function CvImportEditor({
  profile,
  onChange,
  embedded = false,
}: {
  embedded?: boolean;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const request = useStudioRequest();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, showError] = useState("");
  const [message, setMessage] = useState("");
  const [candidate, setCandidate] = useState<PortfolioProfile | null>(null);
  const [selected, setSelected] = useState<CvImportGroup[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const pending = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    request(urls.studio.cvImport(), { signal: controller.signal })
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
  }, [request]);
  async function extract() {
    if (!file || !consent) return;
    showError("");
    setMessage("");
    setCandidate(null);
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    try {
      const extracted = await requestCvExtraction(request, file, controller.signal);
      setCandidate(createCvDraft(profile, extracted));
      setNotes(cvReviewNotes(extracted));
      setSelected(
        cvImportGroups.filter(
          (group) => group === "personal" || Object.keys(extracted[group]).length > 0,
        ),
      );
    } catch (reason) {
      if (!controller.signal.aborted)
        showError(reason instanceof Error ? reason.message : "Could not process the CV.");
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <Card asChild layout="plain" surface="portfolio">
      <section
        aria-label={embedded ? "CV upload" : undefined}
        aria-labelledby={embedded ? undefined : "cv-import-title"}
        className="editor-card mb-[18px] rounded-[14px] border border-border bg-card p-7 max-[767px]:p-[18px] cv-import-panel [display:grid] [gap:1rem] [&_input[type='file']]:[max-width:100%]"
      >
        {!embedded && (
          <>
            <Eyebrow>START WITH YOUR EXPERIENCE</Eyebrow>
            <h2 id="cv-import-title">Turn your CV into a portfolio</h2>
            <p>
              Upload your CV, review the extracted details and choose what to use. Your portfolio
              and downloadable CV will use the details you save.
            </p>
          </>
        )}
        {enabled === null && <p role="status">Checking CV import availability…</p>}
        {enabled === false && (
          <p role="status">
            CV import is unavailable right now. You can still enter your details manually.
          </p>
        )}
        <LibraryLabel className="cv-upload-label" htmlFor="cv-upload" unstyled>
          Your CV file
        </LibraryLabel>
        <LibraryInput
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          disabled={busy || !enabled}
          id="cv-upload"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setCandidate(null);
            showError("");
            setMessage("");
          }}
          type="file"
          unstyled
        />
        <p>
          PDF, DOCX or UTF-8 text, up to 3 MB. Scanned PDFs may need a clearer copy. Original files
          are not saved to your account.
        </p>
        <LibraryLabel
          className="editor-checkbox flex items-center gap-2.5 text-xs text-muted-foreground [&_input]:size-4 [&_input]:accent-primary"
          unstyled
        >
          <LibraryInput
            checked={consent}
            disabled={busy}
            onChange={(event) => setConsent(event.target.checked)}
            type="checkbox"
            unstyled
          />{" "}
          Send this CV to OpenAI to extract my portfolio details.
        </LibraryLabel>
        <p>
          The file is sent for this request. OpenAI’s API data retention policies apply. Review the
          result for mistakes before saving.
        </p>
        <div className="cv-import-actions [display:flex] [flex-wrap:wrap] [gap:1rem] [&_button]:[min-height:44px]">
          <StudioButton
            disabled={!enabled || !file || !consent || busy}
            onClick={extract}
            type="button"
          >
            {busy ? "Reading your CV…" : "Process CV"}
          </StudioButton>
          {(busy || candidate) && (
            <StudioButton
              onClick={() => {
                pending.current?.abort();
                setBusy(false);
                setCandidate(null);
                setMessage("Import cancelled. Your draft is unchanged.");
              }}
              tone="secondary"
              type="button"
              variant="outline"
            >
              Cancel import
            </StudioButton>
          )}
        </div>
        {busy && (
          <p aria-live="polite" role="status">
            Extracting your experience, projects and skills. This can take about a minute.
          </p>
        )}
        {error && (
          <p
            className="editor-alert mb-6 rounded-[10px] border border-border px-5 py-4 text-xs leading-[1.8] whitespace-pre-line text-destructive [&_button]:mt-2.5 [&_button]:underline"
            role="alert"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            className="editor-success mb-6 rounded-[10px] border border-border px-5 py-4 text-xs leading-[1.8] text-primary"
            role="status"
          >
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
                embedded
                  ? "Applied to your draft. Continue to review the imported details."
                  : "Applied to your draft. Review required fields, then Save changes when ready.",
              );
            }}
            onChange={setCandidate}
            onSelect={setSelected}
            selected={selected}
          />
        )}
      </section>
    </Card>
  );
}

async function requestCvExtraction(request: StudioRequest, file: File, signal: AbortSignal) {
  if (!file.size || file.size > MAX_CV_BYTES) throw new Error("Choose a nonempty CV up to 3 MB.");
  const form = new FormData();
  form.set("cv", file);
  const response = await request(urls.studio.cvImport(), {
    body: form,
    method: "POST",
    signal,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not process this CV.");
  const extracted = cvExtractionSchema.parse(result);
  if (!extracted.isCv) throw new Error("Choose a readable professional CV.");
  return extracted;
}
