"use client";

import { useEffect, useRef, useState } from "react";

import type { PortfolioProfile } from "@shared/config";
import type { suggestCvEvidence } from "@shared/lib/profiles";

import { Button } from "../../buttons/button";
import type { InterviewPrep, RequestInterviewPrep } from "./types";

export function JobInterviewPrep({
  choices,
  job,
  profile,
  request,
}: {
  choices: ReturnType<typeof suggestCvEvidence>;
  job: string;
  profile: PortfolioProfile;
  request: RequestInterviewPrep;
}) {
  const [prep, setPrep] = useState<InterviewPrep>();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => active.current?.abort(), []);

  async function generate() {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setPending(true);
    setError("");
    setPrep(undefined);
    try {
      const evidence = choices.map((choice) => {
        const facts =
          choice.field === "experiences"
            ? (profile.experiences.find((item) => item.id === choice.id)?.achievements ?? [])
            : [profile.projects.find((item) => item.id === choice.id)?.description ?? ""];
        return {
          facts: facts.slice(0, 8).map((fact) => fact.slice(0, 500)),
          title: choice.title.slice(0, 400),
        };
      });
      setPrep(await request({ evidence, job }, controller.signal));
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(failure instanceof Error ? failure.message : "Interview prep is unavailable.");
    } finally {
      active.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }

  return (
    <section aria-label="Interview preparation" className="editor-fields">
      <p>
        Send the listing and up to ten selected evidence items to the AI provider for a private
        interview brief. This uses one Studio Assistant attempt.
      </p>
      <Button
        disabled={pending || choices.length > 10}
        onClick={generate}
        type="button"
        variant="outline"
      >
        {pending ? "Preparing…" : "Draft interview prep"}
      </Button>
      {choices.length > 10 && <p>Select up to ten items for interview prep.</p>}
      {error && <p role="alert">{error}</p>}
      {prep && (
        <div aria-live="polite">
          <p>{prep.summary}</p>
          <h4>Gaps to verify</h4>
          <p>{prep.gaps.join(" ") || "No specific gaps identified from the supplied evidence."}</p>
          <h4>Practice questions</h4>
          <ol>
            {prep.questions.map((question, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: The generated brief is replaced as one result.
              <li key={index}>{question}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
